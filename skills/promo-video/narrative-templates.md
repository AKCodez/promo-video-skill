# Narrative Templates

Proven story structures for promo videos. Pick one that fits your product's personality, or combine elements from multiple templates.

---

## Template 1: The Rage Hook

**Best for:** Products that solve a deeply frustrating problem. High engagement — the emotional contrast hooks viewers.

**Emotional arc:** Frustration → Silence → Whisper → Reveal → Confidence → CTA

### Scene Breakdown (60s)

| Scene | Time | Frames | Content | Emotion | Voiceover |
|-------|------|--------|---------|---------|-----------|
| 1. The Question | 0-4s | 120 | Show the problem (quiz, deadline, error) | Tension | "What... what is this?" |
| 2. The Rage | 4-7s | 90 | Frustrated reactions, chaos, red flashes | Rage | "Are you serious right now?!" |
| 3. The Silence | 7-9s | 60 | Hard cut to black. Beat. | Emptiness | *(silence)* |
| 4. The Whisper | 9-12s | 90 | Product logo fades in, subtle glow | Mystery | "What if you never had to guess again?" |
| 5. The Solve | 12-15s | 90 | Show the product solving the problem | Satisfaction | "One click. The answer appears." |
| 6-9. Features | 15-31s | 4×120 | Feature showcases with demos | Confidence | Feature explanations |
| 10-12. Modes | 31-43s | 3×120 | Different use modes/options | Authority | Mode descriptions |
| 13. Platforms | 43-47s | 120 | Where it works | Trust | "Works everywhere" |
| 14. Stats | 47-51s | 120 | Social proof numbers | Warm | Stats callout |
| 15. Logo | 51-55s | 120 | Brand reveal | Pride | Product name |
| 16. CTA | 55-59s | 120 | Call to action | Dramatic | CTA line |
| 17. End Card | 59-61s | 60 | Final branding | Calm | *(silence)* |

### Key Production Notes

- **Hard cut between Rage and Silence** — no fade transition. The abrupt silence is the hook.
- **Rage audio** should be generated separately with extreme ElevenLabs settings (stability: 0.15-0.20, style: 0.4-0.5)
- **The Whisper** uses low stability (0.25-0.35) for intimate, conspiratorial feel
- Use red/orange colors for frustration scenes, transition to product brand colors at the solve

### Voiceover Emotional Presets

```
Scenes 1-2: rage     — stability: 0.20, similarity_boost: 0.90, style: 0.40
Scene 3:    (silence)
Scene 4:    whisper   — stability: 0.30, similarity_boost: 0.90, style: 0.30
Scene 5:    dramatic  — stability: 0.45, similarity_boost: 0.88, style: 0.35
Scenes 6+:  confident — stability: 0.60, similarity_boost: 0.85, style: 0.25
CTA:        dramatic  — stability: 0.45, similarity_boost: 0.88, style: 0.35
```

---

## Template 2: The Problem Stack

**Best for:** Products with multiple pain points to address. Builds urgency through accumulation.

**Emotional arc:** Pain → Pain → Pain → "What if..." → Solution → Features → Proof → CTA

### Scene Breakdown (60s)

| Scene | Time | Frames | Content | Emotion |
|-------|------|--------|---------|---------|
| 1. Pain 1 | 0-3s | 90 | First pain point, stat | Urgent |
| 2. Pain 2 | 3-6s | 90 | Second pain point, stat | Urgent |
| 3. Pain 3 | 6-9s | 90 | Third pain point, stat | Urgent |
| 4. The Turn | 9-12s | 90 | "What if..." text | Hope |
| 5. Solution Reveal | 12-16s | 120 | Product logo, one-line value prop | Confident |
| 6-9. Features | 16-32s | 4×120 | Feature demos | Confident |
| 10. Proof | 32-36s | 120 | Stats, testimonials | Warm |
| 11. Logo | 36-40s | 120 | Brand | Pride |
| 12. CTA | 40-44s | 120 | Call to action | Dramatic |

### Key Production Notes

- **Rapid-fire pain points** — each should hit fast with a stat and short text
- **Visual escalation** — each pain point should feel more intense (bigger text, redder colors, faster animations)
- **"What if..." is the pivot** — everything before is negative, everything after is positive
- Use staggered text reveals for pain points (word by word)

---

## Template 3: The Demo First

**Best for:** Products where the experience sells itself. "Show, don't tell."

**Emotional arc:** Magic moment → "How?" → Explanation → Features → Proof → CTA

### Scene Breakdown (60s)

| Scene | Time | Frames | Content | Emotion |
|-------|------|--------|---------|---------|
| 1. The Magic | 0-5s | 150 | Show the product doing something impressive | Wow |
| 2. The Question | 5-8s | 90 | "How is this possible?" | Curiosity |
| 3. Behind the Scenes | 8-12s | 120 | Technical reveal, architecture | Smart |
| 4-7. Features | 12-28s | 4×120 | Detailed feature walkthroughs | Confident |
| 8. Speed/Performance | 28-32s | 120 | Benchmark, speed demo | Impressive |
| 9. Platforms | 32-36s | 120 | Where it works | Trust |
| 10. Social Proof | 36-40s | 120 | User quotes, stats | Warm |
| 11. Logo + CTA | 40-44s | 120 | Final brand + action | Dramatic |

### Key Production Notes

- **Open cold** — no intro, no buildup. Drop the viewer into the most impressive moment.
- **Screen recording style** for the opening — make it feel real, not animated
- Use a cursor animation to show the user's perspective
- The "How?" moment should be a literal question on screen

---

## Template 4: The Transformation

**Best for:** Products that change a workflow or process. Before/after contrast is compelling.

**Emotional arc:** Before (pain) → After (joy) → How → Features → Proof → CTA

### Scene Breakdown (60s)

| Scene | Time | Frames | Content | Emotion |
|-------|------|--------|---------|---------|
| 1. Before | 0-5s | 150 | The old way — messy, slow, painful | Frustration |
| 2. The Divide | 5-7s | 60 | Split screen or transition | Tension |
| 3. After | 7-12s | 150 | The new way — clean, fast, effortless | Joy |
| 4. Product Reveal | 12-16s | 120 | "Meet [Product]" | Confident |
| 5-8. Features | 16-32s | 4×120 | Feature showcases | Confident |
| 9. Results | 32-36s | 120 | Before/after metrics comparison | Impressive |
| 10. Logo + CTA | 36-40s | 120 | Final brand + action | Dramatic |

### Key Production Notes

- **Split-screen is powerful** for the before/after moment
- Use muted/desaturated colors for "before", vibrant colors for "after"
- The transition between before and after should be the most polished animation in the video
- Show real metrics improvement (time saved, accuracy gained, etc.)

---

## Timing Guidelines (All Templates)

| Duration | Scenes | Recommended Template |
|----------|--------|---------------------|
| 30s | 8-10 scenes, 2-3s each | Problem Stack or Demo First |
| 60s | 12-17 scenes, 2-4s each | Any template |
| 90s | 20-25 scenes, 2-4s each | Rage Hook or Transformation (more room for features) |

### Scene Duration Rules

- **Hook scenes**: 2-3s (fast, punchy)
- **Feature scenes**: 3-4s (need time to show UI)
- **Transition/breathing scenes**: 1.5-2s (silence, black, logo fade)
- **CTA scene**: 3-4s (needs to be readable)
- **End card**: 2s (just branding, URL)

### Pacing

- Front-load energy — the first 5 seconds decide if someone keeps watching
- Vary scene lengths — monotonous timing (all 3s scenes) feels robotic
- Use silence strategically — a 1-2s pause after the hook creates tension
- Speed up during feature sections, slow down for the CTA
