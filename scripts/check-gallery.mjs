import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://czhonxtlovawwjfbxgbx.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6aG9ueHRsb3Zhd3dqZmJ4Z2J4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTI0NzEyMiwiZXhwIjoyMDg0ODIzMTIyfQ.9oqX1rrR632z1LOPFq0aj45kZVDymEBbd9o6aM04fC0';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkGallery() {
    console.log('🔍 Checking gallery images...\n');
    
    const { data: galleryItems, error } = await supabase
        .from('gallery')
        .select('*')
        .order('order', { ascending: true });
    
    if (error) {
        console.error(`❌ Failed to fetch gallery:`, error.message);
        throw error;
    }
    
    if (!galleryItems || galleryItems.length === 0) {
        console.error(`❌ No gallery items found`);
        return;
    }
    
    console.log('Current gallery images:');
    galleryItems.forEach((item, index) => {
        console.log(`${index + 1}. Order: ${item.order}, Image: ${item.image_url}, ID: ${item.id}`);
    });
    
    console.log('\nFirst image (order = 1):');
    const firstItem = galleryItems.find(item => item.order === 1) || galleryItems[0];
    console.log(`  ID: ${firstItem.id}`);
    console.log(`  Image URL: ${firstItem.image_url}`);
    console.log(`  Alt text: ${firstItem.alt_text}`);
}

checkGallery().catch(console.error);
