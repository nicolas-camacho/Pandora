const esbuild = require('esbuild');
const { nodeExternalsPlugin } = require('esbuild-node-externals');
const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

const baseConfig = {
  entryPoints: ['src/Pandora.js'],
  bundle: true,
  minify: false,
  sourcemap: true,
  target: ['es2020'],
  platform: 'neutral',
  plugins: [nodeExternalsPlugin()],
  legalComments: 'inline',
};

// ESM build
async function buildESM() {
  await esbuild.build({
    ...baseConfig,
    format: 'esm',
    outfile: 'dist/index.esm.js',
  });
  console.log('✅ Build ESM completed');
}

// CommonJS build
async function buildCJS() {
  await esbuild.build({
    ...baseConfig,
    format: 'cjs',
    outfile: 'dist/index.cjs.js',
  });
  console.log('✅ Build CJS completed');
}

// IIFE build
async function buildIIFE() {
  await esbuild.build({
    ...baseConfig,
    format: 'iife',
    globalName: 'Pandora',
    outfile: 'dist/index.iife.js',
  });
  console.log('✅ Build IIFE completed');
}

async function build() {
  try {
    await Promise.all([buildESM(), buildCJS(), buildIIFE()]);
    console.log('✅ ¡All builds completed succesfully!');
  } catch (error) {
    console.error('❌ Error building:', error);
    process.exit(1);
  }
}

build();