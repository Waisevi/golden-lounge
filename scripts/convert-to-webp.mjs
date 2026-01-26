import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.join(__dirname, '..', 'public');
const imageExtensions = ['.jpg', '.jpeg', '.png', '.JPG', '.JPEG', '.PNG'];

async function convertToWebp(filePath) {
    try {
        const ext = path.extname(filePath);
        const dir = path.dirname(filePath);
        const basename = path.basename(filePath, ext);
        const webpPath = path.join(dir, `${basename}.webp`);

        // Skip if webp already exists
        if (fs.existsSync(webpPath)) {
            console.log(`⏭️  Skipping ${path.basename(filePath)} (webp already exists)`);
            return;
        }

        console.log(`🔄 Converting ${path.basename(filePath)}...`);
        
        await sharp(filePath)
            .webp({ quality: 85 })
            .toFile(webpPath);

        console.log(`✅ Created ${basename}.webp`);
        
        // Remove original file
        fs.unlinkSync(filePath);
        console.log(`🗑️  Removed original ${path.basename(filePath)}`);
    } catch (error) {
        console.error(`❌ Error converting ${filePath}:`, error.message);
    }
}

async function findAndConvertImages(dir) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            // Skip node_modules and .next
            if (file === 'node_modules' || file === '.next' || file.startsWith('.')) {
                continue;
            }
            await findAndConvertImages(fullPath);
        } else {
            const ext = path.extname(file);
            if (imageExtensions.includes(ext)) {
                await convertToWebp(fullPath);
            }
        }
    }
}

async function main() {
    console.log('🚀 Starting image conversion to WebP...\n');
    
    if (!fs.existsSync(publicDir)) {
        console.error('❌ Public directory not found!');
        process.exit(1);
    }

    await findAndConvertImages(publicDir);
    
    console.log('\n✨ Conversion complete!');
}

main().catch(console.error);
