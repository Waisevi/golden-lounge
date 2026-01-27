import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://czhonxtlovawwjfbxgbx.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6aG9ueHRsb3Zhd3dqZmJ4Z2J4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTI0NzEyMiwiZXhwIjoyMDg0ODIzMTIyfQ.9oqX1rrR632z1LOPFq0aj45kZVDymEBbd9o6aM04fC0';

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function uploadVideo() {
    try {
        const filePath = path.join(process.cwd(), 'public', 'gd.mp4');

        if (!fs.existsSync(filePath)) {
            console.error('❌ Error: File not found at', filePath);
            process.exit(1);
        }

        const fileBuffer = fs.readFileSync(filePath);
        const fileSize = (fileBuffer.length / 1024 / 1024).toFixed(2);

        console.log(`📤 Uploading gd.mp4 to Supabase Storage (bucket: assets)...`);
        console.log(`📊 File size: ${fileSize}MB`);

        // Upload as video/gd.mp4 (will replace about.mp4 path in component)
        const { data, error } = await supabase.storage
            .from('assets')
            .upload('video/gd.mp4', fileBuffer, {
                contentType: 'video/mp4',
                upsert: true,
                cacheControl: '3600',
            });

        if (error) {
            console.error('❌ Upload failed:', error.message);
            process.exit(1);
        }

        console.log('✅ Video uploaded successfully!');
        console.log(`🔗 Public URL: ${supabaseUrl}/storage/v1/object/public/assets/video/gd.mp4`);
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

uploadVideo();
