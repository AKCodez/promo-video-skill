<div align="center">

# promo-video-skill

### Turn any codebase into a professional promo video.

One command. Landscape + Portrait. Voiceover included.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Claude Code](https://img.shields.io/badge/Claude_Code-Skill-blueviolet)](https://claude.ai/code)
[![Remotion](https://img.shields.io/badge/Remotion-Video_Engine-0B84F3)](https://remotion.dev)
[![ElevenLabs](https://img.shields.io/badge/ElevenLabs-AI_Voice-000)](https://elevenlabs.io)

---

**Point Claude Code at your repo. It scans your codebase, finds your logo, brand colors, and features — then builds an entire animated video with AI voiceover and renders it in both formats, ready to post.**

</div>

<br/>

## How It Works

```
  Your Repo                    Claude Code                     Output
 ┌──────────┐    ┌───────────────────────────────┐    ┌─────────────────┐
 │ code     │    │  1. Scan codebase             │    │ landscape.mp4   │
 │ logo     │───>│  2. Creative direction        │───>│ 1920 x 1080     │
 │ readme   │    │  3. Build Remotion scenes     │    ├─────────────────┤
 │ colors   │    │  4. Generate AI voiceover     │    │ portrait.mp4    │
 └──────────┘    │  5. Render + combine audio    │    │ 1080 x 1920     │
                 └───────────────────────────────┘    └─────────────────┘
```

<br/>

## Quick Start

### 1. Install

```bash
# Remotion fundamentals (peer dependency)
npx skills add remotion-dev/skills

# Promo video workflow
npx skills add AKCodez/promo-video-skill
```

### 2. Set your ElevenLabs API key

```bash
# macOS / Linux
export ELEVENLABS_API_KEY="sk_your_key_here"

# Windows PowerShell
$env:ELEVENLABS_API_KEY = "sk_your_key_here"
```

Get a free key at [elevenlabs.io](https://elevenlabs.io) (sign up → Profile → API Keys).

### 3. Run

```
Create a promo video for this project
```

That's it. Claude handles the rest.

<br/>

---

<br/>

## The Pipeline

<table>
<tr>
<td width="50%">

### Phase 0 — Preflight
Validates your environment automatically.
Node.js, API key, ffmpeg, Whisper — if anything is missing, it tells you exactly how to fix it.

</td>
<td width="50%">

### Phase 1 — Brand Discovery
Scans your repo for:
- **Product name** from `package.json`, README
- **Logo** files (`icon.png`, `logo.svg`)
- **Brand colors** from CSS, Tailwind config
- **Tech stack** from dependencies

</td>
</tr>
<tr>
<td>

### Phase 2 — Creative Direction
Interactive prompts for:
- Duration (30s / 60s / 90s)
- Theme (dark / light)
- Voice (5 built-in + browse more)
- Narrative structure
- Transition style + speed

</td>
<td>

### Phase 3 — Build
Creates a full Remotion project with:
- Spring animations + 3D browser mockups
- Shared scenes for landscape + portrait
- 2-4 second scenes optimized for engagement
- Preview in Remotion Studio before proceeding

</td>
</tr>
<tr>
<td>

### Phase 4 — Voiceover
Generates AI narration via ElevenLabs with **emotional presets per scene**. Verifies timing with Whisper. Auto-fixes any overlaps.

</td>
<td>

### Phase 5 — Render
Renders both formats, mixes background music, combines audio — outputs two final MP4s ready to post.

</td>
</tr>
</table>

<br/>

---

<br/>

## Voiceover Emotional Presets

The AI voice changes emotion per scene — not one flat tone for the whole video.

| Preset | Settings | Use For |
|:-------|:---------|:--------|
| **Rage** | Low stability, high style | Hook frustration — *"Are you serious right now?!"* |
| **Whisper** | Low stability, intimate | Secret reveal — *"What if you never had to guess again?"* |
| **Confident** | Mid stability, balanced | Feature demos — *"Smart detection scans instantly"* |
| **Warm** | High stability, smooth | Social proof — *"Join 50,000 users"* |
| **Dramatic** | Mid stability, high style | CTA — *"Try it now. Free."* |

<br/>

## Narrative Templates

Four proven story structures, each with scene breakdowns and voiceover tone guides:

| Template | Arc | Best For |
|:---------|:----|:---------|
| **The Rage Hook** | Frustration → Silence → Whisper → Reveal → CTA | Products solving a painful problem |
| **The Problem Stack** | Pain → Pain → Pain → "What if..." → Solution → CTA | Multiple pain points to stack |
| **The Demo First** | Magic moment → "How?" → Features → CTA | Products where the UX sells itself |
| **The Transformation** | Before → After → How → Proof → CTA | Workflow improvements |

<br/>

## Available Voices

### Built-in (Free Tier)

| Voice | Style | Best For |
|:------|:------|:---------|
| **Matilda** | Warm, confident female | Default — versatile |
| **Rachel** | Calm, authoritative female | Corporate, B2B |
| **Daniel** | Polished, broadcast male | Advertising, launches |
| **Josh** | Friendly, conversational male | Consumer apps |
| **Adam** | Deep, dramatic male | Cinematic, intense hooks |

> Don't see what you want? Say *"Browse ElevenLabs voices for a sinister dramatic male voice"* and Claude will search the library, generate test samples, and let you audition them.

<br/>

---

<br/>

## What's Inside

```
skills/promo-video/
│
├── SKILL.md                     Main skill — 5-phase workflow
├── voiceover.md                 ElevenLabs + Whisper timing guide
├── narrative-templates.md       4 story structures with scene breakdowns
├── multi-format.md              Responsive 16:9 + 9:16 architecture
├── brand-discovery.md           Auto-detect logos, colors, fonts
├── metallic-swoosh.md           Custom metallic shine transition
├── promo-patterns.md            Visual inspiration catalog
│
├── scripts/
│   ├── preflight.ts             Environment validation
│   ├── discover-brand.ts        Repo scanner for brand assets
│   ├── discover-voices.ts       ElevenLabs voice browser + sampler
│   ├── timing-calculator.ts     TransitionSeries duration math
│   └── generate-voiceover.ts    Full voiceover generation pipeline
│
└── music/
    ├── inspired-ambient.mp3     Ambient, atmospheric
    ├── motivational-day.mp3     Commercial, uplifting
    └── upbeat-corporate.mp3     Inspiring, energetic
```

<br/>

## Utility Scripts

All TypeScript, all cross-platform. Run with `npx tsx`.

<details>
<summary><b>preflight.ts</b> — Environment check</summary>

```bash
npx tsx scripts/preflight.ts
```

Validates Node.js version, API key, ffmpeg, Whisper. Prints pass/fail with fix instructions.

</details>

<details>
<summary><b>discover-brand.ts</b> — Brand scanner</summary>

```bash
npx tsx scripts/discover-brand.ts ~/path/to/your-repo
```

Scans a repository and outputs: product name, description, logos, hex colors, URLs, tech stack.

</details>

<details>
<summary><b>discover-voices.ts</b> — Voice browser</summary>

```bash
npx tsx scripts/discover-voices.ts --query "confident female" --samples 3
```

Searches ElevenLabs, generates test MP3s in `voice-tests/` for audition.

</details>

<details>
<summary><b>timing-calculator.ts</b> — Duration math</summary>

```bash
npx tsx scripts/timing-calculator.ts --scenes "120,90,60,90,90" --transition 12 --fps 30 --target 60
```

Computes exact duration accounting for TransitionSeries overlaps. Shows scene-by-scene timeline.

</details>

<details>
<summary><b>generate-voiceover.ts</b> — Full pipeline</summary>

```bash
npx tsx scripts/generate-voiceover.ts --config voiceover-config.json
```

Generates per-section audio with emotional presets, concatenates, normalizes, and verifies timing.

</details>

<br/>

---

<br/>

## Prerequisites

| Requirement | Required | Install |
|:------------|:--------:|:--------|
| Node.js 18+ | Yes | [nodejs.org](https://nodejs.org) |
| Claude Code | Yes | [claude.ai/code](https://claude.ai/code) |
| `remotion-dev/skills` | Yes | `npx skills add remotion-dev/skills` |
| ElevenLabs API Key | Yes | Free at [elevenlabs.io](https://elevenlabs.io) |
| ffmpeg | Auto | Bundled via `bunx remotion ffmpeg` |
| Whisper | Optional | `pip install openai-whisper` |

<br/>

### About the Remotion Skill

This skill depends on [`remotion-dev/skills`](https://github.com/remotion-dev/skills) — the official Remotion skill with **30+ rule files**:

| | |
|:--|:--|
| **Core** | Animations, timing, interpolation, sequencing, compositions |
| **Transitions** | Fade, slide, wipe, custom presentations |
| **Media** | Images, videos, audio, GIFs, fonts |
| **Advanced** | Three.js 3D, charts, text animations, captions |
| **Audio** | Sound effects, visualization, voiceover |
| **Tools** | FFmpeg, DOM measurement, Tailwind, light leaks |

The Remotion skill teaches Claude *how to write Remotion code*. This skill teaches Claude *how to produce a complete promo video*.

<br/>

### About ffmpeg

You do **not** need to install ffmpeg. This skill uses `bunx remotion ffmpeg` — bundled, cross-platform, zero PATH configuration. Works on Windows, macOS, and Linux out of the box.

<br/>

---

<br/>

## Tips

- **Be specific about your audience.** "College students struggling with online quizzes" > "students"
- **Pick 3-5 features max.** More dilutes the message.
- **Use the Rage Hook** for consumer products — highest engagement.
- **Keep scenes to 2-4 seconds.** Shorter = more engaging.
- **Preview before voiceover.** Run `npx remotion studio` after building scenes.

<br/>

## Troubleshooting

| Problem | Fix |
|:--------|:----|
| Voiceover overlaps | Claude auto-fixes this — or ask to regenerate |
| Elements too small | "Scale up the elements" or "make text bigger" |
| Video feels slow | "Shorter scenes" or "quicker transitions" |
| Portrait looks cramped | Claude adapts via LayoutContext — request adjustments if needed |
| ElevenLabs 401 | Check API key in environment |
| Premium voice error | Use one of the 5 built-in voices (free tier) |

<br/>

---

<div align="center">

**MIT License**

Built from real production experience. Every pain point was hit during actual video production and fixed in this skill.

[Install](https://github.com/AKCodez/promo-video-skill) · [Remotion](https://remotion.dev) · [ElevenLabs](https://elevenlabs.io) · [Claude Code](https://claude.ai/code)

</div>
