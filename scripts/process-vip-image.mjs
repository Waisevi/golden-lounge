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

async function processAndUpload() {
    try {
        // Ищем файл DSCF2750.JPG
        const possiblePaths = [
            path.join(__dirname, '..', 'public', 'DSCF2750.JPG'),
            path.join(__dirname, '..', 'public', 'DSCF2750.jpg'),
            path.join(__dirname, '..', 'DSCF2750.JPG'),
            path.join(__dirname, '..', 'DSCF2750.jpg'),
        ];

        let inputPath = null;
        for (const p of possiblePaths) {
            if (fs.existsSync(p)) {
                inputPath = p;
                break;
            }
        }

        if (!inputPath) {
            console.error('❌ Файл DSCF2750.JPG не найден в public/');
            console.error('Пожалуйста, убедитесь, что файл находится в папке public/');
            process.exit(1);
        }

        const outputPath = path.join(__dirname, '..', 'public', 'images', 'gallery', 'vip.webp');
        const storagePath = 'images/gallery/vip.webp';

        console.log('📸 Обрабатываю изображение...');
        const inputStats = fs.statSync(inputPath);
        console.log(`📊 Исходный размер: ${(inputStats.size / 1024 / 1024).toFixed(2)}MB`);

        // Сжимаем до 2-3 МБ
        // Сначала получаем размеры исходного изображения
        const metadata = await sharp(inputPath).metadata();
        const originalWidth = metadata.width;
        const originalHeight = metadata.height;
        
        let quality = 75;
        let outputSize = 0;
        let attempts = 0;
        const maxAttempts = 20;
        let minQuality = 50;
        let maxQuality = 90;
        let scale = 1.0; // Начальный масштаб

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
                    effort: 6 // Более агрессивное сжатие
                })
                .toFile(outputPath);
            
            const outputStats = fs.statSync(outputPath);
            outputSize = outputStats.size;
            const sizeMB = outputSize / 1024 / 1024;
            
            console.log(`Попытка ${attempts + 1}: Качество=${quality}, Масштаб=${(scale*100).toFixed(0)}%, Размер=${sizeMB.toFixed(2)}MB`);

            if (outputSize >= 2 * 1024 * 1024 && outputSize <= 3 * 1024 * 1024) {
                console.log('✅ Размер в целевом диапазоне (2-3MB)');
                break;
            } else if (outputSize > 3 * 1024 * 1024) {
                // Если слишком большой, уменьшаем качество или масштаб
                if (quality <= 55 && scale > 0.7) {
                    scale -= 0.05; // Уменьшаем размер изображения
                    minQuality = 50;
                    maxQuality = 90;
                } else {
                    maxQuality = quality - 1;
                }
            } else if (outputSize < 2 * 1024 * 1024) {
                // Если слишком маленький, увеличиваем качество
                minQuality = quality + 1;
            }

            attempts++;
        }

        const finalSizeMB = outputSize / 1024 / 1024;
        console.log(`\n✅ Файл создан: ${finalSizeMB.toFixed(2)}MB`);

        // Загружаем в Supabase
        console.log('\n📤 Загружаю в Supabase...');
        const fileContent = fs.readFileSync(outputPath);

        const { data, error } = await supabase.storage
            .from(bucketName)
            .upload(storagePath, fileContent, {
                contentType: 'image/webp',
                upsert: true,
                cacheControl: '3600',
            });

        if (error) {
            console.error('❌ Ошибка загрузки:', error.message);
            process.exit(1);
        }

        const publicUrl = `${supabaseUrl}/storage/v1/object/public/${bucketName}/${storagePath}`;
        console.log('✅ Загрузка успешна!');
        console.log(`🔗 URL: ${publicUrl}`);
        console.log(`\n✨ Готово! Изображение обновлено в блоке VIP Room.`);
        
    } catch (error) {
        console.error('❌ Ошибка:', error.message);
        process.exit(1);
    }
}

processAndUpload();
