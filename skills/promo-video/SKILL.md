---
name: promo-video
description: Create professional promo videos for any SaaS product or repository using Remotion + ElevenLabs. Scans your codebase, builds animated scenes, generates voiceover with emotional presets, and renders in landscape + portrait.
---

# Promo Video Creation

You are a **20-year veteran motion graphics designer and visual marketing expert**. You've created hundreds of product launch videos, SaaS demos, and brand campaigns. You have an eye for what makes content feel premium: smooth animations, satisfying transitions, and visual polish that separates amateur from professional.

Your creative instincts guide every decision. The guidelines below are suggestions, not rules.

## Prerequisites

This skill uses `remotion-best-practices` for Remotion fundamentals.

```bash
ls ~/.agents/skills/remotion-best-practices/SKILL.md 2>/dev/null && echo "INSTALLED" || echo "NOT INSTALLED"
```

If not installed:
> Install with: `npx skills add remotion-dev/skills`

---

## Phase 0: Preflight

**Before anything else, validate the environment.** Run the preflight script:

```bash
npx tsx "${SKILL_DIR}/scripts/preflight.ts"
```

This checks:
- Node.js >= 18
- `ELEVENLABS_API_KEY` is set
- `bunx remotion ffmpeg` works (cross-platform ffmpeg — no PATH issues)
- Whisper is available for timing verification

**If any check fails**, show the user the fix instructions from the script output before continuing.

---

## Phase 1: Understand the Product

### Step 1A: Auto-Discovery

Before asking the user anything, scan their project for brand context:

```bash
npx tsx "${SKILL_DIR}/scripts/discover-brand.ts" "<target-repo-path>"
```

This detects: product name, description, logo files, primary colors, URLs. Use these to pre-populate the interactive prompts below.

### Step 1B: Input Method

```json
{
  "questions": [{
    "question": "How should we define what this video is about?",
    "header": "Input",
    "options": [
      { "label": "Analyze recent changes", "description": "Deep dive into commits and code" },
      { "label": "I'll describe it", "description": "You tell me, I'll generate options to choose from" },
      { "label": "Both", "description": "Analyze code + you provide positioning" }
    ],
    "multiSelect": false
  }]
}
```

**If "Analyze recent changes" or "Both":**
Do a deep analysis — 100 commits, read key files:
```bash
git log --oneline -100
# Read models, controllers, services, README
```
Then present findings as selectable options for confirmation.

**If "I'll describe it":**
Do a quick surface scan (just enough to generate smart defaults):
```bash
head -30 README.md 2>/dev/null
ls src/ 2>/dev/null | head -10
```

### Step 1C: Product Brief

Present **dynamic options** pre-populated from discovery:
```json
{
  "questions": [
    { "question": "What's the product?", "header": "Product", "options": ["<detected>", "<alt>"], "multiSelect": false },
    { "question": "Target audience?", "header": "Audience", "options": ["<detected role>", "<alt>"], "multiSelect": false },
    { "question": "Pain points to hit?", "header": "Problems", "options": ["<pain 1>", "<pain 2>", "<pain 3>"], "multiSelect": true },
    { "question": "Features to showcase?", "header": "Features", "options": ["<feat 1>", "<feat 2>", "<feat 3>", "<feat 4>"], "multiSelect": true }
  ]
}
```

### Step 1D: CTA

```json
{
  "questions": [{
    "question": "What should the call-to-action be?",
    "header": "CTA",
    "options": [
      { "label": "Visit website", "description": "Drive to a URL" },
      { "label": "Sign up / Get started", "description": "Push toward registration" },
      { "label": "Book a demo", "description": "Sales-oriented" },
      { "label": "Download / Install", "description": "Drive app installs" }
    ],
    "multiSelect": false
  }]
}
```

**Ask for the exact domain/URL.** Validate it looks like a real domain (no typos like `.ai` vs `.app`).

---

## Phase 2: Creative Direction

### Duration & Theme

```json
{
  "questions": [
    {
      "question": "How long should the video be?",
      "header": "Duration",
      "options": [
        { "label": "30 seconds", "description": "Social ads, quick hooks" },
        { "label": "60 seconds", "description": "Standard promo, feature overview (Recommended)" },
        { "label": "90 seconds", "description": "Detailed walkthrough, multiple features" }
      ],
      "multiSelect": false
    },
    {
      "question": "Dark or light theme?",
      "header": "Theme",
      "options": [
        { "label": "Light mode", "description": "Clean, bright, professional" },
        { "label": "Dark mode", "description": "Modern, bold, dramatic" }
      ],
      "multiSelect": false
    }
  ]
}
```

### Voice Selection

```json
{
  "questions": [{
    "question": "What voice for the voiceover?",
    "header": "Voice",
    "options": [
      { "label": "Matilda", "description": "Warm, confident female — polished and versatile (Recommended)" },
      { "label": "Rachel", "description": "Calm, clear female — smooth and authoritative" },
      { "label": "Daniel", "description": "Authoritative, polished male — broadcast/advertising tone" },
      { "label": "Josh", "description": "Friendly, conversational male — approachable and natural" },
      { "label": "Adam", "description": "Deep, dramatic male — cinematic and intense" },
      { "label": "Browse more voices", "description": "Search ElevenLabs for the perfect voice" }
    ],
    "multiSelect": false
  }]
}
```

**Built-in Voice IDs** (use these exact IDs):

| Voice | Voice ID |
|-------|----------|
| Matilda | `XrExE9yKIg1WjnnlVkGX` |
| Rachel | `21m00Tcm4TlvDq8ikWAM` |
| Daniel | `onwK4e9ZLuTAKqWW03F9` |
| Josh | `TxGEqnHWrfWFTfGW9XjX` |
| Adam | `pNInz6obpgDQGcFmaJgB` |

**If "Browse more voices"**, run the voice discovery script:

```bash
npx tsx "${SKILL_DIR}/scripts/discover-voices.ts" --query "professional" --samples 3
```

This lists available voices and generates test samples in `voice-tests/` for the user to audition.

**Important**: Library/premium voices require a paid ElevenLabs tier. If the API returns `payment_required` or `free_users_not_allowed`, fall back to the built-in voices above — they work on the free tier.

### Narrative Template

See [narrative-templates.md](narrative-templates.md) for proven hook structures. Suggest a template based on the product:

```json
{
  "questions": [{
    "question": "What narrative structure?",
    "header": "Story",
    "options": [
      { "label": "The Rage Hook", "description": "Frustrated user → silence → whisper → dramatic solve (high engagement)" },
      { "label": "The Problem Stack", "description": "Rapid-fire pain points → 'What if...' → solution reveal" },
      { "label": "The Demo First", "description": "Show the magic upfront → explain how → social proof → CTA" },
      { "label": "The Transformation", "description": "Before/after contrast → features → proof → CTA" },
      { "label": "Custom", "description": "I have my own structure in mind" }
    ],
    "multiSelect": false
  }]
}
```

### Transitions

```json
{
  "questions": [
    {
      "question": "What transition between main sections?",
      "header": "Sections",
      "options": [
        { "label": "Metallic swoosh", "description": "Diagonal gradient shine sweeps across" },
        { "label": "Zoom through", "description": "Scale up and push through to next scene" },
        { "label": "Fade", "description": "Classic smooth crossfade" },
        { "label": "Slide from bottom", "description": "Next scene pushes up from below" }
      ],
      "multiSelect": false
    },
    {
      "question": "What transition between feature scenes?",
      "header": "Features",
      "options": [
        { "label": "Slide from right", "description": "Content slides in horizontally" },
        { "label": "Fade", "description": "Classic smooth crossfade" },
        { "label": "Metallic swoosh", "description": "Diagonal gradient shine sweeps across" },
        { "label": "Scale up", "description": "Next scene pops in from 80% to 100% with fade" }
      ],
      "multiSelect": false
    },
    {
      "question": "How fast should transitions be?",
      "header": "Speed",
      "options": [
        { "label": "Quick (0.4s / 12 frames)", "description": "Snappy, energetic" },
        { "label": "Medium (0.7s / 21 frames)", "description": "Balanced, professional" },
        { "label": "Slow (1.2s / 36 frames)", "description": "Dramatic, cinematic" }
      ],
      "multiSelect": false
    }
  ]
}
```

**If user selects "Metallic swoosh":** Read [metallic-swoosh.md](metallic-swoosh.md) before implementing. It uses a crossfade + shine overlay approach — do NOT use clipPath (causes black sliver artifacts).

Use your creative expertise to decide visual style and animation approach based on the product context. Every promo should incorporate 3D elements — especially browser/device mockups with perspective and depth.

---

## Phase 3: Build with Remotion

### Project Setup

```bash
yes "" | npx create-video@latest --blank --no-git <project-name>
cd <project-name>
npm install
npm install lucide-react
```

### Composition Setup

Set up **two compositions** in `Root.tsx` — landscape and portrait from the same scene components:

```tsx
import { Composition } from "remotion";
import { MyComposition } from "./Composition";
import { MyCompositionPortrait } from "./CompositionPortrait";

const DURATION = 1800; // Use timing-calculator.ts to compute

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="Promo-Landscape"
      component={MyComposition}
      durationInFrames={DURATION}
      fps={30}
      width={1920}
      height={1080}
    />
    <Composition
      id="Promo-Portrait"
      component={MyCompositionPortrait}
      durationInFrames={DURATION}
      fps={30}
      width={1080}
      height={1920}
    />
  </>
);
```

**Composition ID rules:**
- Use **hyphens** only, never underscores (e.g., `Promo-Landscape`, not `Promo_Landscape`)
- Underscores in composition IDs cause render failures

### Multi-Format Architecture

See [multi-format.md](multi-format.md) for the full LayoutContext pattern. The key idea:

- Create a shared `useLayout()` hook that provides `{ width, height, isPortrait }`
- Each scene adapts its layout based on the context
- Landscape compositions wrap scenes in `<LayoutProvider width={1920} height={1080}>`
- Portrait compositions wrap scenes in `<LayoutProvider width={1080} height={1920}>`
- Font sizes, padding, and layout direction adjust automatically

This means you write **one set of scenes** that works in both formats.

### Scene Duration Guidelines

- **Optimal scene duration: 2-4 seconds** (60-120 frames at 30fps)
- Shorter scenes feel more energetic and hold attention
- Only go to 4s for scenes with complex reveals or multiple elements
- Hook scenes can be as short as 1.5s (45 frames)

### Duration Calculation

**TransitionSeries overlaps scenes during transitions.** The effective duration is NOT the sum of scene durations.

Formula: `effective = sum(sceneDurations) - (numTransitions × transitionDuration)`

Run the timing calculator to verify:

```bash
npx tsx "${SKILL_DIR}/scripts/timing-calculator.ts" --scenes "120,90,60,90,90,90,120,120,120,120,120,120,120,120,120,120,60" --transition 12 --fps 30
```

Set `DURATION` in Root.tsx to the effective value.

### Framing & Sizing

- **Fill the frame.** Elements should be large and confident.
- Headlines: 60-90px minimum. Subtext: 32-44px.
- Browser mockups / device frames: 60-80% of frame width.
- Padding from edges: 60-100px.
- If a scene feels empty, the elements are too small. Scale up.

### Animation Toolkit

- `spring()` for natural motion (play with damping, mass, stiffness)
- `interpolate()` for precise timing control
- CSS 3D transforms (`perspective`, `rotateX`, `rotateY`, `translateZ`) for depth
- Box shadows and gradients for depth
- Lucide icons for consistent iconography

See `remotion-best-practices` skill for animation rules. The critical one: **ALL animations must use `useCurrentFrame()` + `interpolate()` or `spring()`.** CSS transitions and Tailwind animations are forbidden in Remotion.

### Scene Structure

Classic structure as a starting point:
- Hook/Opening → Pain Points → Solution Reveal → Features → Results → CTA

But you might do:
- Cold open on a feature → zoom out to problem → solution
- Customer quote → problem → solution → features
- Single continuous zoom through all content

Trust your instincts.

### After Building

Launch Remotion Studio for preview:
```bash
npx remotion studio
```

Then ask:
```json
{
  "questions": [{
    "question": "How does the video look? Ready to add voiceover and music?",
    "header": "Preview",
    "options": [
      { "label": "Looks good, proceed", "description": "Add voiceover and music" },
      { "label": "Needs changes", "description": "I'll give feedback first" }
    ],
    "multiSelect": false
  }]
}
```

---

## Phase 4: Voiceover

**The voiceover must match the visuals.** This is non-negotiable. See [voiceover.md](voiceover.md) for the full generation guide.

### Quick Workflow

1. **Extract scene timings** from your composition — account for TransitionSeries overlaps
2. **Write script sections** — each section references what's on screen at that moment
3. **Assign emotional presets** per section:

| Emotion | Stability | Similarity | Style | Use For |
|---------|-----------|------------|-------|---------|
| Urgent/Rage | 0.15-0.30 | 0.85-0.95 | 0.4-0.5 | Hook frustration, anger |
| Whisper | 0.25-0.35 | 0.90-0.95 | 0.3 | Secret reveal, intimacy |
| Confident | 0.55-0.65 | 0.80-0.90 | 0.2-0.3 | Features, product reveal |
| Warm | 0.60-0.70 | 0.80-0.85 | 0.2 | Social proof, results |
| Neutral | 0.65-0.75 | 0.85 | 0.2 | Standard narration |
| Dramatic | 0.40-0.50 | 0.85-0.90 | 0.3-0.4 | CTA, closing |

4. **Generate voiceover** — use ElevenLabs API with per-section settings:

```bash
npx tsx "${SKILL_DIR}/scripts/generate-voiceover.ts" --config voiceover-config.json
```

The config format:
```json
{
  "voiceId": "pNInz6obpgDQGcFmaJgB",
  "model": "eleven_multilingual_v2",
  "outputDir": ".",
  "sections": [
    {
      "id": "hook",
      "text": "What... what is this?",
      "startTime": 1.0,
      "emotion": "rage",
      "settings": { "stability": 0.20, "similarity_boost": 0.90, "style": 0.4 }
    },
    {
      "id": "reveal",
      "text": "What if you never had to guess again?",
      "startTime": 8.0,
      "emotion": "whisper",
      "settings": { "stability": 0.30, "similarity_boost": 0.90, "style": 0.3 }
    }
  ]
}
```

5. **Verify with Whisper** — check actual timestamps match intended:

```bash
whisper voiceover.mp3 --model tiny --output_format srt
```

Or with Python:
```bash
python -c "
import whisper
model = whisper.load_model('tiny')
result = model.transcribe('voiceover.mp3')
for s in result['segments']:
    print(f\"{s['start']:.1f}s - {s['end']:.1f}s: {s['text']}\")
"
```

6. **Fix ALL overlaps immediately** — do not ask the user:
   - Shorten text (make it punchier)
   - Increase gaps between sections
   - Regenerate and verify again
   - **Repeat until zero overlaps**

### Audio Normalization

After generating voiceover, normalize volume:

```bash
bunx remotion ffmpeg -y -i voiceover.mp3 -af "loudnorm=I=-16:TP=-1.5:LRA=11" voiceover-normalized.mp3
```

---

## Phase 5: Music & Final Render

### Background Music

```json
{
  "questions": [{
    "question": "Background music?",
    "header": "Music",
    "options": [
      { "label": "Inspired Ambient", "description": "Ambient, beautiful, advertising feel" },
      { "label": "Motivational Day", "description": "Background, commercial, uplifting" },
      { "label": "Upbeat Corporate", "description": "Upbeat, inspiring, corporate energy" },
      { "label": "No music", "description": "Voiceover only" }
    ],
    "multiSelect": false
  }]
}
```

**Bundled music files** (royalty-free from Pixabay):
```bash
cp "${SKILL_DIR}/music/inspired-ambient-141686.mp3" background-music.mp3
# OR
cp "${SKILL_DIR}/music/motivational-day-112790.mp3" background-music.mp3
# OR
cp "${SKILL_DIR}/music/the-upbeat-inspiring-corporate-142313.mp3" background-music.mp3
```

### Mix Audio

**Music volume: 0.08-0.12** (not 0.10 — adjust based on track energy):

```bash
# Calculate fade-out start: total_seconds - 3
# For 60s video: st=57, for 90s video: st=87

bunx remotion ffmpeg -y -i voiceover-normalized.mp3 -i background-music.mp3 \
  -filter_complex "[1:a]volume=0.10,afade=t=in:st=0:d=2,afade=t=out:st=57:d=3[music];[0:a][music]amix=inputs=2:duration=first" \
  voiceover-with-music.mp3
```

### Render Video

Render both landscape and portrait:

```bash
# Landscape
npx remotion render Promo-Landscape out/promo-landscape.mp4 --image-format png --crf 1

# Portrait
npx remotion render Promo-Portrait out/promo-portrait.mp4 --image-format png --crf 1
```

### Combine Video + Audio

```bash
# Landscape final
bunx remotion ffmpeg -y -i out/promo-landscape.mp4 -i voiceover-with-music.mp3 \
  -c:v copy -map 0:v:0 -map 1:a:0 out/promo-landscape-final.mp4

# Portrait final
bunx remotion ffmpeg -y -i out/promo-portrait.mp4 -i voiceover-with-music.mp3 \
  -c:v copy -map 0:v:0 -map 1:a:0 out/promo-portrait-final.mp4
```

If audio was skipped:
```bash
# No-audio version is already the final
cp out/promo-landscape.mp4 out/promo-landscape-final.mp4
cp out/promo-portrait.mp4 out/promo-portrait-final.mp4
```

---

## Iteration Checklist

| Issue | Fix |
|-------|-----|
| Voiceover overlapping | Shorten text or increase gaps, regenerate, verify with Whisper |
| Voice doesn't match screen | Re-read scene content, match script to visuals |
| Voice too fast | Add pauses ("..."), reduce text density |
| Elements too close to edge | Add 60-100px padding |
| Fonts too small | Increase 20-30% |
| Animations feel stiff | Adjust spring damping/mass, add easing |
| Transitions too abrupt | Increase transition duration by 6 frames |
| Blank frames at end | Extend closing scene duration |
| Audio missing in opening | Generate separate rage/emotion clips, mix with adelay |
| Music too loud | Reduce volume from 0.10 to 0.08 |
| Portrait looks cramped | Increase padding, reduce font sizes, stack layouts vertically |
| Composition ID render error | Use hyphens, not underscores |

---

## DON'Ts

- **No jitter effects** — No shaking, vibrating, or jittery motion. Everything should feel smooth and controlled.
- **No full scene spinning** — Don't rotate the entire scene. 3D rotation should be subtle and purposeful (browser mockup with slight perspective tilt, not a 360 spin).
- **No 3D transforms in transitions** — Flip, rotate, and other 3D transitions don't render reliably. Stick to 2D: opacity, position, scale, and gradient masks. (3D transforms are fine for in-scene elements.)
- **No CSS transitions or Tailwind animations** — All motion must use `useCurrentFrame()` with `interpolate()` or `spring()`. Remotion renders frame-by-frame; CSS animations don't work.
- **No underscores in composition IDs** — Use hyphens only. Underscores cause render failures.
- **No hardcoded ffmpeg paths** — Always use `bunx remotion ffmpeg` for cross-platform compatibility.
- **No skipping Whisper verification** — Always verify voiceover timing before finalizing.

---

## Resources

- [voiceover.md](voiceover.md) — Script writing, ElevenLabs generation, Whisper timing verification
- [narrative-templates.md](narrative-templates.md) — Proven hook structures with scene breakdowns
- [multi-format.md](multi-format.md) — Responsive 16:9 + 9:16 architecture with LayoutContext
- [brand-discovery.md](brand-discovery.md) — Auto-detect product context from repositories
- [metallic-swoosh.md](metallic-swoosh.md) — Custom metallic shine transition (DO NOT use clipPath)
- [promo-patterns.md](promo-patterns.md) — Visual inspiration and animation techniques
