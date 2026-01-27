import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });
// Also try loading from .env if .env.local doesn't exist
dotenv.config({ path: '.env' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://czhonxtlovawwjfbxgbx.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6aG9ueHRsb3Zhd3dqZmJ4Z2J4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTI0NzEyMiwiZXhwIjoyMDg0ODIzMTIyfQ.9oqX1rrR632z1LOPFq0aj45kZVDymEBbd9o6aM04fC0';
const bucketName = 'assets';
const maxSizeBytes = 2 * 1024 * 1024; // 2 MB

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function compressAndConvertToWebp(inputPath, outputPath, maxSizeBytes) {
    console.log(`🔄 Processing ${path.basename(inputPath)}...`);
    
    let quality = 85;
    let currentSize = 0;
    let buffer;
    
    // Start with quality 85 and reduce if needed
    do {
        buffer = await sharp(inputPath)
            .webp({ quality })
            .toBuffer();
        
        currentSize = buffer.length;
        
        if (currentSize > maxSizeBytes && quality > 20) {
            quality -= 5;
            console.log(`   Trying quality ${quality}... (${(currentSize / 1024 / 1024).toFixed(2)} MB)`);
        } else {
            // Save the file
            fs.writeFileSync(outputPath, buffer);
            console.log(`✅ Created ${path.basename(outputPath)} (${(currentSize / 1024 / 1024).toFixed(2)} MB, quality: ${quality})`);
            return buffer;
        }
    } while (currentSize > maxSizeBytes && quality > 20);
    
    // If still too large, resize the image
    if (currentSize > maxSizeBytes) {
        console.log(`   File still too large, resizing image...`);
        const metadata = await sharp(inputPath).metadata();
        let width = metadata.width;
        let height = metadata.height;
        
        // Reduce dimensions by 10% each iteration
        while (currentSize > maxSizeBytes && width > 100) {
            width = Math.floor(width * 0.9);
            height = Math.floor(height * 0.9);
            
            buffer = await sharp(inputPath)
                .resize(width, height, { fit: 'inside', withoutEnlargement: true })
                .webp({ quality: 80 })
                .toBuffer();
            
            currentSize = buffer.length;
            console.log(`   Resized to ${width}x${height}... (${(currentSize / 1024 / 1024).toFixed(2)} MB)`);
        }
        
        fs.writeFileSync(outputPath, buffer);
        console.log(`✅ Created ${path.basename(outputPath)} (${(currentSize / 1024 / 1024).toFixed(2)} MB)`);
        return buffer;
    }
}

async function uploadToStorage(filePath, storagePath) {
    console.log(`📤 Uploading to Supabase Storage...`);
    
    const fileContent = fs.readFileSync(filePath);
    
    const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(storagePath, fileContent, {
            contentType: 'image/webp',
            upsert: true,
        });
    
    if (error) {
        console.error(`❌ Failed to upload:`, error.message);
        throw error;
    }
    
    console.log(`✅ Uploaded to: ${storagePath}`);
    return storagePath;
}

async function updateGalleryLastImage(imagePath) {
    console.log(`🔄 Updating last image in gallery...`);
    
    // Get all gallery items ordered by order
    const { data: galleryItems, error: fetchError } = await supabase
        .from('gallery')
        .select('*')
        .order('order', { ascending: false }); // Descending to get last item first
    
    if (fetchError) {
        console.error(`❌ Failed to fetch gallery:`, fetchError.message);
        throw fetchError;
    }
    
    if (!galleryItems || galleryItems.length === 0) {
        console.error(`❌ No gallery items found`);
        throw new Error('No gallery items found');
    }
    
    // Get the last item (highest order)
    const lastItem = galleryItems[0];
    
    if (!lastItem) {
        console.error(`❌ No last gallery item found`);
        throw new Error('No last gallery item found');
    }
    
    // Update the last item
    const { error: updateError } = await supabase
        .from('gallery')
        .update({ image_url: imagePath })
        .eq('id', lastItem.id);
    
    if (updateError) {
        console.error(`❌ Failed to update gallery:`, updateError.message);
        throw updateError;
    }
    
    console.log(`✅ Updated gallery item ${lastItem.id} (order: ${lastItem.order}) with new image: ${imagePath}`);
}

async function main() {
    try {
        const publicDir = path.join(process.cwd(), 'public');
        const inputFile = path.join(publicDir, 'DSCF2921.JPG');
        const outputFile = path.join(publicDir, 'gallery-last.webp');
        
        // Check if input file exists
        if (!fs.existsSync(inputFile)) {
            console.error(`❌ File not found: ${inputFile}`);
            process.exit(1);
        }
        
        console.log('🚀 Starting image processing...\n');
        
        // Step 1: Compress and convert to WebP (max 2 MB)
        await compressAndConvertToWebp(inputFile, outputFile, maxSizeBytes);
        
        // Step 2: Get the last item's order to determine storage path
        const { data: galleryItems } = await supabase
            .from('gallery')
            .select('*')
            .order('order', { ascending: false })
            .limit(1);
        
        const lastOrder = galleryItems?.[0]?.order || 8;
        const storagePath = `images/gallery/${lastOrder}.webp`;
        
        // Step 3: Upload to Supabase Storage
        await uploadToStorage(outputFile, storagePath);
        
        // Step 4: Update gallery in database (last item)
        await updateGalleryLastImage(storagePath);
        
        // Step 5: Delete original file from public
        if (fs.existsSync(inputFile)) {
            fs.unlinkSync(inputFile);
            console.log(`🗑️  Deleted original file: ${path.basename(inputFile)}`);
        }
        
        // Step 6: Delete temporary webp from public (optional, since it's in storage now)
        if (fs.existsSync(outputFile)) {
            fs.unlinkSync(outputFile);
            console.log(`🗑️  Deleted temporary file: ${path.basename(outputFile)}`);
        }
        
        console.log('\n✨ All done!');
    } catch (error) {
        console.error('\n❌ Error:', error.message);
        process.exit(1);
    }
}

main().catch(console.error);
