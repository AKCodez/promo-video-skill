/**
 * Voiceover Generator — generate, verify, and fix voiceover using ElevenLabs + Whisper.
 *
 * Usage:
 *   npx tsx generate-voiceover.ts --config voiceover-config.json
 *   npx tsx generate-voiceover.ts --config voiceover-config.json --verify-only
 *   npx tsx generate-voiceover.ts --config voiceover-config.json --normalize
 *
 * Config format (voiceover-config.json):
 * {
 *   "voiceId": "pNInz6obpgDQGcFmaJgB",
 *   "model": "eleven_multilingual_v2",
 *   "outputDir": ".",
 *   "outputFile": "voiceover.mp3",
 *   "totalDurationSeconds": 60,
 *   "sections": [
 *     {
 *       "id": "hook",
 *       "text": "What if you never had to guess again?",
 *       "startTime": 1.0,
 *       "emotion": "whisper",
 *       "settings": { "stability": 0.30, "similarity_boost": 0.90, "style": 0.3 }
 *     }
 *   ]
 * }
 *
 * Emotional presets (used when no explicit settings are provided):
 *   rage:      { stability: 0.20, similarity_boost: 0.90, style: 0.40 }
 *   whisper:   { stability: 0.30, similarity_boost: 0.90, style: 0.30 }
 *   confident: { stability: 0.60, similarity_boost: 0.85, style: 0.25 }
 *   warm:      { stability: 0.65, similarity_boost: 0.80, style: 0.20 }
 *   neutral:   { stability: 0.70, similarity_boost: 0.85, style: 0.20 }
 *   dramatic:  { stability: 0.45, similarity_boost: 0.88, style: 0.35 }
 *
 * Requires: ELEVENLABS_API_KEY environment variable
 * Optional: whisper (pip install openai-whisper) for timing verification
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, unlinkSync } from "node:fs";
import { execSync } from "node:child_process";
import { join, resolve } from "node:path";
import { argv, env } from "node:process";

const API_KEY = env.ELEVENLABS_API_KEY || env.ELEVEN_LABS_API_KEY;
if (!API_KEY) {
  console.error("Error: ELEVENLABS_API_KEY not set in environment");
  process.exit(1);
}

// --- Emotional presets ---

const EMOTION_PRESETS: Record<string, { stability: number; similarity_boost: number; style: number }> = {
  rage:      { stability: 0.20, similarity_boost: 0.90, style: 0.40 },
  whisper:   { stability: 0.30, similarity_boost: 0.90, style: 0.30 },
  confident: { stability: 0.60, similarity_boost: 0.85, style: 0.25 },
  warm:      { stability: 0.65, similarity_boost: 0.80, style: 0.20 },
  neutral:   { stability: 0.70, similarity_boost: 0.85, style: 0.20 },
  dramatic:  { stability: 0.45, similarity_boost: 0.88, style: 0.35 },
};

// --- Parse CLI ---

const args = argv.slice(2);
let configPath = "";
let verifyOnly = false;
let normalizeOnly = false;

for (let i = 0; i < args.length; i++) {
  if (args[i] === "--config" && args[i + 1]) configPath = args[++i];
  else if (args[i] === "--verify-only") verifyOnly = true;
  else if (args[i] === "--normalize") normalizeOnly = true;
}

if (!configPath) {
  console.log("Usage: npx tsx generate-voiceover.ts --config voiceover-config.json");
  console.log("\nOptions:");
  console.log("  --config       Path to voiceover config JSON (required)");
  console.log("  --verify-only  Only run Whisper verification on existing voiceover.mp3");
  console.log("  --normalize    Only normalize existing voiceover.mp3");
  process.exit(0);
}

interface Section {
  id: string;
  text: string;
  startTime: number;
  emotion?: string;
  settings?: { stability: number; similarity_boost: number; style?: number };
}

interface Config {
  voiceId: string;
  model: string;
  outputDir: string;
  outputFile: string;
  totalDurationSeconds: number;
  sections: Section[];
}

const config: Config = JSON.parse(readFileSync(resolve(configPath), "utf-8"));
const outputDir = resolve(config.outputDir || ".");
if (!existsSync(outputDir)) mkdirSync(outputDir, { recursive: true });

// --- Find ffmpeg ---

function findFfmpeg(): string {
  // Try bunx remotion ffmpeg
  try {
    execSync("bunx remotion ffmpeg -version 2>&1", { timeout: 10000 });
    return "bunx remotion ffmpeg";
  } catch {}
  try {
    execSync("npx remotion ffmpeg -version 2>&1", { timeout: 10000 });
    return "npx remotion ffmpeg";
  } catch {}
  try {
    execSync("ffmpeg -version 2>&1", { timeout: 5000 });
    return "ffmpeg";
  } catch {}
  console.error("Error: ffmpeg not found. Install Remotion or add ffmpeg to PATH.");
  process.exit(1);
}

const FFMPEG = findFfmpeg();

// --- Generate section audio ---

async function generateSection(section: Section): Promise<string> {
  const settings = section.settings || EMOTION_PRESETS[section.emotion || "neutral"] || EMOTION_PRESETS.neutral;

  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${config.voiceId}`, {
    method: "POST",
    headers: {
      "xi-api-key": API_KEY!,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: section.text,
      model_id: config.model || "eleven_multilingual_v2",
      voice_settings: {
        stability: settings.stability,
        similarity_boost: settings.similarity_boost,
        style: settings.style ?? 0.2,
        use_speaker_boost: true,
      },
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`ElevenLabs API error for section "${section.id}": ${res.status} ${body.slice(0, 200)}`);
  }

  const buffer = Buffer.from(await res.arrayBuffer());
  const filepath = join(outputDir, `section-${section.id}.mp3`);
  writeFileSync(filepath, buffer);
  return filepath;
}

// --- Get audio duration ---

function getAudioDuration(filepath: string): number {
  try {
    const cmd = `${FFMPEG === "ffmpeg" ? "ffprobe" : FFMPEG.replace("ffmpeg", "ffprobe")} -v error -show_entries format=duration -of csv=p=0 "${filepath}"`;
    const out = execSync(cmd, { timeout: 10000, encoding: "utf-8" }).trim();
    return parseFloat(out);
  } catch {
    return 0;
  }
}

// --- Concatenate with silence gaps ---

function concatenateSections(sectionFiles: Array<{ path: string; startTime: number; id: string }>): string {
  const outputPath = join(outputDir, config.outputFile || "voiceover.mp3");
  const totalMs = Math.round((config.totalDurationSeconds || 60) * 1000);

  // Build ffmpeg filter for mixing with delays
  const inputs = sectionFiles.map((s, i) => `-i "${s.path}"`).join(" ");
  const delays = sectionFiles.map((s, i) => {
    const delayMs = Math.round(s.startTime * 1000);
    return `[${i}:a]adelay=${delayMs}|${delayMs}[a${i}]`;
  }).join("; ");
  const mixInputs = sectionFiles.map((_, i) => `[a${i}]`).join("");

  const cmd = `${FFMPEG} -y ${inputs} -filter_complex "${delays}; ${mixInputs}amix=inputs=${sectionFiles.length}:duration=longest:normalize=0" -t ${config.totalDurationSeconds || 60} "${outputPath}"`;

  try {
    execSync(cmd, { timeout: 60000, encoding: "utf-8", stdio: "pipe" });
  } catch (err: any) {
    console.error(`ffmpeg concatenation error: ${err.stderr?.slice(0, 500) || err.message}`);
    process.exit(1);
  }

  return outputPath;
}

// --- Normalize audio ---

function normalizeAudio(inputPath: string): string {
  const outputPath = inputPath.replace(".mp3", "-normalized.mp3");
  const cmd = `${FFMPEG} -y -i "${inputPath}" -af "loudnorm=I=-16:TP=-1.5:LRA=11" "${outputPath}"`;
  try {
    execSync(cmd, { timeout: 30000, encoding: "utf-8", stdio: "pipe" });
  } catch (err: any) {
    console.error(`Normalization error: ${err.stderr?.slice(0, 500) || err.message}`);
    return inputPath;
  }
  return outputPath;
}

// --- Whisper verification ---

function verifyWithWhisper(filepath: string): Array<{ start: number; end: number; text: string }> {
  // Try whisper CLI
  try {
    const srtPath = filepath.replace(".mp3", ".srt");
    execSync(`whisper "${filepath}" --model tiny --output_format srt --output_dir "${outputDir}" 2>&1`, {
      timeout: 60000,
      encoding: "utf-8",
    });
    if (existsSync(srtPath)) {
      const srt = readFileSync(srtPath, "utf-8");
      return parseSrt(srt);
    }
  } catch {}

  // Try Python whisper
  try {
    const out = execSync(
      `python -c "import whisper; model = whisper.load_model('tiny'); result = model.transcribe('${filepath.replace(/\\/g, "/")}'); [print(f\\\"SEGMENT:{s['start']:.2f}:{s['end']:.2f}:{s['text']}\\\") for s in result['segments']]"`,
      { timeout: 60000, encoding: "utf-8" }
    );
    return out
      .split("\n")
      .filter((l) => l.startsWith("SEGMENT:"))
      .map((l) => {
        const parts = l.slice(8).split(":");
        return { start: parseFloat(parts[0]), end: parseFloat(parts[1]), text: parts.slice(2).join(":").trim() };
      });
  } catch {}

  console.log("Warning: Whisper not available — skipping timing verification.");
  console.log("Install with: pip install openai-whisper");
  return [];
}

function parseSrt(srt: string): Array<{ start: number; end: number; text: string }> {
  const segments: Array<{ start: number; end: number; text: string }> = [];
  const blocks = srt.split("\n\n").filter((b) => b.trim());
  for (const block of blocks) {
    const lines = block.split("\n");
    if (lines.length < 3) continue;
    const timeMatch = lines[1].match(/(\d+):(\d+):(\d+),(\d+)\s*-->\s*(\d+):(\d+):(\d+),(\d+)/);
    if (!timeMatch) continue;
    const start = parseInt(timeMatch[1]) * 3600 + parseInt(timeMatch[2]) * 60 + parseInt(timeMatch[3]) + parseInt(timeMatch[4]) / 1000;
    const end = parseInt(timeMatch[5]) * 3600 + parseInt(timeMatch[6]) * 60 + parseInt(timeMatch[7]) + parseInt(timeMatch[8]) / 1000;
    const text = lines.slice(2).join(" ").trim();
    segments.push({ start, end, text });
  }
  return segments;
}

// --- Check for overlaps ---

function checkOverlaps(
  segments: Array<{ start: number; end: number; text: string }>,
  sections: Section[]
): Array<{ section1: string; section2: string; overlapSeconds: number }> {
  const overlaps: Array<{ section1: string; section2: string; overlapSeconds: number }> = [];

  // Map whisper segments to sections based on proximity to start times
  const sectionTimings: Array<{ id: string; actualStart: number; actualEnd: number }> = [];

  for (const section of sections) {
    const closest = segments.find((s) => Math.abs(s.start - section.startTime) < 3);
    if (closest) {
      // Find all segments that belong to this section
      const belonging = segments.filter(
        (s) => s.start >= section.startTime - 1 && s.start < (sections[sections.indexOf(section) + 1]?.startTime || Infinity)
      );
      const lastEnd = Math.max(...belonging.map((s) => s.end));
      sectionTimings.push({ id: section.id, actualStart: closest.start, actualEnd: lastEnd });
    }
  }

  for (let i = 0; i < sectionTimings.length - 1; i++) {
    const current = sectionTimings[i];
    const next = sectionTimings[i + 1];
    const nextSectionStart = sections.find((s) => s.id === next.id)?.startTime || 0;

    if (current.actualEnd > nextSectionStart - 0.3) {
      overlaps.push({
        section1: current.id,
        section2: next.id,
        overlapSeconds: current.actualEnd - nextSectionStart + 0.3,
      });
    }
  }

  return overlaps;
}

// --- Main ---

async function main() {
  console.log("\n=== Voiceover Generator ===\n");

  if (normalizeOnly) {
    const inputPath = join(outputDir, config.outputFile || "voiceover.mp3");
    console.log(`Normalizing: ${inputPath}`);
    const normalized = normalizeAudio(inputPath);
    console.log(`Output: ${normalized}\n`);
    return;
  }

  if (verifyOnly) {
    const inputPath = join(outputDir, config.outputFile || "voiceover.mp3");
    console.log(`Verifying timing: ${inputPath}\n`);
    const segments = verifyWithWhisper(inputPath);
    if (segments.length === 0) return;

    console.log("Whisper Transcription:");
    for (const s of segments) {
      console.log(`  ${s.start.toFixed(1)}s - ${s.end.toFixed(1)}s: ${s.text}`);
    }

    const overlaps = checkOverlaps(segments, config.sections);
    if (overlaps.length > 0) {
      console.log("\nOVERLAPS DETECTED:");
      for (const o of overlaps) {
        console.log(`  "${o.section1}" bleeds into "${o.section2}" by ${o.overlapSeconds.toFixed(1)}s`);
      }
      console.log("\nFix: Shorten text in overlapping sections, increase gaps, then regenerate.\n");
    } else {
      console.log("\nNo overlaps detected. Timing looks good!\n");
    }
    return;
  }

  // Generate all sections
  console.log(`Voice: ${config.voiceId}`);
  console.log(`Model: ${config.model}`);
  console.log(`Sections: ${config.sections.length}`);
  console.log(`Target duration: ${config.totalDurationSeconds}s\n`);

  const sectionFiles: Array<{ path: string; startTime: number; id: string }> = [];

  for (const section of config.sections) {
    const emotion = section.emotion || "neutral";
    console.log(`  Generating "${section.id}" (${emotion}) at ${section.startTime}s...`);
    const filepath = await generateSection(section);
    const duration = getAudioDuration(filepath);
    console.log(`    Saved: ${filepath} (${duration.toFixed(1)}s)`);

    // Check if this section's audio would bleed into next section
    const nextSection = config.sections[config.sections.indexOf(section) + 1];
    if (nextSection && section.startTime + duration > nextSection.startTime - 0.3) {
      console.log(`    WARNING: Audio ends at ${(section.startTime + duration).toFixed(1)}s but next section starts at ${nextSection.startTime}s`);
    }

    sectionFiles.push({ path: filepath, startTime: section.startTime, id: section.id });
  }

  // Concatenate
  console.log("\nConcatenating sections...");
  const voiceoverPath = concatenateSections(sectionFiles);
  console.log(`Output: ${voiceoverPath}`);

  // Normalize
  console.log("\nNormalizing audio...");
  const normalizedPath = normalizeAudio(voiceoverPath);
  console.log(`Normalized: ${normalizedPath}`);

  // Verify with Whisper
  console.log("\nVerifying timing with Whisper...");
  const segments = verifyWithWhisper(normalizedPath);
  if (segments.length > 0) {
    console.log("\nWhisper Transcription:");
    for (const s of segments) {
      console.log(`  ${s.start.toFixed(1)}s - ${s.end.toFixed(1)}s: ${s.text}`);
    }

    const overlaps = checkOverlaps(segments, config.sections);
    if (overlaps.length > 0) {
      console.log("\nOVERLAPS DETECTED:");
      for (const o of overlaps) {
        console.log(`  "${o.section1}" bleeds into "${o.section2}" by ${o.overlapSeconds.toFixed(1)}s`);
      }
      console.log("\nAction required: Shorten text in overlapping sections and regenerate.\n");
    } else {
      console.log("\nNo overlaps detected. Voiceover is ready!\n");
    }
  }

  // Cleanup section files
  for (const sf of sectionFiles) {
    try { unlinkSync(sf.path); } catch {}
  }

  console.log("Done!\n");
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
