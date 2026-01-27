import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://czhonxtlovawwjfbxgbx.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6aG9ueHRsb3Zhd3dqZmJ4Z2J4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTI0NzEyMiwiZXhwIjoyMDg0ODIzMTIyfQ.9oqX1rrR632z1LOPFq0aj45kZVDymEBbd9o6aM04fC0';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function forceUpdateGallery8() {
    try {
        // Get all items to find 8th
        const { data: allItems, error: fetchError } = await supabase
            .from('gallery')
            .select('*')
            .order('order', { ascending: true });
        
        if (fetchError) {
            console.error('❌ Error:', fetchError.message);
            return;
        }
        
        const item8 = allItems?.find(item => item.order === 8) || allItems?.[7];
        
        if (!item8) {
            console.error('❌ No 8th item found');
            return;
        }
        
        console.log('📋 Current 8th item:');
        console.log(`   ID: ${item8.id}`);
        console.log(`   Current Image URL: ${item8.image_url}`);
        
        // Force update to ensure correct path
        const { error: updateError } = await supabase
            .from('gallery')
            .update({ 
                image_url: 'images/gallery/8.webp'
            })
            .eq('id', item8.id);
        
        if (updateError) {
            console.error('❌ Update error:', updateError.message);
        } else {
            console.log('✅ Force updated 8th item to: images/gallery/8.webp');
            
            // Verify
            const { data: updatedItem } = await supabase
                .from('gallery')
                .select('*')
                .eq('id', item8.id)
                .single();
            
            if (updatedItem) {
                console.log('\n✅ Verification:');
                console.log(`   Image URL: ${updatedItem.image_url}`);
                console.log(`   Order: ${updatedItem.order}`);
            }
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

forceUpdateGallery8();
