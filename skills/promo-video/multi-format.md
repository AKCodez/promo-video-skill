# Multi-Format Video Architecture

Build one set of scenes that works in both 16:9 (1920x1080) landscape and 9:16 (1080x1920) portrait formats.

---

## The LayoutContext Pattern

Create a context provider that tells scenes which format they're rendering in:

```tsx
// src/LayoutContext.tsx
import React, { createContext, useContext } from "react";

interface LayoutInfo {
  width: number;
  height: number;
  isPortrait: boolean;
  /** Padding from edges — larger in portrait to avoid phone notches */
  padding: number;
  /** Scale factor for font sizes — portrait needs larger text */
  fontScale: number;
}

const LayoutContext = createContext<LayoutInfo>({
  width: 1920,
  height: 1080,
  isPortrait: false,
  padding: 80,
  fontScale: 1,
});

export const useLayout = () => useContext(LayoutContext);

export const LayoutProvider: React.FC<{
  width: number;
  height: number;
  children: React.ReactNode;
}> = ({ width, height, children }) => {
  const isPortrait = height > width;
  return (
    <LayoutContext.Provider
      value={{
        width,
        height,
        isPortrait,
        padding: isPortrait ? 60 : 80,
        fontScale: isPortrait ? 1.1 : 1,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
};
```

---

## Composition Setup

Both compositions use the same scenes, wrapped in different LayoutProviders:

```tsx
// src/Composition.tsx (Landscape)
import { LayoutProvider } from "./LayoutContext";
// ... scene imports ...

export const MyComposition: React.FC = () => (
  <LayoutProvider width={1920} height={1080}>
    <TransitionSeries>
      {/* scenes */}
    </TransitionSeries>
  </LayoutProvider>
);

// src/CompositionPortrait.tsx (Portrait)
import { LayoutProvider } from "./LayoutContext";
// ... same scene imports ...

export const MyCompositionPortrait: React.FC = () => (
  <LayoutProvider width={1080} height={1920}>
    <TransitionSeries>
      {/* same scenes */}
    </TransitionSeries>
  </LayoutProvider>
);
```

Register both in Root.tsx:

```tsx
// src/Root.tsx
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
```

**Composition ID rules:** Use hyphens only — underscores in IDs cause render failures.

---

## Responsive Scene Patterns

### Text + Image Side-by-Side → Stacked

The most common pattern: text on one side, image on the other in landscape, stacked vertically in portrait.

```tsx
import { useLayout } from "../LayoutContext";

export const FeatureScene: React.FC = () => {
  const { isPortrait, padding, fontScale } = useLayout();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: isPortrait ? "column" : "row",
        alignItems: "center",
        justifyContent: "center",
        gap: isPortrait ? 40 : 80,
        padding,
        width: "100%",
        height: "100%",
      }}
    >
      {/* Text block */}
      <div style={{ flex: isPortrait ? "none" : 1, textAlign: isPortrait ? "center" : "left" }}>
        <h2 style={{ fontSize: 64 * fontScale }}>Feature Name</h2>
        <p style={{ fontSize: 32 * fontScale }}>Description text here</p>
      </div>

      {/* Image/mockup */}
      <div style={{ flex: isPortrait ? "none" : 1, width: isPortrait ? "90%" : "auto" }}>
        {/* Browser mockup or screenshot */}
      </div>
    </div>
  );
};
```

### Stats Grid → Stats Stack

```tsx
const { isPortrait, fontScale } = useLayout();

<div
  style={{
    display: "grid",
    gridTemplateColumns: isPortrait ? "1fr" : "repeat(3, 1fr)",
    gap: isPortrait ? 30 : 60,
    width: "100%",
    padding: isPortrait ? "40px 60px" : "60px 100px",
  }}
>
  <StatCard value="99.2%" label="Accuracy" fontSize={48 * fontScale} />
  <StatCard value="<2s" label="Response Time" fontSize={48 * fontScale} />
  <StatCard value="50K+" label="Users" fontSize={48 * fontScale} />
</div>
```

### Browser Mockup Sizing

```tsx
const { isPortrait, width } = useLayout();

const mockupWidth = isPortrait ? width * 0.85 : width * 0.55;
const mockupTransform = isPortrait
  ? "perspective(800px) rotateX(5deg)"           // Slight tilt only
  : "perspective(1000px) rotateY(-8deg) rotateX(3deg)";  // Dramatic 3D
```

### Full-Screen Text (Headlines, CTA)

```tsx
const { isPortrait, fontScale, padding } = useLayout();

<div
  style={{
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: isPortrait ? `${padding}px ${padding}px` : `${padding}px ${padding * 2}px`,
  }}
>
  <h1 style={{ fontSize: (isPortrait ? 72 : 80) * fontScale }}>
    Big Headline
  </h1>
  <p style={{ fontSize: (isPortrait ? 36 : 40) * fontScale, maxWidth: isPortrait ? "90%" : "70%" }}>
    Supporting text that wraps nicely in both formats
  </p>
</div>
```

---

## Font Size Reference

| Element | Landscape | Portrait |
|---------|-----------|----------|
| Main headline | 72-90px | 64-80px |
| Section title | 56-72px | 52-64px |
| Feature title | 48-60px | 44-56px |
| Body text | 32-40px | 28-36px |
| Caption / label | 24-28px | 22-26px |
| Stat number | 64-96px | 56-80px |

Portrait text should be slightly smaller per-element because the frame is narrower, but `fontScale` (1.1x) compensates to keep it readable on phones.

---

## Layout Direction Cheat Sheet

| Landscape Layout | Portrait Adaptation |
|-----------------|---------------------|
| `flexDirection: "row"` | `flexDirection: "column"` |
| `gridTemplateColumns: "1fr 1fr"` | `gridTemplateColumns: "1fr"` |
| Side-by-side panels | Stacked panels |
| 3-column grid | 1-column list or 2-column grid |
| Browser mockup at 55% width | Browser mockup at 85% width |
| Horizontal icon row | Vertical icon list or 2x2 grid |
| 80-100px padding | 40-60px padding |

---

## Common Mistakes

1. **Same font sizes in both formats** — Portrait on a phone screen needs different sizing than landscape on a monitor. Use `fontScale`.

2. **Side-by-side layouts in portrait** — Two columns in 1080px width means each column is only 540px. Stack vertically instead.

3. **Tiny browser mockups in portrait** — A mockup at 55% width in portrait is only ~594px. Scale to 85%+ of width.

4. **Same padding in both** — 100px padding in landscape is fine. In portrait's narrower frame, use 40-60px.

5. **Horizontal lists of 4+ items** — In landscape, 4 items in a row works. In portrait, use a 2x2 grid or vertical list.

---

## Alternative: Separate Scene Files

If layouts are too different to share, you can create separate scene directories:

```
src/
  scenes/           # Landscape scenes
  scenes-portrait/  # Portrait scenes
```

This is simpler to reason about but means maintaining two copies of every scene. Use this approach when:
- The layouts are fundamentally different (not just rearranged)
- You have many custom animations that would need `isPortrait` checks everywhere
- You're short on time and want to copy-paste-adjust

The LayoutContext approach is better for maintainability. The separate-files approach is faster to implement.
