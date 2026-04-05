/**
 * Voice Discovery — browse and sample ElevenLabs voices.
 *
 * Usage:
 *   npx tsx discover-voices.ts                        # List all available voices
 *   npx tsx discover-voices.ts --query "deep male"    # Search voices
 *   npx tsx discover-voices.ts --samples 3            # Generate test samples for top 3
 *   npx tsx discover-voices.ts --voice-id <id> --test # Test a specific voice
 *
 * Requires: ELEVENLABS_API_KEY or ELEVEN_LABS_API_KEY environment variable
 */

import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { env, argv } from "node:process";
import { join } from "node:path";

const API_KEY = env.ELEVENLABS_API_KEY || env.ELEVEN_LABS_API_KEY;
if (!API_KEY) {
  console.error("Error: ELEVENLABS_API_KEY not set in environment");
  process.exit(1);
}

const TEST_LINE = "What if you never had to guess again? One click. The answer appears. Invisible. Undetectable. Two seconds.";

interface Voice {
  voice_id: string;
  name: string;
  category: string;
  description?: string;
  labels?: Record<string, string>;
  preview_url?: string;
}

// Parse CLI args
const args = argv.slice(2);
let query = "";
let sampleCount = 0;
let specificVoiceId = "";
let testMode = false;

for (let i = 0; i < args.length; i++) {
  if (args[i] === "--query" && args[i + 1]) query = args[++i];
  else if (args[i] === "--samples" && args[i + 1]) sampleCount = parseInt(args[++i], 10);
  else if (args[i] === "--voice-id" && args[i + 1]) specificVoiceId = args[++i];
  else if (args[i] === "--test") testMode = true;
}

async function fetchVoices(): Promise<Voice[]> {
  const res = await fetch("https://api.elevenlabs.io/v1/voices", {
    headers: { "xi-api-key": API_KEY! },
  });

  if (!res.ok) {
    const body = await res.text();
    console.error(`ElevenLabs API error (${res.status}): ${body}`);
    process.exit(1);
  }

  const data = await res.json();
  return data.voices || [];
}

function matchesQuery(voice: Voice, q: string): boolean {
  if (!q) return true;
  const terms = q.toLowerCase().split(/\s+/);
  const searchable = [
    voice.name,
    voice.description || "",
    voice.category,
    ...Object.values(voice.labels || {}),
  ].join(" ").toLowerCase();

  return terms.every((t) => searchable.includes(t));
}

async function generateSample(voice: Voice, outputDir: string): Promise<string> {
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice.voice_id}`, {
    method: "POST",
    headers: {
      "xi-api-key": API_KEY!,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: TEST_LINE,
      model_id: "eleven_multilingual_v2",
      voice_settings: { stability: 0.5, similarity_boost: 0.85, style: 0.2 },
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    // Check for payment-required errors (library voices on free tier)
    if (res.status === 401 || body.includes("payment_required") || body.includes("free_users_not_allowed")) {
      return `SKIP: ${voice.name} requires paid tier`;
    }
    return `ERROR: ${voice.name} — ${res.status} ${body.slice(0, 100)}`;
  }

  const buffer = Buffer.from(await res.arrayBuffer());
  const filename = `${voice.name.toLowerCase().replace(/\s+/g, "-")}.mp3`;
  const filepath = join(outputDir, filename);
  writeFileSync(filepath, buffer);
  return filepath;
}

async function main() {
  console.log("\n=== ElevenLabs Voice Discovery ===\n");

  const voices = await fetchVoices();
  const filtered = voices.filter((v) => matchesQuery(v, query));

  if (filtered.length === 0) {
    console.log(`No voices found${query ? ` matching "${query}"` : ""}.\n`);
    return;
  }

  console.log(`Found ${filtered.length} voice${filtered.length === 1 ? "" : "s"}${query ? ` matching "${query}"` : ""}:\n`);

  // Print voice table
  const displayVoices = sampleCount > 0 ? filtered.slice(0, sampleCount) : filtered.slice(0, 20);

  for (const v of displayVoices) {
    const labels = v.labels ? Object.values(v.labels).join(", ") : "";
    console.log(`  ${v.name}`);
    console.log(`    ID: ${v.voice_id}`);
    console.log(`    Category: ${v.category}`);
    if (labels) console.log(`    Labels: ${labels}`);
    if (v.description) console.log(`    Description: ${v.description.slice(0, 120)}`);
    console.log("");
  }

  if (filtered.length > 20 && sampleCount === 0) {
    console.log(`  ... and ${filtered.length - 20} more. Use --query to filter.\n`);
  }

  // Generate test samples if requested
  if (specificVoiceId && testMode) {
    const voice = voices.find((v) => v.voice_id === specificVoiceId);
    if (!voice) {
      console.error(`Voice ID "${specificVoiceId}" not found.`);
      process.exit(1);
    }
    const outputDir = "voice-tests";
    if (!existsSync(outputDir)) mkdirSync(outputDir, { recursive: true });
    console.log(`Generating test sample for ${voice.name}...`);
    const result = await generateSample(voice, outputDir);
    console.log(`  ${result}\n`);
    return;
  }

  if (sampleCount > 0) {
    const outputDir = "voice-tests";
    if (!existsSync(outputDir)) mkdirSync(outputDir, { recursive: true });
    console.log(`Generating ${Math.min(sampleCount, displayVoices.length)} test samples in ${outputDir}/...\n`);
    console.log(`Test line: "${TEST_LINE}"\n`);

    for (const v of displayVoices.slice(0, sampleCount)) {
      console.log(`  Generating: ${v.name}...`);
      const result = await generateSample(v, outputDir);
      console.log(`    ${result}`);
    }
    console.log("\nDone! Listen to the samples and pick your favorite voice.\n");
  }
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
