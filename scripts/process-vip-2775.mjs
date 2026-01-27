import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function processImage() {
    try {
        const inputPath = path.join(__dirname, '..', 'public', 'DSCF2775.JPG');
        const outputPath = path.join(__dirname, '..', 'public', 'images', 'gallery', 'vip.webp');

        // Check if file exists
        if (!fs.existsSync(inputPath)) {
            console.error('❌ Файл DSCF2775.JPG не найден в public/');
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
        let scale = 1.0; // Начальный масштаб
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
                // В диапазоне 2.7-3 МБ
                console.log('✅ Размер в целевом диапазоне (около 3MB)');
                break;
            } else if (outputSize > targetSize) {
                // Если слишком большой, уменьшаем качество или масштаб
                if (quality <= 55 && scale > 0.7) {
                    scale -= 0.05;
                    minQuality = 50;
                    maxQuality = 90;
                } else {
                    maxQuality = quality - 1;
                }
            } else if (outputSize < (targetSize * 0.9)) {
                // Если слишком маленький, увеличиваем качество
                minQuality = quality + 1;
            }

            attempts++;
        }

        const finalSizeMB = outputSize / 1024 / 1024;
        console.log(`\n✅ Файл создан: ${finalSizeMB.toFixed(2)}MB`);
        console.log(`📁 Сохранен как: ${outputPath}`);
        console.log(`\n✨ Готово! Изображение vip.webp обновлено.`);
        
    } catch (error) {
        console.error('❌ Ошибка:', error.message);
        process.exit(1);
    }
}

processImage();
