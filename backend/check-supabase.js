require('dotenv').config();
console.log('\n=== SUPABASE CONFIG CHECK ===');
console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? '✅ Set (' + process.env.SUPABASE_URL.substring(0, 30) + '...)' : '❌ Not set');
console.log('SUPABASE_SERVICE_KEY:', process.env.SUPABASE_SERVICE_KEY ? '✅ Set (hidden)' : '❌ Not set');
