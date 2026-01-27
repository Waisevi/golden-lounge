import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://czhonxtlovawwjfbxgbx.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6aG9ueHRsb3Zhd3dqZmJ4Z2J4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTI0NzEyMiwiZXhwIjoyMDg0ODIzMTIyfQ.9oqX1rrR632z1LOPFq0aj45kZVDymEBbd9o6aM04fC0';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function verifyGallery8() {
    try {
        // Get 8th item
        const { data: allItems, error: fetchError } = await supabase
            .from('gallery')
            .select('*')
            .order('order', { ascending: true });
        
        if (fetchError) {
            console.error('❌ Error:', fetchError.message);
            return;
        }
        
        const galleryItems = allItems ? [allItems.find(item => item.order === 8) || allItems[7]].filter(Boolean) : [];
        const error = null;
        
        if (error) {
            console.error('❌ Error:', error.message);
            return;
        }
        
        if (!galleryItems || galleryItems.length === 0) {
            console.error('❌ No item with order 8 found');
            return;
        }
        
        const item8 = galleryItems[0];
        console.log('📋 Current 8th item:');
        console.log(`   ID: ${item8.id}`);
        console.log(`   Image URL: ${item8.image_url}`);
        console.log(`   Order: ${item8.order}`);
        
        // Verify file exists in storage
        const { data: fileData, error: fileError } = await supabase.storage
            .from('assets')
            .list('images/gallery', {
                search: '8.webp'
            });
        
        if (fileError) {
            console.error('❌ Error checking file:', fileError.message);
        } else {
            console.log('\n📦 File in Storage:');
            if (fileData && fileData.length > 0) {
                const file = fileData[0];
                console.log(`   Name: ${file.name}`);
                console.log(`   Size: ${(file.metadata?.size / 1024 / 1024).toFixed(2)} MB`);
                console.log(`   Updated: ${file.updated_at}`);
            } else {
                console.log('   ❌ File not found!');
            }
        }
        
        // Ensure correct path
        if (item8.image_url !== 'images/gallery/8.webp') {
            console.log('\n🔄 Updating image_url to correct path...');
            const { error: updateError } = await supabase
                .from('gallery')
                .update({ image_url: 'images/gallery/8.webp' })
                .eq('id', item8.id);
            
            if (updateError) {
                console.error('❌ Update error:', updateError.message);
            } else {
                console.log('✅ Updated to: images/gallery/8.webp');
            }
        } else {
            console.log('\n✅ Image URL is correct: images/gallery/8.webp');
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

verifyGallery8();
