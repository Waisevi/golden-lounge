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

async function processImage() {
    try {
        const inputPath = path.join(__dirname, '..', 'public', 'images', 'gallery', 'vip.webp');
        const tempPath = path.join(__dirname, '..', 'public', 'images', 'gallery', 'vip_temp.webp');
        const outputPath = path.join(__dirname, '..', 'public', 'images', 'gallery', 'vip.webp');
        const storagePath = 'images/gallery/vip.webp';

        if (!fs.existsSync(inputPath)) {
            console.error('❌ Файл vip.webp не найден');
            process.exit(1);
        }

        console.log('📸 Восстанавливаю исходное положение изображения...');
        const inputStats = fs.statSync(inputPath);
        console.log(`📊 Исходный размер: ${(inputStats.size / 1024 / 1024).toFixed(2)}MB`);

        // Получаем метаданные
        const metadata = await sharp(inputPath).metadata();
        const originalWidth = metadata.width;
        const originalHeight = metadata.height;
        
        console.log(`📐 Текущие размеры: ${originalWidth}x${originalHeight}`);
        console.log('🔄 Поворачиваю на 90° по часовой стрелке (возвращаю в исходное положение)...');

        // Сжимаем до 1 МБ с поворотом обратно
        let quality = 70;
        let outputSize = 0;
        let attempts = 0;
        const maxAttempts = 20;
        let minQuality = 40;
        let maxQuality = 85;
        let scale = 1.0;
        const targetSize = 1 * 1024 * 1024; // 1MB

        while (attempts < maxAttempts) {
            quality = Math.round((minQuality + maxQuality) / 2);
            const width = Math.round(originalWidth * scale);
            const height = Math.round(originalHeight * scale);
            
            await sharp(inputPath)
                .rotate(90) // Поворот на 90° по часовой стрелке (возврат в исходное)
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
            
            console.log(`Попытка ${attempts + 1}: Качество=${quality}, Масштаб=${(scale*100).toFixed(0)}%, Размер=${sizeMB.toFixed(2)}MB`);

            if (outputSize <= targetSize && outputSize >= (targetSize * 0.9)) {
                console.log('✅ Размер в целевом диапазоне (около 1MB)');
                break;
            } else if (outputSize > targetSize) {
                if (quality <= 50 && scale > 0.6) {
                    scale -= 0.05;
                    minQuality = 40;
                    maxQuality = 85;
                } else {
                    maxQuality = quality - 1;
                }
            } else if (outputSize < (targetSize * 0.9)) {
                minQuality = quality + 1;
            }

            attempts++;
        }

        // Заменяем оригинальный файл
        if (fs.existsSync(outputPath)) {
            fs.unlinkSync(outputPath);
        }
        fs.renameSync(tempPath, outputPath);

        const finalSizeMB = outputSize / 1024 / 1024;
        const finalMetadata = await sharp(outputPath).metadata();
        console.log(`\n✅ Файл обработан:`);
        console.log(`   Размер: ${finalSizeMB.toFixed(2)}MB`);
        console.log(`   Размеры: ${finalMetadata.width}x${finalMetadata.height}`);
        console.log(`   📁 Путь: ${outputPath}`);

        // Загружаем в Supabase
        console.log('\n📤 Загружаю в Supabase Storage...');
        const fileContent = fs.readFileSync(outputPath);

        const { error: uploadError } = await supabase.storage
            .from(bucketName)
            .upload(storagePath, fileContent, {
                contentType: 'image/webp',
                upsert: true,
                cacheControl: '3600',
            });

        if (uploadError) {
            console.error('❌ Ошибка загрузки:', uploadError.message);
            process.exit(1);
        }

        const publicUrl = `${supabaseUrl}/storage/v1/object/public/${bucketName}/${storagePath}`;
        console.log('✅ Загружено в Supabase Storage');
        console.log(`🔗 URL: ${publicUrl}`);
        console.log(`\n✨ Готово! Изображение возвращено в исходное положение.`);
        
    } catch (error) {
        console.error('❌ Ошибка:', error.message);
        process.exit(1);
    }
}

processImage();
