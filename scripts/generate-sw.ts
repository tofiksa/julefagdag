import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dirname, "..");
const templatePath = join(root, "public", "sw.template.js");
const outputPath = join(root, "public", "sw.js");

const version =
  process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 12) ??
  process.env.VERCEL_DEPLOYMENT_ID?.slice(0, 12) ??
  "dev";

const template = readFileSync(templatePath, "utf8");
const output = template.replaceAll("__CACHE_VERSION__", version);

writeFileSync(outputPath, output);
console.log(`Generated public/sw.js with cache version: ${version}`);
