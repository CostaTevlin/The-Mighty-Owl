# The Mighty Owl — Redesign Plan

## Design Direction: Duolingo-Inspired Playful Utility

**Aesthetic**: Bright, bold, friendly — like Duolingo meets a smart home assistant. Chunky rounded shapes, vibrant green primary, thick borders/shadows that give a tactile "3D button" feel. The owl mascot theme ties everything together with personality.

**Memorable element**: Chunky 3D-style buttons with bottom borders (Duolingo's signature), owl-themed personality throughout, celebration animations on results.

**App name**: The Mighty Owl
**Tagline**: "Snap. Learn. Done."

---

## 1. Design Tokens (tailwind.config.mjs)

### Color Palette (Duolingo-inspired)
| Token | Value | Usage |
|-------|-------|-------|
| `owl-green` | `#58CC02` | Primary brand, CTA buttons, active states |
| `owl-green-dark` | `#46A302` | Button bottom-border (3D effect), hover |
| `owl-green-light` | `#D7FFB8` | Light green backgrounds, success states |
| `owl-blue` | `#1CB0F6` | Info, secondary actions, time estimates |
| `owl-blue-dark` | `#1899D6` | Blue button bottom-border |
| `owl-orange` | `#FF9600` | Warnings, attention, streaks |
| `owl-red` | `#FF4B4B` | Errors, safety tips, danger |
| `owl-red-dark` | `#EA2B2B` | Red button bottom-border |
| `owl-purple` | `#CE82FF` | Premium/special elements |
| `owl-bg` | `#FFFFFF` | Main background |
| `owl-bg-alt` | `#F7F7F7` | Section backgrounds, input bg |
| `owl-surface` | `#FFFFFF` | Cards |
| `owl-border` | `#E5E5E5` | Card borders, dividers |
| `owl-border-heavy` | `#CDCDCD` | Thick card bottom borders (3D depth) |
| `owl-text` | `#3C3C3C` | Primary text |
| `owl-text-muted` | `#777777` | Secondary text, labels |
| `owl-text-light` | `#AFAFAF` | Placeholder, disabled text |

### Typography
| Token | Value |
|-------|-------|
| Font family | `Nunito` (Duolingo's actual font — rounded, friendly, bold) |
| Import | `@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap')` |
| Heading weight | 800 (Extra Bold) |
| Body weight | 600 (Semi Bold) — Duolingo uses heavier body text |
| Label weight | 700 (Bold) |

### Border Radius (extra rounded, Duolingo-style)
| Token | Value | Usage |
|-------|-------|-------|
| `sm` | `8px` | Inputs, small elements |
| `md` | `12px` | Standard cards, buttons |
| `lg` | `16px` | Major cards, sections |
| `xl` | `20px` | Hero elements, modals |
| `2xl` | `24px` | Feature cards |
| `full` | `9999px` | Badges, pills, avatar |

### The Duolingo "3D Button" Effect
The signature Duolingo button has a thick colored bottom border that creates a raised/pressable look:
```css
/* Green CTA */
background: #58CC02;
border-bottom: 4px solid #46A302;
border-radius: 16px;
/* On :active → remove bottom border, add margin-top to simulate press */
```

### Shadows
- `card`: `0 2px 4px rgba(0,0,0,0.08)` — subtle card lift
- `button`: none (uses border-bottom trick instead)

---

## 2. Layout.astro Changes

- Import Nunito from Google Fonts (400, 600, 700, 800)
- Body: `bg-owl-bg text-owl-text font-nunito`
- Remove `* { transition: all 0.2s }` — too broad
- Add `.btn-press:active { transform: translateY(2px); border-bottom-width: 0; }` utility
- Add bounce/pop keyframes for celebrations
- Add `prefers-reduced-motion` media query
- Keep fadeIn, slideUp but make them bouncier (use spring easing)

---

## 3. Screen-by-Screen Redesign

### Screen 1: WelcomeScreen.astro
**Vibe**: Bright, inviting, playful — like opening Duolingo for the first time

- **Background**: White (`#FFFFFF`)
- **Top**: Owl mascot area — a large friendly owl SVG/illustration (can be a simple geometric owl icon made from SVG shapes, green-themed)
- **Title**: "The Mighty Owl" in Nunito 800, `owl-text` color, text-4xl
- **Tagline**: "Snap. Learn. Done." in Nunito 600, `owl-text-muted`, text-lg
- **Flow steps**: 3 rounded cards in a row, each with:
  - Colored circle icon bg (green, blue, orange)
  - Lucide SVG icon inside (Camera, Cpu, ListChecks)
  - Small label below
  - Connected by a dotted line between them
- **CTA**: Full-width Duolingo-style 3D green button: "GET STARTED" (uppercase Nunito 800)
  - `bg-owl-green`, `border-b-4 border-owl-green-dark`, `rounded-2xl`, `py-4`
  - Active: press-down effect
- **Footer text**: `owl-text-light`, text-sm
- **No gradient backgrounds** — Duolingo uses flat, clean whites

### Screen 2: CategorySelect.astro
**Vibe**: Clean selection grid, like Duolingo's lesson picker

- **Background**: White
- **Header**: Back arrow (ChevronLeft) + "Pick your appliance" (Nunito 800, text-2xl)
- **Grid**: 2x3 grid of category cards
  - White bg, `owl-border` border (2px), rounded-2xl
  - **Duolingo 3D card**: `border-b-4 border-owl-border-heavy`
  - Lucide SVG icon in a colored circle (each category gets a unique color):
    - Washing: `owl-blue` circle + Droplets icon
    - Oven: `owl-orange` circle + Flame icon
    - Coffee: `owl-purple` circle + Coffee icon
    - Dishwasher: `owl-blue` circle + GlassWater icon
    - Dryer: `owl-green` circle + Wind icon
    - Other: `owl-text-muted` circle + Wrench icon
  - Label in Nunito 700, `owl-text`
  - **Active/tap**: border turns green, press-down effect
  - **Touch target**: entire card is clickable, min 80px height
  - Gap: 12px

### Screen 3: PhotoCapture.astro
**Vibe**: Clean camera interface, encouraging

- **Background**: White
- **Header**: Back arrow + "Take a photo" (Nunito 800)
- **Viewfinder area**: Large rounded-2xl container, `owl-bg-alt` bg, dashed border `owl-border` 2px
  - Center: Camera icon (Lucide) in `owl-text-light` + "Tap to snap a photo" text
  - Aspect ratio: 4:3
- **Two buttons below viewfinder** (side by side):
  - "Camera" — Duolingo 3D blue button (`owl-blue` bg, `owl-blue-dark` border-b-4)
  - "Gallery" — White 3D button (white bg, `owl-border-heavy` border-b-4, `owl-text` text)
  - Both with Lucide icons
- **Preview state**: Image fills viewfinder (object-cover, rounded-2xl)
  - Two buttons below: "Use This Photo" (green 3D) + "Retake" (white 3D)
- **Helper text**: "Tip: Get a clear shot of the control panel" in `owl-text-muted`

### Screen 4: ContextInputs.astro
**Vibe**: Simple form, Duolingo lesson-like interactivity

- **Background**: White
- **Header**: Back arrow + category-specific title (e.g., "Washing Settings") in Nunito 800
- **Toggle chips** (Duolingo style):
  - Rounded-xl pills with border (2px `owl-border`)
  - **Duolingo 3D chip**: `border-b-3 border-owl-border-heavy`
  - **Active**: `bg-owl-green-light`, `border-owl-green`, `text-owl-green-dark`, border-b-3 `owl-green-dark`
  - **Inactive**: white bg, `owl-border`, `owl-text`
  - **On press**: press-down effect
  - Min height: 44px, px-5
  - Gap: 8px, flex-wrap
- **Text inputs**: `owl-bg-alt` bg, `owl-border` 2px border, rounded-xl, Nunito 600
  - Focus: `owl-green` border, green ring
  - Font-size: 16px
- **Field labels**: Nunito 700, `owl-text`, text-sm, uppercase, tracking-wide, mb-2
- **CTA**: Full-width green 3D button — "TEACH ME!" (Nunito 800, uppercase)

### Screen 5: LoadingState.astro
**Vibe**: Fun waiting experience, Duolingo-style encouragement

- **Background**: White
- **Center content**:
  - Animated owl icon: a simple SVG owl that bobs/bounces gently (like Duolingo's owl during loading)
  - Status text cycling: Nunito 700, `owl-text`, text-lg
    - "Spotting your appliance..."
    - "Reading the controls..."
    - "Analyzing the display..."
    - "Almost there..."
  - Progress bar: `owl-bg-alt` track (h-3, rounded-full), `owl-green` fill with animated shimmer
  - Fun sub-text: "The Mighty Owl is working on it!" in `owl-text-muted`

### Screen 6: ResultsScreen.astro
**Vibe**: Achievement screen — like completing a Duolingo lesson

- **Background**: White, with subtle green confetti burst animation at top on load
- **Header**: "Here's how!" (Nunito 800, text-3xl) + small celebratory icon
- **Model card**: White bg, green border-l-4, rounded-xl, border-b-4 `owl-border-heavy`
  - "Identified:" label in `owl-text-muted`
  - Model name in Nunito 800, `owl-text`, text-xl
  - Confidence badge: pill with bg color (green/orange/red) + white text
- **Time estimate card**: `owl-blue` bg (light), rounded-xl, p-4
  - Clock icon + time text in Nunito 700
- **Instruction steps**: Each step card:
  - White bg, rounded-xl, border 2px `owl-border`, border-b-4 `owl-border-heavy`
  - Left: green circle with white number (Nunito 800)
  - Right: step text in Nunito 600, `owl-text`
  - Staggered slide-up animation (80ms delay per step)
- **Safety tips card**: `owl-red` bg light (#FFF0F0), rounded-xl, border-l-4 `owl-red`
  - AlertTriangle icon + "Safety Tips" header
  - Each tip with red dot bullet
- **CTA**: "SCAN ANOTHER" green 3D button
- **Sub-text**: Muted disclaimer

---

## 4. The Owl Mascot (SVG)

Create a simple inline SVG owl that:
- Uses `owl-green` as primary color
- Has big round eyes (friendly, Duolingo-like)
- Is geometric/simple (not complex illustration)
- Sized at ~120x120px on welcome screen, ~80x80px on loading
- Can be animated (bounce, head-tilt on loading)

---

## 5. Icon Set (Lucide SVGs)

Replace ALL emojis with Lucide inline SVGs:

| Current Emoji | Lucide Icon | Color Circle |
|--------------|-------------|-------------|
| `📱` | `Camera` | `owl-green` |
| `🤖` | `Cpu` | `owl-blue` |
| `✨` | `ListChecks` | `owl-orange` |
| `🧺` | `Droplets` | `owl-blue` |
| `🍳` | `Flame` | `owl-orange` |
| `☕` | `Coffee` | `owl-purple` |
| `🍽️` | `GlassWater` | `owl-blue` |
| `👕` | `Wind` | `owl-green` |
| `🔧` | `Wrench` | `owl-text-muted` |
| `⏱️` | `Clock` | `owl-blue` |
| `⚠️` | `AlertTriangle` | `owl-red` |

All: 24x24 viewBox, stroke-width 2, currentColor.

---

## 6. Signature Animations

### Duolingo 3D Button Press
```css
.btn-3d {
  border-bottom: 4px solid var(--border-color);
  transition: all 100ms ease;
}
.btn-3d:active {
  border-bottom-width: 0;
  margin-top: 4px;
}
```

### Staggered Card Entrance
```css
.stagger-enter {
  animation: slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}
/* Delay set via style attribute: animation-delay: 0.08s * index */
```

### Owl Bounce (Loading)
```css
@keyframes owlBounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
```

### Confetti Burst (Results)
Simple CSS-only confetti using pseudo-elements or small colored dots that fade out.

### Progress Shimmer
```css
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(200%); }
}
```

---

## 7. Accessibility

- All buttons: min-h-[44px] min-w-[44px]
- Focus ring: 3px solid `owl-green`, 2px offset
- `prefers-reduced-motion`: disable all animations
- Form labels with `for` attribute
- ARIA labels on icon-only buttons
- Confidence uses color + text (not color alone)
- Semantic HTML: main, section, nav, heading hierarchy

---

## 8. Responsive Behavior

| Breakpoint | Behavior |
|------------|----------|
| < 375px | px-4, slightly smaller text |
| 375-767px | Default mobile layout, px-5, max-w-md centered |
| 768px+ | Centered at max-w-md, subtle pattern on sides |

---

## 9. Files to Modify

| Wave | File | Changes |
|------|------|---------|
| 1 | `tailwind.config.mjs` | All new color tokens, Nunito font, border-radius scale |
| 1 | `Layout.astro` | Nunito import, new body classes, animations, 3D button utility |
| 2 | `WelcomeScreen.astro` | Complete rewrite: white bg, owl mascot, green 3D CTA |
| 2 | `CategorySelect.astro` | Dark→white, emoji→SVG, 3D cards, colored icon circles |
| 2 | `PhotoCapture.astro` | White bg, viewfinder, blue/white 3D buttons |
| 2 | `ContextInputs.astro` | Green chip toggles, clean form, "TEACH ME!" CTA |
| 2 | `LoadingState.astro` | Bouncing owl, shimmer progress, fun text |
| 2 | `ResultsScreen.astro` | Achievement feel, 3D step cards, confetti, green accents |
| 3 | `index.astro` | Update JS class references for new token names |

---

## Pre-Delivery Checklist

- [ ] No emojis as icons (all Lucide SVG)
- [ ] All buttons have Duolingo 3D press effect
- [ ] Nunito font loads correctly (400, 600, 700, 800)
- [ ] Green (#58CC02) is dominant brand color throughout
- [ ] cursor-pointer on all clickable elements
- [ ] Hover/active states with smooth transitions
- [ ] Text contrast >= 4.5:1
- [ ] Focus states visible (green ring)
- [ ] prefers-reduced-motion respected
- [ ] Touch targets >= 44x44px
- [ ] Responsive at 375px and 768px+
- [ ] Owl mascot SVG renders correctly
- [ ] 3D button press-down works on mobile (`:active`)
- [ ] No horizontal scroll on mobile
