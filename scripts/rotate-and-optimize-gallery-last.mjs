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
const maxSizeBytes = 1 * 1024 * 1024; // 1 MB (уменьшили для быстрой загрузки)

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function downloadFromStorage(storagePath, localPath) {
    console.log(`📥 Downloading from Supabase Storage: ${storagePath}...`);
    
    const { data, error } = await supabase.storage
        .from(bucketName)
        .download(storagePath);
    
    if (error) {
        console.error(`❌ Failed to download:`, error.message);
        throw error;
    }
    
    // Convert blob to buffer and save
    const arrayBuffer = await data.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(localPath, buffer);
    
    console.log(`✅ Downloaded to: ${localPath}`);
    return localPath;
}

async function rotateAndOptimize(inputPath, outputPath, maxSizeBytes) {
    console.log(`🔄 Rotating counter-clockwise and optimizing ${path.basename(inputPath)}...`);
    
    let quality = 80;
    let currentSize = 0;
    let buffer;
    const metadata = await sharp(inputPath).metadata();
    
    // Rotate counter-clockwise (rotate -90 degrees = rotate 270 degrees)
    let width = metadata.width;
    let height = metadata.height;
    
    // After rotation, dimensions swap
    const rotatedWidth = height;
    const rotatedHeight = width;
    
    // Start with reasonable max dimensions to reduce file size
    const maxDimension = 2000; // Max width or height
    let targetWidth = rotatedWidth;
    let targetHeight = rotatedHeight;
    
    if (targetWidth > maxDimension || targetHeight > maxDimension) {
        if (targetWidth > targetHeight) {
            targetWidth = maxDimension;
            targetHeight = Math.floor((targetHeight * maxDimension) / rotatedWidth);
        } else {
            targetHeight = maxDimension;
            targetWidth = Math.floor((targetWidth * maxDimension) / rotatedHeight);
        }
    }
    
    console.log(`   Original: ${width}x${height}, After rotation: ${rotatedWidth}x${rotatedHeight}, Target: ${targetWidth}x${targetHeight}`);
    
    // Rotate and resize
    do {
        buffer = await sharp(inputPath)
            .rotate(-90) // Rotate counter-clockwise
            .resize(targetWidth, targetHeight, { fit: 'inside', withoutEnlargement: true })
            .webp({ quality })
            .toBuffer();
        
        currentSize = buffer.length;
        
        if (currentSize > maxSizeBytes && quality > 20) {
            quality -= 5;
            console.log(`   Trying quality ${quality}... (${(currentSize / 1024 / 1024).toFixed(2)} MB)`);
        } else if (currentSize > maxSizeBytes && targetWidth > 500) {
            // If still too large, reduce dimensions
            targetWidth = Math.floor(targetWidth * 0.9);
            targetHeight = Math.floor(targetHeight * 0.9);
            console.log(`   Reducing size to ${targetWidth}x${targetHeight}...`);
        } else {
            // Save the file
            fs.writeFileSync(outputPath, buffer);
            console.log(`✅ Created ${path.basename(outputPath)} (${(currentSize / 1024 / 1024).toFixed(2)} MB, quality: ${quality}, size: ${targetWidth}x${targetHeight})`);
            return buffer;
        }
    } while (currentSize > maxSizeBytes && (quality > 20 || targetWidth > 500));
    
    fs.writeFileSync(outputPath, buffer);
    console.log(`✅ Created ${path.basename(outputPath)} (${(currentSize / 1024 / 1024).toFixed(2)} MB)`);
    return buffer;
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

async function getLastGalleryItem() {
    console.log(`🔄 Getting last gallery item...`);
    
    const { data: galleryItems, error: fetchError } = await supabase
        .from('gallery')
        .select('*')
        .order('order', { ascending: false })
        .limit(1);
    
    if (fetchError) {
        console.error(`❌ Failed to fetch gallery:`, fetchError.message);
        throw fetchError;
    }
    
    if (!galleryItems || galleryItems.length === 0) {
        console.error(`❌ No gallery items found`);
        throw new Error('No gallery items found');
    }
    
    return galleryItems[0];
}

async function main() {
    try {
        const publicDir = path.join(process.cwd(), 'public');
        const tempDir = path.join(publicDir, 'temp');
        
        // Create temp directory if it doesn't exist
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }
        
        console.log('🚀 Starting image rotation and optimization...\n');
        
        // Step 1: Get last gallery item
        const lastItem = await getLastGalleryItem();
        console.log(`📋 Last gallery item: order ${lastItem.order}, image: ${lastItem.image_url}\n`);
        
        const storagePath = lastItem.image_url;
        const tempInput = path.join(tempDir, 'gallery-last-original.webp');
        const tempOutput = path.join(tempDir, 'gallery-last-rotated.webp');
        
        // Step 2: Download current image from storage
        await downloadFromStorage(storagePath, tempInput);
        
        // Step 3: Rotate and optimize
        await rotateAndOptimize(tempInput, tempOutput, maxSizeBytes);
        
        // Step 4: Upload back to storage
        await uploadToStorage(tempOutput, storagePath);
        
        // Step 5: Clean up temp files
        if (fs.existsSync(tempInput)) {
            fs.unlinkSync(tempInput);
            console.log(`🗑️  Deleted temp file: ${path.basename(tempInput)}`);
        }
        if (fs.existsSync(tempOutput)) {
            fs.unlinkSync(tempOutput);
            console.log(`🗑️  Deleted temp file: ${path.basename(tempOutput)}`);
        }
        
        console.log('\n✨ All done! Image rotated counter-clockwise and optimized.');
    } catch (error) {
        console.error('\n❌ Error:', error.message);
        process.exit(1);
    }
}

main().catch(console.error);
