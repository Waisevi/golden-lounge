import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://czhonxtlovawwjfbxgbx.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6aG9ueHRsb3Zhd3dqZmJ4Z2J4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTI0NzEyMiwiZXhwIjoyMDg0ODIzMTIyfQ.9oqX1rrR632z1LOPFq0aj45kZVDymEBbd9o6aM04fC0';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function deleteNewImage() {
    console.log('🗑️  Deleting new gallery image from storage...');
    
    // Delete the new 1.webp that we uploaded
    const { data, error } = await supabase.storage
        .from('assets')
        .remove(['images/gallery/1.webp']);
    
    if (error) {
        console.error(`❌ Failed to delete:`, error.message);
        throw error;
    }
    
    console.log(`✅ Deleted images/gallery/1.webp from storage`);
    console.log('✨ Done! The old image (1.jpg) should now be displayed.');
}

deleteNewImage().catch(console.error);
