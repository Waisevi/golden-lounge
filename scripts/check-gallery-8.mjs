import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://czhonxtlovawwjfbxgbx.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6aG9ueHRsb3Zhd3dqZmJ4Z2J4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTI0NzEyMiwiZXhwIjoyMDg0ODIzMTIyfQ.9oqX1rrR632z1LOPFq0aj45kZVDymEBbd9o6aM04fC0';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkGallery8() {
    try {
        // Get all gallery items
        const { data: galleryItems, error } = await supabase
            .from('gallery')
            .select('*')
            .order('order', { ascending: true });
        
        if (error) {
            console.error('❌ Error:', error.message);
            return;
        }
        
        console.log('📋 Gallery items:');
        galleryItems.forEach((item, index) => {
            console.log(`\n${index + 1}. Order: ${item.order}`);
            console.log(`   ID: ${item.id}`);
            console.log(`   Image URL: ${item.image_url}`);
            console.log(`   Alt text: ${item.alt_text || 'N/A'}`);
        });
        
        // Check 8th item specifically
        const item8 = galleryItems.find(item => item.order === 8) || galleryItems[7];
        if (item8) {
            console.log('\n🎯 8th item details:');
            console.log(`   Order: ${item8.order}`);
            console.log(`   Image URL: ${item8.image_url}`);
            console.log(`   Full URL: ${supabaseUrl}/storage/v1/object/public/assets/${item8.image_url}`);
        }
        
        // List files in storage
        console.log('\n📦 Files in Supabase Storage (images/gallery/):');
        const { data: files, error: listError } = await supabase.storage
            .from('assets')
            .list('images/gallery', {
                limit: 100,
                sortBy: { column: 'name', order: 'asc' }
            });
        
        if (listError) {
            console.error('❌ Error listing files:', listError.message);
        } else {
            files.forEach(file => {
                console.log(`   - ${file.name} (${(file.metadata?.size / 1024 / 1024).toFixed(2)} MB)`);
            });
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

checkGallery8();
