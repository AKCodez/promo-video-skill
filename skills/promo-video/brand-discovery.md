# Brand Discovery

Auto-detect product context from a repository to pre-populate creative prompts.

## How It Works

The `discover-brand.ts` script scans a target repository and extracts:

| Data | Sources Checked |
|------|----------------|
| **Product name** | `package.json` name, README.md first heading, manifest.json |
| **Description** | `package.json` description, README.md first paragraph, manifest.json |
| **Tagline** | README.md blockquotes, bold text in first 500 chars |
| **Logo files** | Common paths: `public/icon.png`, `assets/logo.svg`, etc. + recursive scan |
| **Brand colors** | CSS custom properties, Tailwind config hex values |
| **URLs** | `package.json` homepage, README.md links (excluding GitHub/npm) |
| **Tech stack** | `package.json` dependencies (React, Next.js, Tailwind, etc.) |

## Usage

```bash
npx tsx "${SKILL_DIR}/scripts/discover-brand.ts" ~/path/to/target-repo
```

Output:
```
=== Brand Discovery Results ===

Product Name: FastSolve
Description:  AI-powered Chrome Extension that solves homework questions instantly
Tagline:      One click. The answer appears.
Logos:        ./public/icon.png, ./apps/extension/assets/icon.svg
Colors:       #ff4444, #ff8833, #ffcc22, #9933ff, #ff44aa
URLs:         https://fastsolve.app
Tech Stack:   React, TypeScript, Tailwind CSS

JSON output:
{ ... }
```

## What Gets Pre-Populated

The JSON output feeds into the SKILL.md interactive prompts:

- **Product name** → "What's the product?" default option
- **Description** → Used to suggest pain points and features
- **Logo files** → Copied into Remotion project's `public/` folder
- **Colors** → Used as brand palette for the video theme
- **URLs** → CTA domain pre-filled
- **Tech stack** → Helps determine audience and visual style

## Logo Handling

When logos are found:

1. Copy the best logo (prefer SVG > PNG > ICO) into the Remotion project:
   ```bash
   cp <detected-logo> public/icon.png
   ```

2. If the logo is SVG, you can inline it as a React component for animations:
   ```tsx
   // Read the SVG file content and use it directly
   <div dangerouslySetInnerHTML={{ __html: svgContent }} />
   ```

3. For PNG logos, use `<Img>` from Remotion:
   ```tsx
   import { Img, staticFile } from "remotion";
   <Img src={staticFile("icon.png")} style={{ width: 200 }} />
   ```

## Color Extraction

Colors are extracted from:

1. **CSS custom properties** with keywords like `primary`, `accent`, `brand`, `color`, `bg`:
   ```css
   --color-primary: #3b82f6;
   --brand-accent: #8b5cf6;
   ```

2. **Tailwind config** hex values in the `theme.extend.colors` section:
   ```js
   colors: {
     brand: { primary: '#3b82f6', accent: '#8b5cf6' }
   }
   ```

If no colors are detected, the skill will ask the user to provide brand colors or use smart defaults based on the theme (dark/light).

## Manual Override

If auto-discovery misses something or gets it wrong, the interactive prompts always let the user override with custom values. The discovery just provides better defaults.
