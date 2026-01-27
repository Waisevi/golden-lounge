import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://czhonxtlovawwjfbxgbx.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6aG9ueHRsb3Zhd3dqZmJ4Z2J4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTI0NzEyMiwiZXhwIjoyMDg0ODIzMTIyfQ.9oqX1rrR632z1LOPFq0aj45kZVDymEBbd9o6aM04fC0';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function revertGalleryFirstImage() {
    console.log('🔄 Reverting first image in gallery...');
    
    // Get the first image (order = 1)
    const { data: galleryItems, error: fetchError } = await supabase
        .from('gallery')
        .select('*')
        .order('order', { ascending: true })
        .limit(1);
    
    if (fetchError) {
        console.error(`❌ Failed to fetch gallery:`, fetchError.message);
        throw fetchError;
    }
    
    if (!galleryItems || galleryItems.length === 0) {
        console.error(`❌ No gallery items found`);
        throw new Error('No gallery items found');
    }
    
    const firstItem = galleryItems[0];
    
    // Revert to the old image path (1.jpg - the original before we uploaded the new 1.webp)
    const oldImagePath = 'images/gallery/1.jpg';
    
    // Update the first item
    const { error: updateError } = await supabase
        .from('gallery')
        .update({ image_url: oldImagePath })
        .eq('id', firstItem.id);
    
    if (updateError) {
        console.error(`❌ Failed to update gallery:`, updateError.message);
        throw updateError;
    }
    
    console.log(`✅ Reverted gallery item ${firstItem.id} to: ${oldImagePath}`);
    console.log('✨ Revert complete!');
}

revertGalleryFirstImage().catch(console.error);
