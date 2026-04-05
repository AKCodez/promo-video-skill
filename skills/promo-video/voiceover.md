# Voiceover Generation Guide

Generate professional AI voiceover using ElevenLabs, precisely timed and content-matched to video scenes.

## Requirements

- `ELEVENLABS_API_KEY` environment variable (or `ELEVEN_LABS_API_KEY`)
- `bunx remotion ffmpeg` for audio processing (cross-platform, no PATH issues)
- `whisper` (optional but recommended) for timing verification — `pip install openai-whisper`

---

## The Golden Rule

**The voiceover must match what's on screen.** If the viewer sees "99.2% Accuracy" while hearing about platforms, the video feels broken. Every word must reference the visual it accompanies.

---

## Workflow

### Step 1: Extract Scene Timings

Read your composition file and build a timing table. **Account for TransitionSeries overlaps** — scenes start earlier than the sum of previous durations.

Use the timing calculator:
```bash
npx tsx "${SKILL_DIR}/scripts/timing-calculator.ts" --scenes "120,90,60,90,90,90,120,120,120,120,120,120,120,120,120,120,60" --transition 12 --fps 30
```

This outputs the exact start/end time for each scene.

### Step 2: Read Every Scene Component

For each scene, note:
- Title text displayed
- Stats or numbers shown
- Key visual elements (mockups, icons, animations)
- When elements appear within the scene (some animate in at 0.5s)

### Step 3: Write Time-Aligned Script

Structure your script with EXACT scene boundaries:

```
[0-4s — Scene 1: The Question — Visual: "Why is this so hard?"]
What... what is this?

[4-7s — Scene 2: The Rage — Visual: Error messages flooding screen]
Are you serious right now?!

[7-9s — Scene 3: The Silence — Visual: Black screen]
(silence)

[9-12s — Scene 4: The Whisper — Visual: Logo fading in with glow]
What if you never had to guess again?
```

**Content rules:**
- Reference the title/stat shown on screen
- Don't describe something not yet visible
- Time reveal moments (e.g., "Introducing [Product]" exactly when logo appears)
- Leave 0.5-1s buffer at scene start before speaking
- Leave 0.5s buffer before scene end

### Step 4: Assign Emotional Presets

Each section of the voiceover should have an emotional tone. Use these presets with ElevenLabs:

| Emotion | Stability | Similarity Boost | Style | When to Use |
|---------|-----------|-----------------|-------|-------------|
| **Rage** | 0.15-0.25 | 0.85-0.95 | 0.4-0.5 | Hook frustration, anger, disbelief |
| **Whisper** | 0.25-0.35 | 0.90-0.95 | 0.3 | Secret reveal, intimacy, conspiracy |
| **Confident** | 0.55-0.65 | 0.80-0.90 | 0.2-0.3 | Features, product capabilities |
| **Warm** | 0.60-0.70 | 0.80-0.85 | 0.2 | Social proof, results, testimonials |
| **Neutral** | 0.65-0.75 | 0.85 | 0.2 | Standard narration, transitions |
| **Dramatic** | 0.40-0.50 | 0.85-0.90 | 0.3-0.4 | CTA, closing, big reveals |

**Low stability** = more expressive, emotional, unpredictable
**High stability** = calmer, more consistent, professional

### Step 5: Generate Voiceover

Create a config file (`voiceover-config.json`):

```json
{
  "voiceId": "pNInz6obpgDQGcFmaJgB",
  "model": "eleven_multilingual_v2",
  "outputDir": ".",
  "outputFile": "voiceover.mp3",
  "totalDurationSeconds": 60,
  "sections": [
    {
      "id": "rage-01",
      "text": "What... what is this?",
      "startTime": 1.0,
      "emotion": "rage",
      "settings": { "stability": 0.20, "similarity_boost": 0.90, "style": 0.4 }
    },
    {
      "id": "rage-02",
      "text": "Are you serious right now?!",
      "startTime": 4.5,
      "emotion": "rage",
      "settings": { "stability": 0.15, "similarity_boost": 0.90, "style": 0.5 }
    },
    {
      "id": "whisper",
      "text": "What if you never had to guess again?",
      "startTime": 9.5,
      "emotion": "whisper"
    },
    {
      "id": "solve",
      "text": "One click. The answer appears. Invisible. Undetectable.",
      "startTime": 13.0,
      "emotion": "dramatic"
    },
    {
      "id": "feature-01",
      "text": "Smart detection scans the question instantly.",
      "startTime": 16.0,
      "emotion": "confident"
    }
  ]
}
```

Run the generator:
```bash
npx tsx "${SKILL_DIR}/scripts/generate-voiceover.ts" --config voiceover-config.json
```

Or generate sections manually with curl:

```bash
curl -s "https://api.elevenlabs.io/v1/text-to-speech/YOUR_VOICE_ID" \
  -H "xi-api-key: $ELEVENLABS_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Your text here",
    "model_id": "eleven_multilingual_v2",
    "voice_settings": {
      "stability": 0.60,
      "similarity_boost": 0.85,
      "style": 0.2,
      "use_speaker_boost": true
    }
  }' -o section-01.mp3
```

### Step 6: Verify Timing with Whisper

**Do not skip this step.** After generating, verify actual timestamps:

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

Compare Whisper output against scene timings:
```
Scene: The Whisper (9-12s)
  Expected: "What if you never..." starts at 9.5s
  Actual:   "What if you never..." starts at 9.3s  (within scene)

Scene: The Solve (12-15s)
  Expected: "One click..." starts at 13.0s
  Actual:   "One click..." starts at 11.8s  OVERLAPS with previous scene!
```

### Step 7: Fix ALL Overlaps

**If ANY overlap is detected, fix it immediately. Do not ask the user.**

Fixes in order of preference:
1. **Shorten the text** — "Smart detection scans the question instantly" → "Scans questions instantly"
2. **Add a pause** — Insert "..." in the text for a natural breath
3. **Increase the gap** — Push the next section's startTime 1-2s later
4. **Split the section** — Break one long section into two shorter ones

**After fixing: regenerate and verify again. Repeat until ZERO overlaps.**

---

## Rage/Emotion Audio

For hooks that use frustration, anger, or other extreme emotions:

1. **Generate rage clips separately** with extreme settings:
   ```json
   { "stability": 0.15, "similarity_boost": 0.90, "style": 0.5 }
   ```

2. **Test multiple takes** — low stability produces varied results. Generate 2-3 versions and pick the best.

3. **Mix rage clips into voiceover** with precise positioning using ffmpeg adelay:
   ```bash
   bunx remotion ffmpeg -y \
     -i narration.mp3 -i rage_01.mp3 -i rage_02.mp3 \
     -filter_complex \
       "[1:a]adelay=1000|1000[r1]; \
        [2:a]adelay=4500|4500[r2]; \
        [0:a][r1][r2]amix=inputs=3:duration=longest:normalize=0" \
     -t 60 voiceover-combined.mp3
   ```

   The `adelay` values are in milliseconds (1000 = 1s, 4500 = 4.5s).

---

## Audio Processing

### Normalize Volume

```bash
bunx remotion ffmpeg -y -i voiceover.mp3 -af "loudnorm=I=-16:TP=-1.5:LRA=11" voiceover-normalized.mp3
```

### Add Background Music

Music volume should be **0.08-0.12** (8-12% of voice level). Adjust based on track energy:
- Ambient/chill tracks: 0.10-0.12
- Upbeat/energetic tracks: 0.08-0.10

```bash
# Calculate fade-out start: total_seconds - 3
# 60s video: st=57  |  90s video: st=87  |  30s video: st=27

bunx remotion ffmpeg -y -i voiceover-normalized.mp3 -i background-music.mp3 \
  -filter_complex "[1:a]volume=0.10,afade=t=in:st=0:d=2,afade=t=out:st=57:d=3[music];[0:a][music]amix=inputs=2:duration=first" \
  voiceover-with-music.mp3
```

### Combine with Video

```bash
bunx remotion ffmpeg -y -i video.mp4 -i voiceover-with-music.mp3 \
  -c:v copy -map 0:v:0 -map 1:a:0 \
  final.mp4
```

---

## Voice Selection Tips

### Built-in Voices (Free Tier)

| Voice | ID | Best For |
|-------|-----|---------|
| Matilda | `XrExE9yKIg1WjnnlVkGX` | Professional, versatile — good default |
| Rachel | `21m00Tcm4TlvDq8ikWAM` | Calm, authoritative — corporate |
| Daniel | `onwK4e9ZLuTAKqWW03F9` | Polished male — advertising |
| Josh | `TxGEqnHWrfWFTfGW9XjX` | Friendly, conversational — approachable |
| Adam | `pNInz6obpgDQGcFmaJgB` | Deep, dramatic — cinematic, intense |

### Browsing More Voices

```bash
npx tsx "${SKILL_DIR}/scripts/discover-voices.ts" --query "deep male" --samples 3
```

**Important:** Library/premium voices require a paid ElevenLabs tier. If you get `payment_required` or `free_users_not_allowed` errors, stick to the built-in voices above.

### Matching Voice to Template

| Narrative Template | Recommended Voice Style |
|-------------------|------------------------|
| The Rage Hook | Deep, dramatic (Adam) — handles emotional range |
| The Problem Stack | Authoritative (Daniel, Rachel) — drives urgency |
| The Demo First | Friendly, warm (Josh, Matilda) — approachable |
| The Transformation | Confident, polished (Matilda, Daniel) — professional |

---

## Script Writing Tips

### DO
- Write complete thoughts, not fragments
- Allow 0.5-1s buffer at scene start before speaking
- Allow 0.5s buffer before scene end
- Match spoken stats to visual stats exactly
- Use conversational, natural language
- Keep sentences short (10-15 words max)

### DON'T
- Don't reference visuals not yet shown
- Don't continue speaking into the next scene
- Don't make it too dense — audio needs breathing room
- Don't skip the emotional hook in the opening
- Don't use jargon the audience won't know
- Don't start every sentence the same way

### Script Length Guidelines

| Duration | Target Word Count | Words Per Scene |
|----------|------------------|----------------|
| 30s | 70-90 words | 7-12 |
| 60s | 140-170 words | 8-12 |
| 90s | 200-250 words | 8-12 |

Less is more. Silence between sections lets visuals breathe.

---

## Troubleshooting

| Issue | Cause | Fix |
|-------|-------|-----|
| **Voiceover overlaps itself** | Sections too close | Shorten text OR increase gap, regenerate, verify |
| **Voice sounds robotic** | Stability too high | Lower stability to 0.50-0.60 |
| **Voice sounds unhinged** | Stability too low | Raise stability to 0.60-0.70 |
| **Speech too fast** | Too much text | Cut words, add "..." pauses |
| **Feature name at wrong time** | Script not aligned to scene | Re-read scene component, match reveal timing |
| **No audio in opening** | Forgot rage/emotion clips | Generate separate clips, mix with adelay |
| **Music drowns voice** | Volume too high | Reduce from 0.10 to 0.08 |
| **Silence gaps too long** | Section start times too far apart | Reduce gaps or add more narration |

**The verification loop: Generate → Whisper verify → Fix overlaps → Regenerate → Verify again → Repeat until clean**
