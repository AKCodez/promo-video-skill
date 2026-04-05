/**
 * Preflight Check — validates environment before starting a promo video project.
 *
 * Usage: npx tsx preflight.ts
 *
 * Checks:
 * - Node.js >= 18
 * - ELEVENLABS_API_KEY is set
 * - bunx remotion ffmpeg works (cross-platform ffmpeg)
 * - Whisper is available for voiceover timing verification
 */

import { execSync } from "node:child_process";
import { env, version } from "node:process";

interface CheckResult {
  name: string;
  passed: boolean;
  message: string;
  fix?: string;
}

function checkNodeVersion(): CheckResult {
  const major = parseInt(version.slice(1).split(".")[0], 10);
  if (major >= 18) {
    return { name: "Node.js", passed: true, message: `v${version.slice(1)} (>= 18 required)` };
  }
  return {
    name: "Node.js",
    passed: false,
    message: `v${version.slice(1)} — version 18+ required`,
    fix: "Install Node.js 18+ from https://nodejs.org or use nvm/fnm to upgrade",
  };
}

function checkElevenLabsKey(): CheckResult {
  const key = env.ELEVENLABS_API_KEY || env.ELEVEN_LABS_API_KEY;
  if (key && key.length > 10) {
    return { name: "ElevenLabs API Key", passed: true, message: `Set (${key.slice(0, 6)}...${key.slice(-4)})` };
  }
  return {
    name: "ElevenLabs API Key",
    passed: false,
    message: "Not found in environment",
    fix: 'Set ELEVENLABS_API_KEY in your environment:\n  - Windows PowerShell: $env:ELEVENLABS_API_KEY = "sk_your_key_here"\n  - macOS/Linux: export ELEVENLABS_API_KEY="sk_your_key_here"\n  - Or add to .env file in your project root',
  };
}

function checkFfmpeg(): CheckResult {
  // Try bunx remotion ffmpeg first (recommended, cross-platform)
  try {
    const out = execSync("bunx remotion ffmpeg -version 2>&1", { timeout: 15000, encoding: "utf-8" });
    if (out.includes("ffmpeg version")) {
      return { name: "ffmpeg (via Remotion)", passed: true, message: "bunx remotion ffmpeg works" };
    }
  } catch {}

  // Try npx remotion ffmpeg
  try {
    const out = execSync("npx remotion ffmpeg -version 2>&1", { timeout: 15000, encoding: "utf-8" });
    if (out.includes("ffmpeg version")) {
      return { name: "ffmpeg (via Remotion)", passed: true, message: "npx remotion ffmpeg works" };
    }
  } catch {}

  // Try system ffmpeg
  try {
    const out = execSync("ffmpeg -version 2>&1", { timeout: 5000, encoding: "utf-8" });
    if (out.includes("ffmpeg version")) {
      return { name: "ffmpeg (system)", passed: true, message: "System ffmpeg found on PATH" };
    }
  } catch {}

  return {
    name: "ffmpeg",
    passed: false,
    message: "Not found",
    fix: 'Install Remotion (includes ffmpeg): npm install remotion @remotion/cli\nThen use: bunx remotion ffmpeg\n\nOr install system ffmpeg:\n  - Windows: winget install Gyan.FFmpeg\n  - macOS: brew install ffmpeg\n  - Linux: sudo apt install ffmpeg',
  };
}

function checkWhisper(): CheckResult {
  // Try whisper CLI
  try {
    execSync("whisper --help 2>&1", { timeout: 5000, encoding: "utf-8" });
    return { name: "Whisper", passed: true, message: "whisper CLI available" };
  } catch {}

  // Try Python whisper module
  try {
    execSync('python -c "import whisper; print(whisper.__version__)" 2>&1', { timeout: 5000, encoding: "utf-8" });
    return { name: "Whisper", passed: true, message: "Python whisper module available" };
  } catch {}

  // Try python3
  try {
    execSync('python3 -c "import whisper; print(whisper.__version__)" 2>&1', { timeout: 5000, encoding: "utf-8" });
    return { name: "Whisper", passed: true, message: "Python3 whisper module available" };
  } catch {}

  return {
    name: "Whisper",
    passed: false,
    message: "Not found (optional but recommended)",
    fix: "Install OpenAI Whisper for voiceover timing verification:\n  pip install openai-whisper\n\nThis is optional — you can manually verify timing without it.",
  };
}

// Run all checks
const results: CheckResult[] = [
  checkNodeVersion(),
  checkElevenLabsKey(),
  checkFfmpeg(),
  checkWhisper(),
];

console.log("\n=== Promo Video Skill — Preflight Check ===\n");

let allPassed = true;
let criticalFail = false;

for (const r of results) {
  const icon = r.passed ? "PASS" : "FAIL";
  console.log(`[${icon}] ${r.name}: ${r.message}`);
  if (!r.passed && r.fix) {
    console.log(`       Fix: ${r.fix.split("\n").join("\n       ")}`);
    allPassed = false;
    // Whisper is optional
    if (r.name !== "Whisper") criticalFail = true;
  }
}

console.log("");

if (allPassed) {
  console.log("All checks passed. Ready to create your promo video!\n");
} else if (criticalFail) {
  console.log("Some required checks failed. Fix the issues above before continuing.\n");
  process.exit(1);
} else {
  console.log("Optional checks failed (non-blocking). You can proceed.\n");
}
