import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

const PUBLIC_DIR = path.join(process.cwd(), 'public');

async function getFiles(dir) {
    try {
        const dirents = await fs.readdir(dir, { withFileTypes: true });
        const files = await Promise.all(dirents.map((dirent) => {
            const res = path.resolve(dir, dirent.name);
            return dirent.isDirectory() ? getFiles(res) : res;
        }));
        return files.flat();
    } catch (err) {
        console.error(`Error reading directory ${dir}:`, err);
        return [];
    }
}

async function convert() {
    console.log('Starting image conversion...');
    const files = await getFiles(PUBLIC_DIR);
    const images = files.filter(f => /\.(png|jpg|jpeg)$/i.test(f));

    console.log(`Found ${images.length} images to convert.`);

    for (const file of images) {
        const ext = path.extname(file);
        const newFile = file.replace(new RegExp(`${ext}$`), '.webp');

        try {
            await sharp(file)
                .webp({ quality: 80 })
                .toFile(newFile);

            await fs.unlink(file);
            console.log(`Converted: ${path.relative(PUBLIC_DIR, file)} -> ${path.relative(PUBLIC_DIR, newFile)}`);
        } catch (err) {
            console.error(`Error converting ${file}:`, err);
        }
    }
    console.log('Conversion complete.');
}

convert();
