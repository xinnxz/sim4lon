/**
 * Test Supabase Connection & Create Buckets
 */
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

async function main() {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_KEY;
    
    if (!url || !key) {
        console.log('❌ Supabase credentials not configured');
        return;
    }
    
    const supabase = createClient(url, key);
    console.log('\n=== SUPABASE CONNECTION TEST ===\n');
    
    // List existing buckets
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
        console.error('❌ Failed to connect:', listError.message);
        return;
    }
    
    console.log('✅ Connected to Supabase!');
    console.log('📦 Existing buckets:', buckets.map(b => b.name).join(', ') || 'None');
    
    // Create avatars bucket if not exists
    const bucketsToCreate = ['avatars', 'logos', 'products'];
    
    for (const bucketName of bucketsToCreate) {
        if (!buckets.find(b => b.name === bucketName)) {
            const { error: createError } = await supabase.storage.createBucket(bucketName, {
                public: true,
                fileSizeLimit: 5 * 1024 * 1024, // 5MB
            });
            
            if (createError) {
                console.log(`❌ Failed to create '${bucketName}':`, createError.message);
            } else {
                console.log(`✅ Created bucket: ${bucketName}`);
            }
        } else {
            console.log(`✓ Bucket '${bucketName}' already exists`);
        }
    }
    
    console.log('\n🎉 Supabase Storage ready!');
}

main().catch(console.error);
