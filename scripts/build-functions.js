// scripts/build-functions.js
const esbuild = require('esbuild');

esbuild.build({
  entryPoints: ['./functions-src/api.ts'],
  bundle: true,
  platform: 'node',
  target: 'node18',
  format: 'esm',
  outfile: './netlify/functions/api.mjs',
}).catch(() => process.exit(1));
