# Quick Link illustrations — editorial v2

This set is archived. The active three-link navigation and its regenerated artwork are documented in [editorial v3](./quick-link-illustrations-v3.md).

Created on 2026-10-04 with OpenAI's built-in image generation tool, using the imagegen skill. These are original generated raster illustrations; third-party icons and illustrations were used only for visual research.

## Direction

Mature editorial pen-and-ink contour drawings, naturally proportioned subjects, deep sage `#48614c` with a muted clay `#90776e` accent, transparent backgrounds. The four subjects are manual shoulder therapy, a standing mobility stretch, pebbles with water ripples, and an appointment calendar. Display at 80px on desktop and 72px on mobile. Decorative images use empty alt text because each link already has a visible label.

The warm editorial typography and flat card treatment provide the visual context. Larger drawings, more breathing room, a fine directional arrow, and a visible keyboard focus state make the cards easier to discover. Motion respects reduced-motion preferences.

## Visual research

- [Noun Project — Manual therapy](https://thenounproject.com/icon/manual-therapy-5647115/): clear relationship between touch and care. The generated illustration uses shoulder therapy to fit rehabilitation.
- [Noun Project — Stretching](https://thenounproject.com/icon/stretching-8194338/): legible mobility posture at a small scale.
- [Michael Brown — Anew Selfcare](https://www.mbrown.work/work/anew-selfcare): restrained hand and body contour illustrations in a premium wellness identity.
- [YummyColours — This Place](https://www.yummycolours.com/work/this-place): organic line work and natural motifs used across a wellness identity.

Reference captures are stored in `.context/refs/quicklinks-*.png`. Reference artwork was not copied into production assets or supplied to image generation. The generated therapy image served as a style reference for the other three original images.

## Assets

Web assets are 512 × 512 WebP images with alpha, encoded from generated PNGs using Sharp. No recoloring, tracing, background removal, or creative post-processing.

- `public/images/quick-links/therapy-editorial-v2.webp`
- `public/images/quick-links/training-editorial-v2.webp`
- `public/images/quick-links/recovery-editorial-v2.webp`
- `public/images/quick-links/booking-editorial-v2.webp`

Original generated PNGs are preserved in `.context/imagegen/quick-links/`. The older PNGs and the previous SVG component are retained for comparison.

## Validation

- `npm run typecheck` passed.
- Browser layout inspected from 320px through 1440px: no horizontal overflow in the cards or page.
- All four production images decoded successfully at desktop, 390px and 320px; all four assets retain alpha.
- Link destinations match the previous section; a 2px visible keyboard focus outline and reduced-motion behavior were checked in the browser.
- Final captures: `.context/quicklinks-editorial-desktop.png`, `.context/quicklinks-editorial-mobile.png`, `.context/quicklinks-editorial-mobile-small.png`, and `.context/quicklinks-editorial-context-desktop.png`.

## Exact prompts

### Therapy

```text
Use case: stylized-concept.
Asset type: an original transparent small editorial spot illustration for HolisticVN, an adult physiotherapy and rehabilitation clinic website.
Primary request: create ONE refined hand-drawn line illustration representing manual neck and shoulder therapy. Draw an adult patient's head, neck and upper shoulders seen from the back in slight three-quarter view, with one anatomically natural practitioner's hand resting gently on the upper trapezius. Only this cropped composition, no full scene.
Style/medium: mature editorial pen-and-ink contour illustration, elegant loose but controlled organic curves, sparing selective interior contour details, natural adult anatomical proportions. A premium wellness journal drawing, understated, human, sophisticated. Crisp medium-fine single strokes, not an outlined cartoon icon, not a photorealistic image. Very subtle pencil character in the line, NOT fuzzy or rough.
Color palette: deep muted sage #48614C for all primary contour lines, muted clay #90776E for one small secondary accent contour. Almost entirely line art; transparent interior spaces, no filled silhouette. NO large color washes.
Composition: square 1024x1024 canvas; the drawing centered occupying approximately 76% of canvas width and height, ample equal transparent margins, open organic silhouette. This will be displayed at 80 CSS pixels; favor a few expressive, readily legible contours over fine hatching.
Background: genuinely fully transparent alpha, no background or vignette, no ground shadow.
Constraints: exactly one coherent illustration, no lettering, no text, no numbers, no logo, no border, no framing circle or disk, no watermark. Do not reproduce any existing icon. Anatomically plausible hand with five fingers.
Avoid: heart symbols, lotus motifs, cute characters, smiling cartoon face, stick figures, round geometric heads, thick uniform UI icon outlines, 3D embossing, plastic, clay render, gradients, drop shadows, busy decorative foliage, crosshatching.
```

### Training

```text
Use case: stylized-concept.
Asset type: ONE original transparent editorial spot illustration for an adult physiotherapy and rehabilitation clinic website, displayed at 80 CSS pixels.
Input image: Image 1 is a STYLE REFERENCE ONLY, the manual-therapy illustration already made for this same set. Create a different subject, preserve its hand-drawn muted-sage contour language, balanced scale, elegance and clay secondary accent. Do not depict the therapy subject again.
Style: mature editorial pen-and-ink line art, controlled organic curves, natural proportions, restrained selective detail, premium wellness journal. Main contour lines must stay easily visible at small size, about 3-4px at 1024px canvas. Mostly empty transparent interiors. Less detail than the reference's hair, clean readable silhouettes. No crosshatching. No large color washes or filled areas.
Palette: deep muted sage #48614C primary contour strokes, muted clay #90776E one secondary accent contour. No other colors.
Composition: square canvas, illustration centered, occupies 76% width/height with balanced transparent margins, one subject only.
Background: genuine transparent alpha, no opaque backdrop, no vignette or ground shadow.
Constraints: original illustration, no text, no numbers, no logos or watermark, no panels, no circular frame, no lettering.
Avoid: cartoon style, cute proportions, thick geometric app icons, hearts, lotus, flat colorful corporate illustrations, 3D, relief, embossing, gradients, shadows, excessive detail.
Subject: an adult doing a gentle standing side-body mobility stretch, seen from front in slight three-quarter profile. One arm reaches overhead in an arc, torso gently bends to the side, the other hand rests near the hip, feet planted on a single short clay contour line suggesting a mat. Full body, natural human proportions, simple neutral exercise clothes, very spare facial features and hair contours. Only one person, exactly two arms and two legs, correct plausible joint positions. Capture controlled movement, physiotherapy mobility rather than bodybuilder fitness.
```

### Recovery

```text
Use case: stylized-concept.
Asset type: ONE original transparent editorial spot illustration for an adult physiotherapy and rehabilitation clinic website, displayed at 80 CSS pixels.
Input image: Image 1 is a STYLE REFERENCE ONLY, the manual-therapy illustration already made for this same set. Create a different subject, preserve its hand-drawn muted-sage contour language, balanced scale, elegance and clay secondary accent. Do not depict the therapy subject again.
Style: mature editorial pen-and-ink line art, controlled organic curves, natural proportions, restrained selective detail, premium wellness journal. Main contour lines must stay easily visible at small size, about 3-4px at 1024px canvas. Mostly empty transparent interiors. Less detail than the reference's hair, clean readable silhouettes. No crosshatching. No large color washes or filled areas.
Palette: deep muted sage #48614C primary contour strokes, muted clay #90776E one secondary accent contour. No other colors.
Composition: square canvas, illustration centered, occupies 76% width/height with balanced transparent margins, one subject only.
Background: genuine transparent alpha, no opaque backdrop, no vignette or ground shadow.
Constraints: original illustration, no text, no numbers, no logos or watermark, no panels, no circular frame, no lettering.
Avoid: cartoon style, cute proportions, thick geometric app icons, hearts, lotus, flat colorful corporate illustrations, 3D, relief, embossing, gradients, shadows, excessive detail.
Subject: three smooth naturally asymmetric pebbles in a low balanced stack just above three spacious elliptical water-ripple contour arcs. Simple refined natural stones, each outlined only, subtle single internal contour for volume. Clay for the calm water ripples, sage for stones. About 8-12 deliberate flowing lines total. No plant, no person, no lotus, no sun, no stars, no spa towel. Focus on restoration, calm and balance with an organic mature sketch character.
```

### Booking

```text
Use case: stylized-concept.
Asset type: ONE original transparent editorial spot illustration for an adult physiotherapy and rehabilitation clinic website, displayed at 80 CSS pixels.
Input image: Image 1 is a STYLE REFERENCE ONLY, the manual-therapy illustration already made for this same set. Create a different subject, preserve its hand-drawn muted-sage contour language, balanced scale, elegance and clay secondary accent. Do not depict the therapy subject again.
Style: mature editorial pen-and-ink line art, controlled organic curves, natural proportions, restrained selective detail, premium wellness journal. Main contour lines must stay easily visible at small size, about 3-4px at 1024px canvas. Mostly empty transparent interiors. Less detail than the reference's hair, clean readable silhouettes. No crosshatching. No large color washes or filled areas.
Palette: deep muted sage #48614C primary contour strokes, muted clay #90776E one secondary accent contour. No other colors.
Composition: square canvas, illustration centered, occupies 76% width/height with balanced transparent margins, one subject only.
Background: genuine transparent alpha, no opaque backdrop, no vignette or ground shadow.
Constraints: original illustration, no text, no numbers, no logos or watermark, no panels, no circular frame, no lettering.
Avoid: cartoon style, cute proportions, thick geometric app icons, hearts, lotus, flat colorful corporate illustrations, 3D, relief, embossing, gradients, shadows, excessive detail.
Subject: a small upright desk appointment calendar in a slight three-quarter view, two simple binding loops at the top, a few sparse tiny grid marks, a modest thin checkmark in a single date square, and one small olive sprig with just three leaves tucked beside its bottom right corner. Hand-drawn editorial contours, lightly imperfect lines, natural restrained composition. The sprig contour is clay, calendar primary contour is sage. All interiors transparent. No written dates, no numerals, no heart, no large check badge, no circle around check, no rounded app-icon frame. Keep this a refined drawn object rather than an off-the-shelf glyph.
```
