// Test script for Supabase connection and new columns
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

// Read .env.local manually
const envContent = readFileSync('.env.local', 'utf-8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && valueParts.length > 0) {
    envVars[key.trim()] = valueParts.join('=').trim();
  }
});

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = envVars.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Supabase niet geconfigureerd');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runTests() {
  console.log('🔍 Test 1: Supabase connectie...');

  // Test 1: Check connection by fetching orders
  const { data: orders, error: ordersError } = await supabase
    .from('cv_orders')
    .select('*')
    .limit(1);

  if (ordersError) {
    console.error('❌ Connectie fout:', ordersError.message);

    // Check if table exists
    if (ordersError.message.includes('does not exist')) {
      console.log('\n📋 Tabel bestaat niet. Voer de migratie uit in Supabase SQL Editor.');
      console.log('   Zie: supabase-migration.sql');
    }
    return;
  }

  console.log('✅ Supabase connectie werkt!');
  console.log(`   Gevonden orders: ${orders?.length || 0}`);

  // Test 2: Check if new columns exist by trying to insert a test order
  console.log('\n🔍 Test 2: Nieuwe kolommen (address, cv_data)...');

  const testOrder = {
    status: 'nieuw',
    customer_name: 'Test Gebruiker',
    customer_email: 'test@test.nl',
    customer_phone: '0612345678',
    customer_address: 'Teststraat',
    customer_house_number: '123',
    customer_postal_code: '1234AB',
    customer_city: 'Amsterdam',
    cv_id: 'test-cv-id',
    template_used: 'modern',
    cv_data: {
      id: 'test',
      personal: {
        firstName: 'Test',
        lastName: 'Gebruiker',
        email: 'test@test.nl'
      },
      meta: {
        selectedTemplate: 'modern',
        selectedColorScheme: 'emerald'
      }
    },
    amount: 42.00,
    dossier_number: `RB-TEST-${Date.now()}`
  };

  const { data: insertedOrder, error: insertError } = await supabase
    .from('cv_orders')
    .insert(testOrder)
    .select()
    .single();

  if (insertError) {
    console.error('❌ Insert fout:', insertError.message);

    if (insertError.message.includes('customer_address') ||
        insertError.message.includes('cv_data')) {
      console.log('\n📋 Nieuwe kolommen ontbreken. Voer deze SQL uit in Supabase:');
      console.log('');
      console.log('ALTER TABLE cv_orders ADD COLUMN IF NOT EXISTS customer_address VARCHAR(255);');
      console.log('ALTER TABLE cv_orders ADD COLUMN IF NOT EXISTS customer_house_number VARCHAR(20);');
      console.log('ALTER TABLE cv_orders ADD COLUMN IF NOT EXISTS customer_postal_code VARCHAR(10);');
      console.log('ALTER TABLE cv_orders ADD COLUMN IF NOT EXISTS customer_city VARCHAR(100);');
      console.log('ALTER TABLE cv_orders ADD COLUMN IF NOT EXISTS cv_data JSONB;');
    }
    return;
  }

  console.log('✅ Nieuwe kolommen werken!');
  console.log(`   Order ID: ${insertedOrder.id}`);
  console.log(`   Dossier: ${insertedOrder.dossier_number}`);
  console.log(`   Adres: ${insertedOrder.customer_address} ${insertedOrder.customer_house_number}`);
  console.log(`   CV Data: ${insertedOrder.cv_data ? 'Aanwezig' : 'Niet aanwezig'}`);

  // Test 3: Verify we can read the cv_data back
  console.log('\n🔍 Test 3: CV data ophalen...');

  const { data: fetchedOrder, error: fetchError } = await supabase
    .from('cv_orders')
    .select('*')
    .eq('id', insertedOrder.id)
    .single();

  if (fetchError) {
    console.error('❌ Fetch fout:', fetchError.message);
    return;
  }

  console.log('✅ CV data succesvol opgehaald!');
  console.log(`   Naam in CV: ${fetchedOrder.cv_data?.personal?.firstName} ${fetchedOrder.cv_data?.personal?.lastName}`);

  // Cleanup: Delete test order
  console.log('\n🧹 Test order opruimen...');

  const { error: deleteError } = await supabase
    .from('cv_orders')
    .delete()
    .eq('id', insertedOrder.id);

  if (deleteError) {
    console.error('⚠️  Kon test order niet verwijderen:', deleteError.message);
  } else {
    console.log('✅ Test order verwijderd');
  }

  console.log('\n✅ Alle tests geslaagd! Supabase is correct geconfigureerd.');
}

runTests().catch(console.error);
