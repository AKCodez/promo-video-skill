/**
 * Timing Calculator — compute exact TransitionSeries duration.
 *
 * TransitionSeries overlaps scenes during transitions. The effective duration
 * is NOT the sum of scene durations.
 *
 * Formula: effective = sum(sceneDurations) - (numTransitions × transitionDuration)
 *
 * Usage:
 *   npx tsx timing-calculator.ts --scenes "120,90,60,90,90" --transition 12 --fps 30
 *   npx tsx timing-calculator.ts --scenes "120,90,60,90,90" --transition 12 --fps 30 --target 60
 *
 * Options:
 *   --scenes       Comma-separated scene durations in frames (required)
 *   --transition   Transition duration in frames (default: 12)
 *   --fps          Frames per second (default: 30)
 *   --target       Target duration in seconds (optional, shows diff)
 *   --hard-cuts    Comma-separated indices where there's no transition (e.g., "1,5")
 */

import { argv } from "node:process";

const args = argv.slice(2);

let scenesStr = "";
let transitionDuration = 12;
let fps = 30;
let targetSeconds = 0;
let hardCutsStr = "";

for (let i = 0; i < args.length; i++) {
  if (args[i] === "--scenes" && args[i + 1]) scenesStr = args[++i];
  else if (args[i] === "--transition" && args[i + 1]) transitionDuration = parseInt(args[++i], 10);
  else if (args[i] === "--fps" && args[i + 1]) fps = parseInt(args[++i], 10);
  else if (args[i] === "--target" && args[i + 1]) targetSeconds = parseFloat(args[++i]);
  else if (args[i] === "--hard-cuts" && args[i + 1]) hardCutsStr = args[++i];
}

if (!scenesStr) {
  console.log("Usage: npx tsx timing-calculator.ts --scenes \"120,90,60,90\" --transition 12 --fps 30");
  console.log("\nOptions:");
  console.log("  --scenes       Comma-separated scene durations in frames (required)");
  console.log("  --transition   Transition duration in frames (default: 12)");
  console.log("  --fps          Frames per second (default: 30)");
  console.log("  --target       Target duration in seconds (shows diff)");
  console.log('  --hard-cuts    Scene indices with no transition after (e.g., "1,5")');
  process.exit(0);
}

const scenes = scenesStr.split(",").map((s) => parseInt(s.trim(), 10));
const hardCuts = new Set(hardCutsStr ? hardCutsStr.split(",").map((s) => parseInt(s.trim(), 10)) : []);

// Validate
for (let i = 0; i < scenes.length; i++) {
  if (isNaN(scenes[i]) || scenes[i] <= 0) {
    console.error(`Invalid scene duration at index ${i}: "${scenesStr.split(",")[i]}"`);
    process.exit(1);
  }
}

// Count transitions (one between each pair of scenes, minus hard cuts)
let numTransitions = 0;
for (let i = 0; i < scenes.length - 1; i++) {
  if (!hardCuts.has(i)) numTransitions++;
}

const sumFrames = scenes.reduce((a, b) => a + b, 0);
const overlapFrames = numTransitions * transitionDuration;
const effectiveFrames = sumFrames - overlapFrames;
const effectiveSeconds = effectiveFrames / fps;

console.log("\n=== TransitionSeries Duration Calculator ===\n");
console.log(`Scenes: ${scenes.length}`);
console.log(`Scene durations (frames): ${scenes.join(", ")}`);
console.log(`Transition duration: ${transitionDuration} frames (${(transitionDuration / fps).toFixed(2)}s)`);
console.log(`Hard cuts (no transition): ${hardCuts.size > 0 ? [...hardCuts].join(", ") : "none"}`);
console.log(`Transitions: ${numTransitions}`);
console.log(`FPS: ${fps}`);
console.log("");
console.log(`Sum of scene durations: ${sumFrames} frames (${(sumFrames / fps).toFixed(1)}s)`);
console.log(`Transition overlap:     -${overlapFrames} frames (${numTransitions} x ${transitionDuration})`);
console.log(`────────────────────────────────────────`);
console.log(`Effective duration:      ${effectiveFrames} frames (${effectiveSeconds.toFixed(1)}s)`);
console.log("");

if (targetSeconds > 0) {
  const diff = effectiveSeconds - targetSeconds;
  const diffFrames = Math.round(diff * fps);
  if (Math.abs(diff) < 0.5) {
    console.log(`Target: ${targetSeconds}s — MATCH (within 0.5s)`);
  } else if (diff > 0) {
    console.log(`Target: ${targetSeconds}s — ${diff.toFixed(1)}s OVER (${diffFrames} frames too many)`);
    console.log(`  Suggestion: Remove ${diffFrames} frames total across scenes`);
  } else {
    console.log(`Target: ${targetSeconds}s — ${Math.abs(diff).toFixed(1)}s UNDER (${Math.abs(diffFrames)} frames short)`);
    console.log(`  Suggestion: Add ${Math.abs(diffFrames)} frames total across scenes`);
  }
  console.log("");
}

// Scene-by-scene timeline
console.log("Scene Timeline:");
console.log("─────────────────────────────────────────────────");
let currentFrame = 0;
for (let i = 0; i < scenes.length; i++) {
  const startSec = (currentFrame / fps).toFixed(1);
  const endFrame = currentFrame + scenes[i];
  const endSec = (endFrame / fps).toFixed(1);
  console.log(`  Scene ${String(i + 1).padStart(2)}: ${startSec.padStart(5)}s → ${endSec.padStart(5)}s  (${scenes[i]} frames = ${(scenes[i] / fps).toFixed(1)}s)`);

  // Advance by scene duration minus transition overlap (if not last scene and not hard cut)
  if (i < scenes.length - 1 && !hardCuts.has(i)) {
    currentFrame += scenes[i] - transitionDuration;
  } else {
    currentFrame += scenes[i];
  }
}
console.log("");

// Output for Root.tsx
console.log(`Use in Root.tsx: durationInFrames={${effectiveFrames}}`);
console.log("");
