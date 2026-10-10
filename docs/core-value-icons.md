# Homepage core-value icons

Created on 2026-10-09 with OpenAI's built-in image generation tool (imagegen skill), at the owner's request to replace the small circled glyphs. Original symbolic artwork; no external icon library or copied artwork.

## Set and integration

| Value      | Asset                                         | Symbol                          |
| ---------- | --------------------------------------------- | ------------------------------- |
| Toàn diện  | `public/images/pillars/whole.webp`            | Hands supporting a person       |
| Xuyên suốt | `public/images/pillars/thread-linked-v2.webp` | Three interlocking chain links  |
| Bền vững   | `public/images/pillars/root.webp`             | Plant with a stable root system |

Muted sage `#48614C` and clay `#90776E`, sparse organic contours, transparent background, no outer circle. Direction follows the site's existing editorial illustrations, with fewer details and stronger strokes for small sizes. The figures are conceptual, not clinic staff portraits or clinical evidence.

Original PNGs are preserved in `.context/imagegen/pillars/`. Production WebP assets are 256×256 with alpha preserved. Sharp only resizes and encodes the generated originals. Rendered through `next/image` at 56px desktop and 48px at widths up to 980px; width/height reserve layout space. Decorative empty alt text; visible headings and descriptions convey the meaning.

Each list item has an icon beside its heading and a full-width paragraph below. Three columns above 700px, three rows below. No extra client JavaScript, animation, or new interactive controls.

## Inspection

- Local homepage inspected at 1440px, 768px, 390px, and 320px. All three icons loaded, with empty alt text and the intended 56px/48px dimensions. Document width matched each viewport.
- Desktop and mobile screenshots: `.context/imagegen/pillars/section-{1440,768,390,320}.png`; icon-row preview: `.context/imagegen/pillars/icons-preview.png`.
- Scoped ESLint (`app/page.tsx`), TypeScript, and Impeccable's target scan passed. No automated tests or production build were run for this asset change.

## Xuyên suốt revision — linked v2

The owner requested another icon for Xuyên suốt on 2026-10-09. Replaced the winding path with three interlocking oval links to express continuity between assessment, therapy, and training. Generated with the built-in tool, then refined once to reduce stroke thickness to match the other two icons. Original path asset and prompt are retained as history; the active file is `thread-linked-v2.webp` (256×256 transparent WebP). Final PNG: `.context/imagegen/pillars/thread-linked-v2.png`.

### Subject replacement prompt

```text
Edit the supplied transparent Holistic website icon. Replace the winding road and its waypoints with THREE clearly interlocking elongated oval chain links, forming one compact diagonal chain from lower left to upper right. This represents continuous connected care: assessment, treatment and training. Use the supplied image only to match the palette and organic line character. Preserve transparent background, muted sage #48614C and muted clay #90776E, simple mature editorial pen drawing. First and last links sage; middle link clay, with correct over-under intersections so they visibly connect. Clean confident contour strokes, even visual weight, no fine internal details; each ring has a generous open transparent center. All three links occupy 85% of the square canvas and are easily recognizable at 48px. No road, waypoints, arrow, text, numbers, letters, border, enclosing circle, badge, shadow, metallic shine, gradient, 3D, photographic texture or background. One isolated icon, square, true alpha transparency.
```

### Stroke refinement prompt

```text
Refine this exact transparent chain icon. Keep exactly three interlocked diagonal oval links, the same composition, palette (sage outer links and clay middle link), correct over-under crossings and true transparent background. Change only the thickness and drawing character: make every link stroke approximately ONE THIRD of its current thickness, a delicate but clearly readable organic pen contour about 2% of total image width. Expand the transparent openings accordingly. Clean sparse editorial line art matching elegant botanical line icons; slight natural stroke variation, no sketch hatching. No additional objects, border, text, shadow, metallic effect, shading or background. Preserve the three-link symbol and occupy the same 85% of square canvas.
```

## Exact generation prompts — original set

### whole

```text
Create ONE original icon illustration for Holistic, an adult physiotherapy website. Square composition, isolated on actual transparent alpha. Refined editorial pen drawing: clean organic contours, slightly varied strong strokes, generous open interiors, no sketchy hatching. Primary muted sage #48614C, a few muted clay #90776E accents. Designed to remain clear at 64 CSS pixels: very few details, confident silhouette, main strokes about 3% of the subject width. Subject fills 85% of square with balanced margins. No text, letters, logos, watermark, background, shadow, outer circle, badge, gradient, medical cross or heart. Calm, mature and elegant. Meaning: whole-person care. Draw two gently cupped hands symmetrically supporting a single simple upright adult bust (head and shoulders), one complete compact emblem. Natural hands simplified to flowing contours with only essential finger lines; no facial details. Person and hands must read immediately as supportive care.
```

### thread — first version (replaced)

```text
Create ONE original icon illustration for Holistic, an adult physiotherapy website. Square composition, isolated on actual transparent alpha. Refined editorial pen drawing: clean organic contours, slightly varied strong strokes, generous open interiors, no sketchy hatching. Primary muted sage #48614C, a few muted clay #90776E accents. Designed to remain clear at 64 CSS pixels: very few details, confident silhouette, main strokes about 3% of the subject width. Subject fills 85% of square with balanced margins. No text, letters, logos, watermark, background, shadow, outer circle, badge, gradient, medical cross or heart. Calm, mature and elegant. Meaning: continuity throughout a care journey. Draw a single broad graceful S-shaped path rising diagonally from lower left to upper right, with three small solid rounded sage waypoints placed naturally along it. Two smooth contour strokes define the path with transparent interior, one short clay accent. No arrowheads, no branching, no landscape. Balanced compact icon, coherent elegant flowing movement.
```

### root

```text
Create ONE original icon illustration for Holistic, an adult physiotherapy website. Square composition, isolated on actual transparent alpha. Refined editorial pen drawing: clean organic contours, slightly varied strong strokes, generous open interiors, no sketchy hatching. Primary muted sage #48614C, a few muted clay #90776E accents. Designed to remain clear at 64 CSS pixels: very few details, confident silhouette, main strokes about 3% of the subject width. Subject fills 85% of square with balanced margins. No text, letters, logos, watermark, background, shadow, outer circle, badge, gradient, medical cross or heart. Calm, mature and elegant. Meaning: lasting strength and sustainable wellbeing. Draw a sturdy little plant with two broad leaves and an upright stem continuing into three clear branching roots beneath a short gently curved soil line. Sparse botanical contours, strong readable leaf shapes, minimal roots. One clay accent on the soil and roots. No pot, no intricate veins.
```
