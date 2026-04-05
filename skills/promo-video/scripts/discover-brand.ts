/**
 * Brand Discovery — scan a repository for product context.
 *
 * Detects: product name, description, logo files, primary colors, URLs, tech stack.
 * Output is JSON that SKILL.md uses to pre-populate interactive prompts.
 *
 * Usage:
 *   npx tsx discover-brand.ts <target-repo-path>
 *   npx tsx discover-brand.ts .                    # Current directory
 *   npx tsx discover-brand.ts ~/my-saas-app
 */

import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, basename, extname, resolve } from "node:path";
import { argv } from "node:process";

const targetDir = resolve(argv[2] || ".");

interface BrandInfo {
  productName: string | null;
  description: string | null;
  logos: string[];
  colors: string[];
  urls: string[];
  techStack: string[];
  tagline: string | null;
}

const brand: BrandInfo = {
  productName: null,
  description: null,
  logos: [],
  colors: [],
  urls: [],
  techStack: [],
  tagline: null,
};

// --- Helpers ---

function tryReadFile(path: string): string | null {
  try {
    if (!existsSync(path)) return null;
    return readFileSync(path, "utf-8");
  } catch {
    return null;
  }
}

function findFiles(dir: string, patterns: RegExp, maxDepth = 3, depth = 0): string[] {
  const results: string[] = [];
  if (depth > maxDepth) return results;
  try {
    const entries = readdirSync(dir);
    for (const entry of entries) {
      if (entry === "node_modules" || entry === ".git" || entry === "dist" || entry === "build") continue;
      const full = join(dir, entry);
      try {
        const stat = statSync(full);
        if (stat.isFile() && patterns.test(entry)) {
          results.push(full);
        } else if (stat.isDirectory()) {
          results.push(...findFiles(full, patterns, maxDepth, depth + 1));
        }
      } catch {}
    }
  } catch {}
  return results;
}

// --- Scan package.json ---

const pkgPath = join(targetDir, "package.json");
const pkg = tryReadFile(pkgPath);
if (pkg) {
  try {
    const parsed = JSON.parse(pkg);
    brand.productName = parsed.name?.replace(/^@[^/]+\//, "").replace(/[-_]/g, " ") || null;
    brand.description = parsed.description || null;
    if (parsed.homepage) brand.urls.push(parsed.homepage);

    // Detect tech stack from dependencies
    const allDeps = { ...parsed.dependencies, ...parsed.devDependencies };
    const stackMap: Record<string, string> = {
      react: "React", next: "Next.js", vue: "Vue", nuxt: "Nuxt",
      svelte: "Svelte", angular: "Angular", express: "Express",
      fastify: "Fastify", hono: "Hono", tailwindcss: "Tailwind CSS",
      prisma: "Prisma", drizzle: "Drizzle", supabase: "Supabase",
      firebase: "Firebase", stripe: "Stripe", remotion: "Remotion",
      electron: "Electron", "react-native": "React Native",
      typescript: "TypeScript",
    };
    for (const [dep, label] of Object.entries(stackMap)) {
      if (dep in allDeps || `@${dep}` in allDeps || `@${dep}/core` in allDeps) {
        brand.techStack.push(label);
      }
    }
  } catch {}
}

// --- Scan README ---

const readmePaths = ["README.md", "readme.md", "README.MD", "Readme.md"];
for (const rp of readmePaths) {
  const content = tryReadFile(join(targetDir, rp));
  if (content) {
    // Extract first heading as potential product name
    const h1 = content.match(/^#\s+(.+)$/m);
    if (h1 && !brand.productName) {
      brand.productName = h1[1].replace(/[*_`]/g, "").trim();
    }

    // Extract first paragraph as potential description
    const lines = content.split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith("#") && !trimmed.startsWith("[") && !trimmed.startsWith("!") && trimmed.length > 20) {
        if (!brand.description) brand.description = trimmed.slice(0, 200);
        break;
      }
    }

    // Extract URLs
    const urlMatches = content.match(/https?:\/\/[^\s)]+/g);
    if (urlMatches) {
      for (const url of urlMatches) {
        if (!url.includes("github.com") && !url.includes("npmjs.com") && !url.includes("shields.io")) {
          brand.urls.push(url);
        }
      }
    }

    // Look for tagline (common patterns)
    const taglinePatterns = [
      />\s*(.{10,80})\s*$/m,           // Blockquote
      /^>\s*(.{10,80})$/m,             // Blockquote alt
      /\*\*(.{10,80})\*\*/,            // Bold text in first few lines
    ];
    for (const pattern of taglinePatterns) {
      const match = content.slice(0, 500).match(pattern);
      if (match && !brand.tagline) {
        brand.tagline = match[1].trim();
      }
    }

    break;
  }
}

// --- Scan for logos ---

const logoPatterns = /^(icon|logo|favicon|brand|mark)\.(png|svg|ico|jpg|jpeg|webp)$/i;
const logos = findFiles(targetDir, logoPatterns);
brand.logos = logos.map((l) => l.replace(targetDir, "."));

// Also check common locations
const commonLogoPaths = [
  "public/icon.png", "public/logo.png", "public/favicon.ico", "public/favicon.svg",
  "assets/icon.png", "assets/logo.png", "assets/icon.svg", "assets/logo.svg",
  "src/assets/logo.png", "src/assets/icon.png",
  "apps/web/public/icon.png", "apps/web/public/logo.png",
  "static/icon.png", "static/logo.png",
];
for (const lp of commonLogoPaths) {
  const full = join(targetDir, lp);
  const rel = `./${lp}`;
  if (existsSync(full) && !brand.logos.includes(rel)) {
    brand.logos.push(rel);
  }
}

// --- Scan for colors in CSS/config ---

const cssFiles = findFiles(targetDir, /\.(css|scss|less)$/i, 2);
const hexColors = new Set<string>();

for (const cssFile of cssFiles.slice(0, 5)) {
  const content = tryReadFile(cssFile);
  if (!content) continue;
  // Look for CSS custom properties with color values
  const colorVars = content.match(/--[\w-]+(color|bg|primary|accent|brand)[\w-]*:\s*#[0-9a-fA-F]{3,8}/gi);
  if (colorVars) {
    for (const cv of colorVars) {
      const hex = cv.match(/#[0-9a-fA-F]{3,8}/);
      if (hex) hexColors.add(hex[0]);
    }
  }
}

// Check Tailwind config for brand colors
const tailwindPaths = ["tailwind.config.js", "tailwind.config.ts", "tailwind.config.mjs"];
for (const tp of tailwindPaths) {
  const content = tryReadFile(join(targetDir, tp));
  if (!content) continue;
  const hexMatches = content.match(/#[0-9a-fA-F]{6}/g);
  if (hexMatches) {
    for (const h of hexMatches) hexColors.add(h);
  }
}

brand.colors = [...hexColors].slice(0, 10);

// --- Scan manifest files ---

const manifestPaths = [
  "manifest.json", "public/manifest.json", "src/manifest.json",
  "apps/extension/manifest.json",
];
for (const mp of manifestPaths) {
  const content = tryReadFile(join(targetDir, mp));
  if (!content) continue;
  try {
    const parsed = JSON.parse(content);
    if (parsed.name && !brand.productName) brand.productName = parsed.name;
    if (parsed.description && !brand.description) brand.description = parsed.description;
    if (parsed.homepage_url) brand.urls.push(parsed.homepage_url);
  } catch {}
}

// --- Deduplicate URLs ---

brand.urls = [...new Set(brand.urls)].slice(0, 5);

// --- Output ---

console.log("\n=== Brand Discovery Results ===\n");
console.log(`Product Name: ${brand.productName || "(not detected)"}`);
console.log(`Description:  ${brand.description || "(not detected)"}`);
console.log(`Tagline:      ${brand.tagline || "(not detected)"}`);
console.log(`Logos:        ${brand.logos.length > 0 ? brand.logos.join(", ") : "(none found)"}`);
console.log(`Colors:       ${brand.colors.length > 0 ? brand.colors.join(", ") : "(none found)"}`);
console.log(`URLs:         ${brand.urls.length > 0 ? brand.urls.join(", ") : "(none found)"}`);
console.log(`Tech Stack:   ${brand.techStack.length > 0 ? brand.techStack.join(", ") : "(not detected)"}`);
console.log("");
console.log("JSON output:");
console.log(JSON.stringify(brand, null, 2));
console.log("");
