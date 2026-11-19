#!/usr/bin/env node
/**
 * Change the obfuscated URLs in config.js without ever writing a plain URL
 * into the file (or into git history).
 *
 * Usage:
 *   node scripts/set-sheet-url.mjs "<data-sheet-url>" ["<id-sheet-url>"]
 *       Direct mode: browser reads the sheets itself (they must be public).
 *
 *   node scripts/set-sheet-url.mjs --proxy "<data-api-url>" "<id-api-url>"
 *       Private mode: browser reads through the Apps Script bridge; the
 *       direct Google sheet URLs are removed from config.js entirely.
 *
 *   node scripts/set-sheet-url.mjs --check
 *       Decode and print the URLs currently in config.js.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const CONFIG = resolve(dirname(fileURLToPath(import.meta.url)), "..", "config.js");
const KEY = 0x5a;
const FIELDS = ["SHEET_URL", "CREDENTIALS_URL", "DATA_API_URL", "ID_API_URL"];

const encode = (s) => Buffer.from([...s].map((c) => c.charCodeAt(0) ^ KEY)).toString("base64");
const decode = (s) => [...Buffer.from(s, "base64")].map((b) => String.fromCharCode(b ^ KEY)).join("");

let src = readFileSync(CONFIG, "utf8");
const readLink = (name) => {
  const m = src.match(new RegExp(`${name}:\\s*__link\\("([^"]+)"\\)`));
  return m ? decode(m[1]) : "";
};
const setLink = (name, value) => {
  const re = new RegExp(`(${name}:\\s*__link\\(")[^"]*("\\))`);
  if (!re.test(src)) throw new Error(`Field ${name} not found in config.js`);
  src = src.replace(re, `$1${encode(value)}$2`);
};

if (process.argv[2] === "--check") {
  for (const f of FIELDS) console.log(f.padEnd(16) + ":", readLink(f) || "(not set)");
  process.exit(0);
}

const proxy = process.argv[2] === "--proxy";
const first = proxy ? process.argv[3] : process.argv[2];
if (!first) {
  console.error("Usage: node scripts/set-sheet-url.mjs \"<data-url>\" [\"<id-url>\"]");
  console.error("   or: node scripts/set-sheet-url.mjs --proxy \"<data-api-url>\" \"<id-api-url>\"");
  process.exit(1);
}
const second = proxy ? process.argv[4] : process.argv[3];

try {
  if (proxy) {
    if (!second) throw new Error("--proxy needs both the data API URL and the ID API URL");
    setLink("DATA_API_URL", first);
    setLink("ID_API_URL", second);
    setLink("SHEET_URL", "");           // remove Google IDs from the shipped site
    setLink("CREDENTIALS_URL", "");
  } else {
    setLink("SHEET_URL", first);
    setLink("CREDENTIALS_URL", second || readLink("CREDENTIALS_URL"));
    setLink("DATA_API_URL", "");
    setLink("ID_API_URL", "");
  }
} catch (err) {
  console.error(err.message + ". No change made.");
  process.exit(1);
}

writeFileSync(CONFIG, src);
console.log(proxy ? "Private mode configured." : "Direct mode configured.");
console.log("Verify with: node scripts/set-sheet-url.mjs --check");
