
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const files = [
    { src: "public/karaoke empty 1.jpg", dest: "public/karaoke-empty-1.webp" },
    { src: "public/karaoke 2 empty 3.jpg", dest: "public/karaoke-empty-2.webp" },
    { src: "public/karaoke 3 empty 2.jpg", dest: "public/karaoke-empty-3.webp" },
    { src: "public/vip room empty 2.jpg", dest: "public/vip-empty-1.webp" },
    { src: "public/vip room 2 empty 3.jpg", dest: "public/vip-empty-2.webp" },
    { src: "public/vip zone empty1.jpg", dest: "public/vip-empty-3.webp" }
];

async function processImages() {
    for (const file of files) {
        try {
            if (fs.existsSync(file.src)) {
                console.log(`Processing: ${file.src} -> ${file.dest}`);
                await sharp(file.src)
                    .resize(1920, null, { withoutEnlargement: true }) // Max width 1920
                    .webp({ quality: 80 })
                    .toFile(file.dest);

                console.log(`Success! Deleting original: ${file.src}`);
                fs.unlinkSync(file.src);
            } else {
                console.warn(`Skipping missing file: ${file.src}`);
            }
        } catch (err) {
            console.error(`Error processing ${file.src}:`, err);
        }
    }
}

processImages();
