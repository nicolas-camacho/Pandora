import * as esbuild from "https://deno.land/x/esbuild@v0.25.0/mod.js";
import { ensureDir } from "@std/fs";

// Aseguramos que el directorio dist exista
await ensureDir("./dist");

// Configuración base compartida para todos los formatos
const baseConfig = {
  entryPoints: ["./src/Pandora.js"],
  bundle: true,
  minify: false,
  sourcemap: true,
  target: ["es2020"],
  // Preserva los comentarios JSDoc en el output
  legalComments: "inline",
};

// Build ESM
async function buildESM() {
  await esbuild.build({
    ...baseConfig,
    format: "esm",
    outfile: "./dist/index.esm.js",
  });
  console.log("✅ Build ESM completado");
}

// Build CJS
async function buildCJS() {
  await esbuild.build({
    ...baseConfig,
    format: "cjs",
    outfile: "./dist/index.cjs.js",
  });
  console.log("✅ Build CJS completado");
}

// Build IIFE
async function buildIIFE() {
  await esbuild.build({
    ...baseConfig,
    format: "iife",
    globalName: "Pandora",
    outfile: "./dist/index.iife.js",
  });
  console.log("✅ Build IIFE completado");
}

// Ejecutar todos los builds
async function runBuilds() {
  try {
    await Promise.all([buildESM(), buildCJS(), buildIIFE()]);
    console.log("✅ ¡Todos los builds completados con éxito!");
  } catch (error) {
    console.error("❌ Error de build:", error);
    Deno.exit(1);
  } finally {
    // Importante: detener el servicio de esbuild cuando hayas terminado
    esbuild.stop();
  }
}

await runBuilds();