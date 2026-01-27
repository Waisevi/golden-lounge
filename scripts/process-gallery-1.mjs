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
        const inputPath = path.join(__dirname, '..', 'public', 'DSCF2808.JPG');
        const outputPath = path.join(__dirname, '..', 'public', 'images', 'gallery', '1.webp');
        const storagePath = 'images/gallery/1.webp';

        // Check if file exists
        if (!fs.existsSync(inputPath)) {
            console.error('❌ Файл DSCF2808.JPG не найден в public/');
            process.exit(1);
        }

        console.log('📸 Обрабатываю изображение...');
        const inputStats = fs.statSync(inputPath);
        console.log(`📊 Исходный размер: ${(inputStats.size / 1024 / 1024).toFixed(2)}MB`);

        // Получаем размеры исходного изображения
        const metadata = await sharp(inputPath).metadata();
        const originalWidth = metadata.width;
        const originalHeight = metadata.height;
        
        // Сжимаем до 3 МБ
        let quality = 75;
        let outputSize = 0;
        let attempts = 0;
        const maxAttempts = 20;
        let minQuality = 50;
        let maxQuality = 90;
        let scale = 1.0;
        const targetSize = 3 * 1024 * 1024; // 3MB

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
                .toFile(outputPath);
            
            const outputStats = fs.statSync(outputPath);
            outputSize = outputStats.size;
            const sizeMB = outputSize / 1024 / 1024;
            
            console.log(`Попытка ${attempts + 1}: Качество=${quality}, Масштаб=${(scale*100).toFixed(0)}%, Размер=${sizeMB.toFixed(2)}MB`);

            if (outputSize <= targetSize && outputSize >= (targetSize * 0.9)) {
                console.log('✅ Размер в целевом диапазоне (около 3MB)');
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

        const finalSizeMB = outputSize / 1024 / 1024;
        console.log(`\n✅ Файл создан: ${finalSizeMB.toFixed(2)}MB`);
        console.log(`📁 Локальный путь: ${outputPath}`);

        // Загружаем в Supabase Storage
        console.log('\n📤 Загружаю в Supabase Storage...');
        const fileContent = fs.readFileSync(outputPath);

        const { data: uploadData, error: uploadError } = await supabase.storage
            .from(bucketName)
            .upload(storagePath, fileContent, {
                contentType: 'image/webp',
                upsert: true,
                cacheControl: '3600',
            });

        if (uploadError) {
            console.error('❌ Ошибка загрузки в Storage:', uploadError.message);
            process.exit(1);
        }

        console.log('✅ Загружено в Supabase Storage');

        // Обновляем запись в базе данных (первое изображение с order=1)
        console.log('\n🔄 Обновляю запись в базе данных...');
        const { data: galleryData, error: fetchError } = await supabase
            .from('gallery')
            .select('id')
            .eq('"order"', 1)
            .limit(1)
            .single();

        if (fetchError && fetchError.code !== 'PGRST116') {
            console.error('❌ Ошибка при получении записи:', fetchError.message);
            process.exit(1);
        }

        if (galleryData) {
            // Обновляем существующую запись
            const { error: updateError } = await supabase
                .from('gallery')
                .update({ 
                    image_url: storagePath,
                    alt_text: 'Lounge Gallery 1',
                    'order': 1
                })
                .eq('id', galleryData.id);

            if (updateError) {
                console.error('❌ Ошибка при обновлении:', updateError.message);
                process.exit(1);
            }
            console.log('✅ Запись обновлена в базе данных');
        } else {
            // Создаем новую запись
            const { error: insertError } = await supabase
                .from('gallery')
                .insert({
                    image_url: storagePath,
                    alt_text: 'Lounge Gallery 1',
                    order: 1
                });

            if (insertError) {
                console.error('❌ Ошибка при создании записи:', insertError.message);
                process.exit(1);
            }
            console.log('✅ Новая запись создана в базе данных');
        }

        const publicUrl = `${supabaseUrl}/storage/v1/object/public/${bucketName}/${storagePath}`;
        console.log('\n✨ Готово!');
        console.log(`🔗 URL: ${publicUrl}`);
        console.log(`📊 Размер: ${finalSizeMB.toFixed(2)}MB`);
        
    } catch (error) {
        console.error('❌ Ошибка:', error.message);
        process.exit(1);
    }
}

processAndUpload();
