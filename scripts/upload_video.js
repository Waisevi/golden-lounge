const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = 'https://czhonxtlovawwjfbxgbx.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6aG9ueHRsb3Zhd3dqZmJ4Z2J4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTI0NzEyMiwiZXhwIjoyMDg0ODIzMTIyfQ.9oqX1rrR632z1LOPFq0aj45kZVDymEBbd9o6aM04fC0';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function uploadVideo() {
    const filePath = path.join(process.cwd(), 'public', 'video', 'hero.mp4');

    if (!fs.existsSync(filePath)) {
        console.error('Error: Local file not found at', filePath);
        process.exit(1);
    }

    const fileBuffer = fs.readFileSync(filePath);

    console.log('Uploading hero.mp4 to Supabase Storage (bucket: assets)...');

    const { data, error } = await supabase.storage
        .from('assets')
        .upload('video/hero.mp4', fileBuffer, {
            contentType: 'video/mp4',
            upsert: true
        });

    if (error) {
        console.error('Upload failed:', error.message);
        process.exit(1);
    }

    console.log('Video uploaded successfully!');
    console.log('Public URL:', `${supabaseUrl}/storage/v1/object/public/assets/video/hero.mp4`);
}

uploadVideo();
