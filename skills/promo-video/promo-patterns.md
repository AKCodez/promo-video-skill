# Visual Inspiration & Techniques

Ideas and techniques for creating premium promo videos. **These are suggestions, not templates.** Let your creative instincts lead.

---

## Animation Toolkit

### Spring Physics
Play with these parameters for different feels:
- `damping: 8-12` → bouncy, playful
- `damping: 15-20` → smooth, professional
- `damping: 25+` → snappy, minimal overshoot
- `mass: 0.5` → lighter, faster
- `mass: 1.5` → heavier, more momentum
- `damping: 200` → no overshoot, smooth glide (good for UI elements)

### Timing Curves
- **Staggered reveals**: Delay each element by 10-20 frames for cascading effect
- **Anticipation**: Small backward motion before forward (scale 0.95 → 1.1 → 1)
- **Overshoot**: Go past target, settle back (translateY: 50 → -10 → 0)
- **Ease-out emphasis**: Quick start, slow finish draws attention

### 3D Transforms
```
transform: `perspective(1000px) rotateY(${angle}deg) rotateX(${tilt}deg)`
```
- Perspective 800-1200px for subtle depth
- Perspective 400-600px for dramatic angles
- Combine with translateZ for parallax layers
- **Never use 3D transforms in transitions** — only for in-scene elements

---

## Transition Ideas

**Metallic Swoosh Wipe**
- See [metallic-swoosh.md](metallic-swoosh.md) for implementation
- Diagonal gradient sweep with chrome reflection effect
- Best at 0.4s (12 frames at 30fps)
- Do NOT use clipPath — use crossfade + shine overlay

**Zoom Through**
- Camera pushes through current scene
- Scale up rapidly (1 → 3) with fade
- New scene scales down from large (3 → 1)
- Use `interpolate()` with `Easing.out(Easing.cubic)` for deceleration

**Fade**
- Simple crossfade using `@remotion/transitions/fade`
- Most reliable, works at any speed
- Use when you don't want the transition to be noticed

**Slide from Direction**
- Content slides out, new content slides in
- Use `@remotion/transitions/slide` with direction parameter
- Add subtle opacity fade during motion for polish

---

## Visual Elements

### Browser Mockups
Create a convincing browser window with CSS:
```tsx
const BrowserMockup: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{
    borderRadius: 12,
    overflow: "hidden",
    boxShadow: "0 25px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.1)",
    transform: "perspective(1000px) rotateY(-5deg) rotateX(3deg)",
  }}>
    {/* Browser chrome bar */}
    <div style={{
      height: 40,
      background: "#2a2a2a",
      display: "flex",
      alignItems: "center",
      padding: "0 16px",
      gap: 8,
    }}>
      <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ff5f57" }} />
      <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#febc2e" }} />
      <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#28c840" }} />
    </div>
    {/* Content */}
    <div style={{ background: "#1a1a2e", padding: 40 }}>
      {children}
    </div>
  </div>
);
```

**Styles:**
- **Floating**: Dramatic shadow, slight rotation (2-5deg)
- **Perspective**: rotateX(5deg) rotateY(-10deg) for 3D tilt
- **Animated cursor**: Show clicks and interactions
- **Screen glow**: Soft colored light behind the browser

### Stat Presentations
- **Counter animation**: Interpolate from 0 to final value, display as formatted number
- **Circle fill**: SVG circle with animated `strokeDashoffset`
- **Bar chart**: Animated width/height growth
- **Number pulse**: Scale up briefly (1.2x) on reveal, settle to 1x

### Text Reveals
- **Word-by-word**: Map words, show each with staggered delay
- **Typewriter**: Character by character with cursor blink
- **Clip reveal**: Text slides out from behind a mask div
- **Blur to sharp**: Animate `filter: blur()` from 10px to 0
- **Scale from baseline**: Start small (0.8), spring to 1.0

### Background Effects
- **Gradient animation**: Slowly shift hue using interpolated gradient stops
- **Floating particles**: Small dots with randomized sine wave motion
- **Grid pattern**: Subtle grid lines with perspective transform
- **Noise texture**: Very subtle (2-5% opacity) grain overlay
- **Radial glow**: Colored radial gradient behind main content

---

## Scene Concepts

### Opening Hook
- Start with the pain, not the product
- Big stat that stops scrolling
- Question that hits home
- Dark/urgent colors for problems
- Quick cuts (2-3s scenes) for energy

### Product Reveal
- Build anticipation with a pause (silence scene)
- Logo animation with spring physics
- Color shift from problem palette (red/orange) to solution palette (brand colors)
- Scale up from small to large for impact

### Feature Showcase
- Show the UI, not just describe it
- Browser mockup with 3D perspective
- Highlight interactions with animated cursor/focus ring
- One hero element per scene — don't animate everything at once
- Use staggered reveals for lists (each item 5-10 frames apart)

### Scanning/Detection Effect
For products that analyze or detect content:
```tsx
// Horizontal scan line sweeping top to bottom
const scanY = interpolate(frame, [0, durationInFrames], [0, 100]);
<div style={{
  position: "absolute",
  left: 0, right: 0,
  top: `${scanY}%`,
  height: 3,
  background: "linear-gradient(90deg, transparent, cyan, transparent)",
  boxShadow: "0 0 20px cyan, 0 0 60px cyan",
}} />
```

### Stats/Social Proof
- Large numbers with counter animation
- User avatars in a grid or row
- Star ratings with staggered fill
- Testimonial quotes with attribution

### Closing CTA
- Clear single action — one URL, one button
- Urgency without desperation
- Reinforce brand identity (logo + colors)
- Leave URL visible for at least 3 seconds

---

## Color Psychology

**Problems/Pain**: Red (#dc2626), Orange (#ea580c), Dark grays
**Solutions/Benefits**: Blue (#3b82f6), Green (#22c55e), Purple (#8b5cf6)
**Urgency**: Amber (#f59e0b), Red accents
**Trust**: Blue (#3b82f6), Navy (#1e3a5a)
**Premium**: Deep purple (#7c3aed), Gold accents (#fbbf24)

---

## Things That Pop

- Unexpected motion direction (element enters from an unusual angle)
- Pause before big reveal (1-2 seconds of silence/stillness)
- Scale changes (tiny to big, big to tiny)
- Depth through layered parallax (background moves slower than foreground)
- Consistent motion language throughout (same spring config for similar elements)
- One "hero moment" per scene, not everything moving at once
- Color contrast (bright element on dark background)
- Sound-visual sync (animation lands on beat)

---

## Technical Notes

**Performance**
- Keep transforms on GPU (transform, opacity, filter)
- Avoid animating width/height (use scale instead)
- Use `will-change: transform` sparingly
- Pre-compose complex scenes as separate compositions

**Readability**
- 60-100px minimum for headlines at 1080p
- High contrast text/background (test with squint test)
- Don't animate text people need to read — let it appear and stay
- White text with subtle text-shadow on dark backgrounds

**Timing**
- 2-4 seconds per scene (optimal for engagement)
- 0.4s transitions feel snappy; 0.7s feel smooth; 1.2s feel cinematic
- Match voiceover rhythm, not just timestamps
- Front-load energy — first 3-5 seconds decide if someone keeps watching
