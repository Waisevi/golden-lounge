import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function listPath(prefix, acc = []) {
  const { data: entries, error } = await supabase.storage.from('assets').list(prefix || '', { limit: 500 });
  if (error) {
    console.error('List error:', error.message);
    return acc;
  }
  for (const e of entries || []) {
    const path = prefix ? `${prefix}/${e.name}` : e.name;
    if (e.id == null) {
      await listPath(path, acc);
    } else {
      acc.push(path);
    }
  }
  return acc;
}

async function main() {
  const files = await listPath('');
  console.log('Supabase Storage (assets):');
  files.sort().forEach((f) => console.log('  ', f));
  console.log('\nTotal:', files.length);
}

main().catch(console.error);
