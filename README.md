# Promo Video Skill for Claude Code

Turn any SaaS product or repository into a professional promo video — 30s, 60s, or 90s — in both landscape (16:9) and portrait (9:16) formats. Powered by [Claude Code](https://claude.ai/code) + [Remotion](https://remotion.dev) + [ElevenLabs](https://elevenlabs.io).

## What This Does

This is a **Claude Code skill** that turns Claude into a motion graphics designer. Point it at your repo and it will:

1. **Scan your codebase** — finds your product name, logo, brand colors, and tech stack automatically
2. **Walk you through creative decisions** — duration, theme, voice, transitions, narrative structure
3. **Build a Remotion project** — professional React-based video with smooth animations, 3D mockups, and spring physics
4. **Generate voiceover** — AI narration via ElevenLabs with emotional presets (rage, whisper, confident, dramatic)
5. **Render final MP4s** — landscape + portrait with background music, ready to post

The entire workflow is interactive — Claude asks you questions, you pick options, and it builds everything.

---

## Quick Start

### 1. Install Both Skills

This skill builds on top of [`remotion-dev/skills`](https://github.com/remotion-dev/skills) — Remotion's official skill with 30+ rule files covering animations, transitions, audio, captions, 3D, and more. **Install both:**

```bash
# Remotion best-practices (peer dependency — required)
npx skills add remotion-dev/skills

# This skill (promo video workflow)
npx skills add AKCodez/promo-video-skill
```

**What each skill provides:**

| Skill | What It Does |
|-------|-------------|
| [`remotion-dev/skills`](https://github.com/remotion-dev/skills) | Remotion fundamentals — animations, spring physics, interpolation, transitions, sequencing, audio, captions, 3D, fonts, images, videos, charts, text animations, Tailwind integration, voiceover basics |
| `AKCodez/promo-video-skill` | End-to-end promo video workflow — brand discovery, creative direction, narrative templates, multi-format rendering, ElevenLabs voiceover with emotional presets, background music, final render pipeline |

The Remotion skill teaches Claude *how to write Remotion code correctly*. This skill teaches Claude *how to design and produce a complete promo video*.

### 2. Set Up Your ElevenLabs API Key

Get a free API key from [elevenlabs.io](https://elevenlabs.io) (sign up → Profile → API Keys):

**Windows (PowerShell):**
```powershell
$env:ELEVENLABS_API_KEY = "sk_your_key_here"
```

**macOS / Linux:**
```bash
export ELEVENLABS_API_KEY="sk_your_key_here"
```

**Or create a `.env` file** in your project root:
```
ELEVENLABS_API_KEY=sk_your_key_here
```

### 3. Run It

Open Claude Code in your project directory and say:

```
Create a promo video for this project
```

Claude will take it from there — scanning your repo, asking creative questions, and building the video.

> **Tip:** You can also be more specific: "Create a 60-second dark mode promo video for this project targeting developers"

---

## Prerequisites

| Requirement | Required? | How to Install |
|-------------|-----------|---------------|
| **Node.js 18+** | Yes | [nodejs.org](https://nodejs.org) or `nvm install 18` |
| **Claude Code** | Yes | [claude.ai/code](https://claude.ai/code) — CLI, desktop app, or VS Code extension |
| **`remotion-dev/skills`** | Yes | `npx skills add remotion-dev/skills` ([source](https://github.com/remotion-dev/skills)) |
| **ElevenLabs API Key** | Yes (for voiceover) | Free at [elevenlabs.io](https://elevenlabs.io) |
| **ffmpeg** | Auto | Handled via `bunx remotion ffmpeg` (no install needed) |
| **Whisper** | Optional | `pip install openai-whisper` (for voiceover timing verification) |

### About the Remotion Skill (Peer Dependency)

This skill depends on [`remotion-dev/skills`](https://github.com/remotion-dev/skills) — the official Remotion skill maintained by the Remotion team. It provides 30+ rule files that teach Claude how to write correct Remotion code:

| Category | Rules Included |
|----------|---------------|
| **Core** | Animations, timing/interpolation, sequencing, compositions, parameters |
| **Transitions** | Scene transitions (fade, slide, wipe, custom) |
| **Media** | Images, videos, audio, GIFs, fonts, assets |
| **Advanced** | 3D (Three.js), charts, text animations, captions/subtitles |
| **Audio** | Sound effects, audio visualization, voiceover |
| **Tools** | FFmpeg operations, measuring DOM/text, light leaks, Tailwind |

Without this skill installed, Claude won't have the Remotion-specific knowledge needed to build correct, performant video compositions. **Install it first:**

```bash
npx skills add remotion-dev/skills
```

### About ffmpeg

You do **not** need to install ffmpeg separately. This skill uses `bunx remotion ffmpeg` which bundles ffmpeg cross-platform. This solves the #1 pain point with video generation tools — ffmpeg PATH issues on Windows, macOS, and Linux.

### About Whisper

Whisper is OpenAI's speech recognition model used to verify voiceover timing. It checks that narration doesn't overlap between scenes. It's optional but highly recommended:

```bash
pip install openai-whisper
```

---

## How It Works (Detailed)

### Phase 0: Preflight

Claude runs environment checks automatically:
- Node.js version
- API key configured
- ffmpeg available
- Whisper available

If anything is missing, it tells you exactly how to fix it.

### Phase 1: Product Discovery

Claude scans your repository to understand your product:
- Reads `package.json` for product name and description
- Reads `README.md` for tagline and features
- Finds logo files (`icon.png`, `logo.svg`, etc.)
- Extracts brand colors from CSS and Tailwind config
- Detects your tech stack from dependencies

This information pre-populates the creative prompts so you're clicking, not typing.

### Phase 2: Creative Direction

Claude asks you a series of questions:

1. **Product brief** — What's the product? Who's the audience? What pain points to hit? What features to showcase?
2. **CTA** — What action should viewers take? (Visit website, sign up, download, etc.)
3. **Duration** — 30s (social ads), 60s (standard promo), or 90s (detailed walkthrough)
4. **Theme** — Dark mode or light mode
5. **Voice** — Choose from built-in voices or browse ElevenLabs' library
6. **Narrative structure** — The Rage Hook, Problem Stack, Demo First, or Transformation
7. **Transitions** — Metallic swoosh, zoom through, fade, or slide
8. **Transition speed** — Quick (0.4s), medium (0.7s), or slow (1.2s)

### Phase 3: Build

Claude creates a full Remotion project with:
- **Shared scene components** that work in both landscape and portrait
- **LayoutContext** — a React context that adapts layouts based on format
- **Spring animations** for natural, satisfying motion
- **3D browser mockups** with perspective and shadow
- **Scene durations optimized for engagement** (2-4 seconds each)

You preview in Remotion Studio (`npx remotion studio`) and give feedback before proceeding.

### Phase 4: Voiceover

Claude generates professional voiceover with emotional range:

| Emotion | Use For |
|---------|---------|
| **Rage** | Hook frustration — "Are you serious right now?!" |
| **Whisper** | Secret reveal — "What if you never had to guess again?" |
| **Confident** | Feature descriptions — "Smart detection scans instantly" |
| **Warm** | Social proof — "Join 50,000 users" |
| **Dramatic** | CTA — "Try it now. Free." |

After generation, timing is verified with Whisper to ensure narration aligns perfectly with visuals.

### Phase 5: Final Render

Claude renders both formats and combines with audio:
- `out/promo-landscape-final.mp4` — 1920x1080 for YouTube, websites
- `out/promo-portrait-final.mp4` — 1080x1920 for TikTok, Instagram Reels, YouTube Shorts

---

## Narrative Templates

The skill includes four proven story structures:

### The Rage Hook
Frustration → Silence → Whisper → Reveal → Features → CTA

Best for products that solve a deeply frustrating problem. The emotional contrast hooks viewers. Opens with someone raging about a problem, cuts to silence, then whispers the solution.

### The Problem Stack
Pain → Pain → Pain → "What if..." → Solution → Features → Proof → CTA

Builds urgency through accumulation. Each pain point hits harder. The "What if..." pivot turns everything positive.

### The Demo First
Magic moment → "How?" → Explanation → Features → Proof → CTA

Opens cold with the most impressive thing your product does. No intro, no buildup. Hook first, explain later.

### The Transformation
Before (pain) → After (joy) → How → Features → Proof → CTA

Side-by-side or sequential before/after. Desaturated colors for "before", vibrant for "after".

---

## Available Voices

### Built-in (Free Tier)

| Voice | Style | Best For |
|-------|-------|---------|
| **Matilda** | Warm, confident female | Default choice, versatile |
| **Rachel** | Calm, authoritative female | Corporate, B2B |
| **Daniel** | Polished, broadcast male | Advertising, product launches |
| **Josh** | Friendly, conversational male | Consumer apps, casual |
| **Adam** | Deep, dramatic male | Cinematic, intense hooks |

### Browse More

Claude can search ElevenLabs' voice library and generate test samples:

```
Browse ElevenLabs voices for a sinister, dramatic male voice
```

Note: Library/premium voices require a paid ElevenLabs tier.

---

## Background Music

Three royalty-free tracks are bundled (from Pixabay):

| Track | Style | Duration |
|-------|-------|----------|
| **Inspired Ambient** | Ambient, beautiful, atmospheric | Long |
| **Motivational Day** | Background, commercial, uplifting | Long |
| **Upbeat Corporate** | Upbeat, inspiring, energetic | Long |

Music is mixed at 8-12% volume so it doesn't overpower the voiceover.

---

## File Structure

```
skills/
└── promo-video/
    ├── SKILL.md                    # Main skill — the 5-phase workflow Claude follows
    ├── voiceover.md                # ElevenLabs generation + Whisper verification guide
    ├── narrative-templates.md      # 4 proven story structures with scene breakdowns
    ├── multi-format.md             # LayoutContext pattern for 16:9 + 9:16
    ├── brand-discovery.md          # How auto-detection works
    ├── metallic-swoosh.md          # Custom metallic shine transition component
    ├── promo-patterns.md           # Visual inspiration: animations, effects, tips
    ├── scripts/
    │   ├── preflight.ts            # Environment validation
    │   ├── discover-voices.ts      # ElevenLabs voice browser + sampler
    │   ├── timing-calculator.ts    # TransitionSeries duration math
    │   ├── discover-brand.ts       # Repo scanner for brand assets
    │   └── generate-voiceover.ts   # Full voiceover generation pipeline
    └── music/
        ├── inspired-ambient-141686.mp3
        ├── motivational-day-112790.mp3
        └── the-upbeat-inspiring-corporate-142313.mp3
```

---

## Scripts

All scripts are TypeScript and run with `npx tsx`. They're cross-platform (Windows, macOS, Linux).

### preflight.ts — Environment Check

```bash
npx tsx scripts/preflight.ts
```

Validates Node.js version, API key, ffmpeg, and Whisper. Prints clear pass/fail with fix instructions.

### discover-brand.ts — Brand Scanner

```bash
npx tsx scripts/discover-brand.ts ~/path/to/your-repo
```

Scans a repository for product name, description, logos, colors, URLs, and tech stack. Outputs JSON.

### discover-voices.ts — Voice Browser

```bash
# List all available voices
npx tsx scripts/discover-voices.ts

# Search for specific voice styles
npx tsx scripts/discover-voices.ts --query "deep dramatic male"

# Generate test samples for top 3 matches
npx tsx scripts/discover-voices.ts --query "confident female" --samples 3
```

### timing-calculator.ts — Duration Math

```bash
npx tsx scripts/timing-calculator.ts \
  --scenes "120,90,60,90,90,90,120,120" \
  --transition 12 \
  --fps 30 \
  --target 60
```

Calculates exact effective duration accounting for TransitionSeries overlaps. Shows scene-by-scene timeline.

### generate-voiceover.ts — Full Pipeline

```bash
npx tsx scripts/generate-voiceover.ts --config voiceover-config.json
```

Generates per-section audio with emotional presets, concatenates with silence gaps, normalizes volume, and verifies timing with Whisper. See [voiceover.md](skills/promo-video/voiceover.md) for config format.

---

## Tips & Tricks

### Getting Better Results

- **Be specific about your audience.** "College students struggling with online quizzes" is better than "students."
- **Pick 3-5 features max.** More than that dilutes the message.
- **Use the Rage Hook** for consumer products. It gets the highest engagement.
- **Keep scenes to 2-4 seconds.** Longer scenes lose attention.
- **Preview often.** Run `npx remotion studio` after building scenes, before voiceover.

### Iterating

After the first render, you can ask Claude to:
- "Make the text bigger in scene 3"
- "Speed up the transitions"
- "Change the voice to something more dramatic"
- "Add more emphasis on the speed feature"
- "The voiceover in the opening doesn't match — fix the timing"

### Common Issues

| Problem | Solution |
|---------|----------|
| Voiceover overlaps between scenes | Claude auto-fixes this, but you can ask to regenerate |
| Elements too small | Ask Claude to "scale up the elements" or "make text bigger" |
| Video feels slow | Ask for "shorter scenes" or "quicker transitions" |
| Portrait looks cramped | Claude uses LayoutContext to adapt, but you can request adjustments |
| ffmpeg not found | This shouldn't happen — `bunx remotion ffmpeg` is used automatically |
| ElevenLabs 401 error | Check your API key is set correctly in your environment |
| Premium voice error | Use one of the 5 built-in voices (they work on the free tier) |

---

## License

MIT

---

Built with the lessons learned from producing real promo videos. Every pain point in this skill was hit during actual production and fixed.
