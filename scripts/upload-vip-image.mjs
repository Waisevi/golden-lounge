import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Try to load environment variables from .env.local
try {
    dotenv.config({ path: '.env.local' });
} catch (e) {
    // If .env.local doesn't exist, try to use system env vars
    console.log('⚠️  .env.local not found, using system environment variables');
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const bucketName = 'assets';

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set');
    console.error('');
    console.error('Please create a .env.local file in the project root with:');
    console.error('  NEXT_PUBLIC_SUPABASE_URL=your_supabase_url');
    console.error('  SUPABASE_SERVICE_ROLE_KEY=your_service_role_key');
    console.error('');
    console.error('Or set these as environment variables before running the script.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

function getContentType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    switch (ext) {
        case '.webp':
            return 'image/webp';
        case '.jpg':
        case '.jpeg':
            return 'image/jpeg';
        case '.png':
            return 'image/png';
        default:
            return 'image/webp';
    }
}

async function uploadVipImage() {
    try {
        const filePath = path.join(__dirname, '..', 'public', 'images', 'gallery', 'vip.webp');
        const storagePath = 'images/gallery/vip.webp';

        // Check if file exists
        if (!fs.existsSync(filePath)) {
            console.error('❌ File not found:', filePath);
            process.exit(1);
        }

        const fileContent = fs.readFileSync(filePath);
        const fileSize = (fileContent.length / 1024 / 1024).toFixed(2);
        const contentType = getContentType(filePath);

        console.log(`📤 Uploading ${storagePath}...`);
        console.log(`📊 File size: ${fileSize}MB`);
        console.log(`📋 Content type: ${contentType}`);

        // Upload with upsert to replace existing file
        const { data, error } = await supabase.storage
            .from(bucketName)
            .upload(storagePath, fileContent, {
                contentType,
                upsert: true, // This will replace the existing file
                cacheControl: '3600',
            });

        if (error) {
            console.error('❌ Upload failed:', error.message);
            process.exit(1);
        }

        const publicUrl = `${supabaseUrl}/storage/v1/object/public/${bucketName}/${storagePath}`;
        console.log('✅ Upload successful!');
        console.log(`🔗 Public URL: ${publicUrl}`);
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

uploadVipImage();
