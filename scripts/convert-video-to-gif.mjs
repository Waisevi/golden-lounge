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

async function convertToGif(videoPath, outputPath, options = {}) {
    const {
        width = 800,
        fps = 15,
        startTime = 0,
        duration = 10,
        quality = 'medium' // low, medium, high
    } = options;

    // Palette for better quality
    const palettePath = outputPath.replace('.gif', '_palette.png');
    
    const qualitySettings = {
        low: { scale: '320:-1', colors: 128 },
        medium: { scale: '640:-1', colors: 256 },
        high: { scale: '800:-1', colors: 256 }
    };

    const settings = qualitySettings[quality] || qualitySettings.medium;

    try {
        console.log(`🔄 Converting ${path.basename(videoPath)} to GIF...`);
        console.log(`   Settings: ${width}px width, ${fps}fps, ${duration}s duration, ${quality} quality`);

        // Step 1: Generate palette for better colors
        const paletteCmd = `ffmpeg -y -i "${videoPath}" -vf "fps=${fps},scale=${settings.scale}:flags=lanczos,palettegen=max_colors=${settings.colors}" "${palettePath}"`;
        console.log(`   Step 1/2: Generating palette...`);
        execSync(paletteCmd, { stdio: 'inherit' });

        // Step 2: Create GIF using palette
        const gifCmd = `ffmpeg -y -i "${videoPath}" -i "${palettePath}" -lavfi "fps=${fps},scale=${settings.scale}:flags=lanczos[x];[x][1:v]paletteuse" -t ${duration} -ss ${startTime} "${outputPath}"`;
        console.log(`   Step 2/2: Creating GIF...`);
        execSync(gifCmd, { stdio: 'inherit' });

        // Clean up palette
        if (fs.existsSync(palettePath)) {
            fs.unlinkSync(palettePath);
        }

        const stats = fs.statSync(outputPath);
        const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
        console.log(`✅ Created ${path.basename(outputPath)} (${sizeMB} MB)\n`);
        
        return true;
    } catch (error) {
        console.error(`❌ Error converting ${videoPath}:`, error.message);
        // Clean up on error
        if (fs.existsSync(palettePath)) {
            try { fs.unlinkSync(palettePath); } catch {}
        }
        return false;
    }
}

async function main() {
    console.log('🚀 Starting video to GIF conversion...\n');

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
            output: 'about.gif',
            options: {
                width: 640,
                fps: 12,
                duration: 8,
                quality: 'medium'
            }
        },
        // Hero video is too large for GIF, keep as MP4
        // {
        //     input: 'hero.mp4',
        //     output: 'hero.gif',
        //     options: {
        //         width: 800,
        //         fps: 15,
        //         duration: 10,
        //         quality: 'medium'
        //     }
        // }
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

        await convertToGif(inputPath, outputPath, video.options);
    }

    console.log('✨ Conversion complete!');
    console.log('\n💡 Note: GIF files are still large. Consider using:');
    console.log('   - WebP animated format (better compression)');
    console.log('   - Or keep videos but optimize them (lower bitrate, resolution)');
}

main().catch(console.error);
