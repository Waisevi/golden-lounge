import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const bucketName = 'assets';

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function uploadFile(filePath, relativePath) {
    const fileContent = fs.readFileSync(filePath);
    const contentType = getContentType(filePath);

    const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(relativePath.replace(/\\/g, '/'), fileContent, {
            contentType,
            upsert: true,
        });

    if (error) {
        console.error(`❌ Failed to upload ${relativePath}:`, error.message);
    } else {
        console.log(`✅ Uploaded: ${relativePath}`);
    }
}

function getContentType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    switch (ext) {
        case '.jpg':
        case '.jpeg':
            return 'image/jpeg';
        case '.png':
            return 'image/png';
        case '.svg':
            return 'image/svg+xml';
        case '.mp4':
            return 'video/mp4';
        case '.webp':
            return 'image/webp';
        default:
            return 'application/octet-stream';
    }
}

async function walkAndUpload(dir, baseDir) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            await walkAndUpload(fullPath, baseDir);
        } else {
            const relativePath = path.relative(baseDir, fullPath);
            // Skip system files
            if (file === '.DS_Store' || file === 'llms.txt' || file.endsWith('.svg')) {
                // Keep SVGs local as they are usually small icons
                continue;
            }
            await uploadFile(fullPath, relativePath);
        }
    }
}

async function main() {
    console.log('🚀 Starting migration to Supabase Storage...');

    // 📦 Ensure bucket exists
    console.log(`📦 Checking if bucket "${bucketName}" exists...`);
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();

    if (listError) {
        console.error('❌ Error listing buckets:', listError.message);
        process.exit(1);
    }

    const bucketExists = buckets.some(b => b.name === bucketName);

    if (!bucketExists) {
        console.log(`➕ Creating public bucket "${bucketName}"...`);
        const { error: createError } = await supabase.storage.createBucket(bucketName, {
            public: true,
            allowedMimeTypes: ['image/*', 'video/*'],
            fileSizeLimit: 524288000 // 500MB
        });

        if (createError) {
            console.error('❌ Failed to create bucket:', createError.message);
            process.exit(1);
        }
        console.log('✅ Bucket created successfully.');
    } else {
        console.log(`✅ Bucket "${bucketName}" already exists. Updating limits...`);
        const { error: updateError } = await supabase.storage.updateBucket(bucketName, {
            public: true,
            allowedMimeTypes: ['image/*', 'video/*'],
            fileSizeLimit: 524288000 // 500MB
        });
        if (updateError) {
            console.error('❌ Failed to update bucket:', updateError.message);
        } else {
            console.log('✅ Bucket limits updated to 500MB.');
        }
    }

    const publicDir = path.join(process.cwd(), 'public');

    // Folders to migrate
    const folders = ['images', 'video'];

    for (const folder of folders) {
        const targetDir = path.join(publicDir, folder);
        if (fs.existsSync(targetDir)) {
            console.log(`\n📁 Migrating ${folder}...`);
            await walkAndUpload(targetDir, publicDir);
        }
    }

    console.log('\n✨ Migration complete!');
}

main().catch(console.error);
