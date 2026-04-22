// scripts/upload-intro-frame.mjs
// Uploads extracted video last frame to Supabase Storage intro/ bucket
// Used by AFS-1 Task 1 to fix cinematic → quick menu zoom mismatch
//
// Usage:
//   node scripts/upload-intro-frame.mjs <path-to-png>
//
// Env vars required (from .env.local):
//   NEXT_PUBLIC_SUPABASE_URL
//   SUPABASE_SERVICE_ROLE_KEY

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'node:fs';
import { basename } from 'node:path';
import { config } from 'dotenv';

config({ path: '.env.local' });

const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim();
const SERVICE_KEY = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('ERROR: Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const inputPath = process.argv[2];
if (!inputPath) {
  console.error('ERROR: Provide path to PNG as first argument');
  console.error('Example: node scripts/upload-intro-frame.mjs /tmp/stil_picture_intro_1920x1080.png');
  process.exit(1);
}

const fileBuffer = readFileSync(inputPath);
const targetName = 'stil_picture_intro.png';

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false },
});

console.log(`Uploading ${inputPath} → intro/${targetName} (${(fileBuffer.length / 1024).toFixed(1)} KB)`);

const { data, error } = await supabase.storage
  .from('intro')
  .upload(targetName, fileBuffer, {
    contentType: 'image/png',
    upsert: true,
    cacheControl: '31536000', // 1 year cache, bust via URL version if needed
  });

if (error) {
  console.error('Upload failed:', error.message);
  process.exit(1);
}

const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/intro/${targetName}`;

console.log('\n✅ Upload success');
console.log(`Path: ${data.path}`);
console.log(`Public URL: ${publicUrl}`);
console.log('\nVerify with:');
console.log(`  curl -I "${publicUrl}"`);
console.log('\nClear Vercel edge cache if needed: Vercel dashboard → Settings → Data Cache → Purge');
