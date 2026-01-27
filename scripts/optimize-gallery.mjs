import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const bucketName = 'assets';

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function optimizeImage(inputPath, outputPath, targetSize = 3 * 1024 * 1024) {
    try {
        const stats = fs.statSync(inputPath);
        const currentSize = stats.size;
        
        // Если файл уже меньше целевого размера и это webp, просто копируем
        if (currentSize <= targetSize && path.extname(inputPath).toLowerCase() === '.webp') {
            if (inputPath !== outputPath) {
                fs.copyFileSync(inputPath, outputPath);
            }
            console.log(`  ✓ Уже оптимизирован (${(currentSize / 1024 / 1024).toFixed(2)}MB)`);
            return true;
        }

        // Используем временный файл, если входной и выходной файлы одинаковые
        const tempPath = inputPath === outputPath 
            ? path.join(path.dirname(inputPath), `temp_${path.basename(inputPath)}`)
            : outputPath;

        const metadata = await sharp(inputPath).metadata();
        const originalWidth = metadata.width;
        const originalHeight = metadata.height;
        
        let quality = 75;
        let outputSize = 0;
        let attempts = 0;
        const maxAttempts = 20;
        let minQuality = 50;
        let maxQuality = 90;
        let scale = 1.0;

        while (attempts < maxAttempts) {
            quality = Math.round((minQuality + maxQuality) / 2);
            const width = Math.round(originalWidth * scale);
            const height = Math.round(originalHeight * scale);
            
            await sharp(inputPath)
                .resize(width, height, { 
                    fit: 'inside',
                    withoutEnlargement: true 
                })
                .webp({ 
                    quality,
                    effort: 6
                })
                .toFile(tempPath);
            
            const outputStats = fs.statSync(tempPath);
            outputSize = outputStats.size;
            const sizeMB = outputSize / 1024 / 1024;
            
            if (outputSize <= targetSize && outputSize >= (targetSize * 0.9)) {
                console.log(`  ✅ Оптимизирован до ${sizeMB.toFixed(2)}MB (качество=${quality}, масштаб=${(scale*100).toFixed(0)}%)`);
                break;
            } else if (outputSize > targetSize) {
                if (quality <= 55 && scale > 0.7) {
                    scale -= 0.05;
                    minQuality = 50;
                    maxQuality = 90;
                } else {
                    maxQuality = quality - 1;
                }
            } else if (outputSize < (targetSize * 0.9)) {
                minQuality = quality + 1;
            }

            attempts++;
        }

        // Если использовали временный файл, заменяем оригинал
        if (tempPath !== outputPath) {
            if (fs.existsSync(outputPath)) {
                fs.unlinkSync(outputPath);
            }
            fs.renameSync(tempPath, outputPath);
        }

        return true;
    } catch (error) {
        console.error(`  ❌ Ошибка: ${error.message}`);
        return false;
    }
}

async function uploadToSupabase(filePath, storagePath) {
    try {
        const fileContent = fs.readFileSync(filePath);
        
        const { error } = await supabase.storage
            .from(bucketName)
            .upload(storagePath, fileContent, {
                contentType: 'image/webp',
                upsert: true,
                cacheControl: '3600',
            });

        if (error) {
            console.error(`  ❌ Ошибка загрузки: ${error.message}`);
            return false;
        }
        
        return true;
    } catch (error) {
        console.error(`  ❌ Ошибка: ${error.message}`);
        return false;
    }
}

async function main() {
    console.log('🚀 Оптимизация всех изображений галереи до 3MB...\n');
    
    const galleryDir = path.join(__dirname, '..', 'public', 'images', 'gallery');
    const files = fs.readdirSync(galleryDir);
    
    const imageFiles = files.filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext);
    });

    console.log(`Найдено ${imageFiles.length} изображений для обработки\n`);

    for (const file of imageFiles) {
        const inputPath = path.join(galleryDir, file);
        const ext = path.extname(file).toLowerCase();
        const basename = path.basename(file, ext);
        const outputPath = path.join(galleryDir, `${basename}.webp`);
        const storagePath = `images/gallery/${basename}.webp`;

        console.log(`📸 Обрабатываю: ${file}`);
        
        const stats = fs.statSync(inputPath);
        const currentSizeMB = stats.size / 1024 / 1024;
        console.log(`  Исходный размер: ${currentSizeMB.toFixed(2)}MB`);

        // Оптимизируем изображение
        const optimized = await optimizeImage(inputPath, outputPath);
        
        if (!optimized) {
            console.log(`  ⏭️  Пропущено\n`);
            continue;
        }

        const finalStats = fs.statSync(outputPath);
        const finalSizeMB = finalStats.size / 1024 / 1024;
        console.log(`  Финальный размер: ${finalSizeMB.toFixed(2)}MB`);

        // Загружаем в Supabase
        console.log(`  📤 Загружаю в Supabase...`);
        const uploaded = await uploadToSupabase(outputPath, storagePath);
        
        if (uploaded) {
            console.log(`  ✅ Загружено в Supabase Storage\n`);
        } else {
            console.log(`  ⚠️  Не удалось загрузить в Supabase\n`);
        }

        // Удаляем оригинальный файл, если это не webp
        if (ext !== '.webp' && inputPath !== outputPath) {
            fs.unlinkSync(inputPath);
            console.log(`  🗑️  Удален оригинальный файл ${file}\n`);
        }
    }

    console.log('✨ Оптимизация завершена!');
}

main().catch(console.error);
