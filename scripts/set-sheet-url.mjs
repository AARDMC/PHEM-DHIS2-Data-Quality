#!/usr/bin/env node
/**
 * Change the obfuscated Google Sheet links in config.js without ever writing
 * the plain URLs into the file (or into git history).
 *
 * Usage:
 *   node scripts/set-sheet-url.mjs "<data-sheet-url>" "<id-sheet-url>"
 *   node scripts/set-sheet-url.mjs "<data-sheet-url>"            # keeps current ID sheet
 *   node scripts/set-sheet-url.mjs --check                        # decode & print current links
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const CONFIG = resolve(dirname(fileURLToPath(import.meta.url)), "..", "config.js");
const KEY = 0x5a;

const encode = (s) => Buffer.from([...s].map((c) => c.charCodeAt(0) ^ KEY)).toString("base64");
const decode = (s) => [...Buffer.from(s, "base64")].map((b) => String.fromCharCode(b ^ KEY)).join("");

const src = readFileSync(CONFIG, "utf8");
const readLink = (name) => {
  const m = src.match(new RegExp(`${name}:\\s*__link\\("([^"]+)"\\)`));
  return m ? decode(m[1]) : "";
};

if (process.argv[2] === "--check") {
  console.log("SHEET_URL       :", readLink("SHEET_URL") || "(not set)");
  console.log("CREDENTIALS_URL :", readLink("CREDENTIALS_URL") || "(not set)");
  process.exit(0);
}

const dataUrl = process.argv[2];
if (!dataUrl) {
  console.error("Usage: node scripts/set-sheet-url.mjs \"<data-sheet-url>\" [\"<id-sheet-url>\"]");
  process.exit(1);
}
const idUrl = process.argv[3] || readLink("CREDENTIALS_URL");

if (!/SHEET_URL:\s*__link\("/.test(src) || !/CREDENTIALS_URL:\s*__link\("/.test(src)) {
  console.error("Could not find the obfuscated link fields in config.js. No change made.");
  process.exit(1);
}

const out = src
  .replace(/(SHEET_URL:\s*__link\(")[^"]*("\))/, `$1${encode(dataUrl)}$2`)
  .replace(/(CREDENTIALS_URL:\s*__link\(")[^"]*("\))/, `$1${encode(idUrl)}$2`);

if (out === src) {
  console.log("Links already match. Nothing to change.");
  process.exit(0);
}
writeFileSync(CONFIG, out);
console.log("config.js updated. Verify with: node scripts/set-sheet-url.mjs --check");
