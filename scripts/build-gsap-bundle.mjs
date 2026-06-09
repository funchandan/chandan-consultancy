#!/usr/bin/env node
/**
 * Builds assets/vendor/gsap/wp-gsap-all.min.js from npm gsap + all plugins.
 * Run: npm run build:gsap
 */
import * as esbuild from "esbuild";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const entry = path.join(root, "scripts/gsap/site-bundle-entry.mjs");
const outfile = path.join(root, "assets/vendor/gsap/wp-gsap-all.min.js");

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

console.log(`GSAP bundle → ${path.relative(root, outfile)}`);
