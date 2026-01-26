import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.join(__dirname, '..', 'public', 'video');

// Check if ffmpeg is available
function checkFFmpeg() {
    try {
        execSync('ffmpeg -version', { stdio: 'ignore' });
        return true;
    } catch (error) {
        return false;
    }
}

async function convertToWebP(videoPath, outputPath, options = {}) {
    const {
        width = 800,
        fps = 15,
        startTime = 0,
        duration = 10,
        quality = 80
    } = options;

    try {
        console.log(`🔄 Converting ${path.basename(videoPath)} to animated WebP...`);
        console.log(`   Settings: ${width}px width, ${fps}fps, ${duration}s duration, quality ${quality}%`);

        // Convert to WebP animated format
        // WebP animation requires libwebp encoder
        const cmd = `ffmpeg -y -i "${videoPath}" -vf "fps=${fps},scale=${width}:-1:flags=lanczos" -ss ${startTime} -t ${duration} -vcodec libwebp -lossless 0 -compression_level 6 -q:v ${quality} -loop 0 -preset default -an "${outputPath}"`;
        
        execSync(cmd, { stdio: 'inherit' });

        const stats = fs.statSync(outputPath);
        const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
        const originalStats = fs.statSync(videoPath);
        const originalSizeMB = (originalStats.size / (1024 * 1024)).toFixed(2);
        const reduction = ((1 - stats.size / originalStats.size) * 100).toFixed(1);
        
        console.log(`✅ Created ${path.basename(outputPath)}`);
        console.log(`   Size: ${sizeMB} MB (was ${originalSizeMB} MB, ${reduction}% reduction)\n`);
        
        return true;
    } catch (error) {
        console.error(`❌ Error converting ${videoPath}:`, error.message);
        return false;
    }
}

async function main() {
    console.log('🚀 Starting video to animated WebP conversion...\n');

    if (!checkFFmpeg()) {
        console.error('❌ FFmpeg is not installed!');
        console.error('\n📦 To install FFmpeg on macOS, run:');
        console.error('   brew install ffmpeg');
        console.error('\n   Or visit: https://ffmpeg.org/download.html');
        process.exit(1);
    }

    if (!fs.existsSync(publicDir)) {
        console.error('❌ Video directory not found!');
        process.exit(1);
    }

    const videos = [
        {
            input: 'about.mp4',
            output: 'about.webp',
            options: {
                width: 640,
                fps: 12,
                duration: 8,
                quality: 75
            }
        }
    ];

    for (const video of videos) {
        const inputPath = path.join(publicDir, video.input);
        const outputPath = path.join(publicDir, video.output);

        if (!fs.existsSync(inputPath)) {
            console.log(`⏭️  Skipping ${video.input} (file not found)`);
            continue;
        }

        if (fs.existsSync(outputPath)) {
            console.log(`⏭️  Skipping ${video.input} (${video.output} already exists)`);
            continue;
        }

        await convertToWebP(inputPath, outputPath, video.options);
    }

    console.log('✨ Conversion complete!');
    console.log('\n💡 Animated WebP is much smaller than GIF and has better quality!');
}

main().catch(console.error);
