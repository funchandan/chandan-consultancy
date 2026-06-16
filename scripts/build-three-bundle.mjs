#!/usr/bin/env node
/**
 * Builds assets/vendor/three/wp-three-all.min.js (THREE + FirstPersonControls).
 * Run: npm run build:three
 */
import * as esbuild from "esbuild";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const entry = path.join(root, "scripts/three/site-bundle-entry.mjs");
const outfile = path.join(root, "assets/vendor/three/wp-three-all.min.js");

const result = await esbuild.build({
  entryPoints: [entry],
  outfile,
  bundle: true,
  minify: true,
  format: "iife",
  platform: "browser",
  target: ["es2020"],
  legalComments: "none",
  logLevel: "info",
});

if (result.errors.length) {
  process.exit(1);
}

console.log(`Three bundle → ${path.relative(root, outfile)}`);
