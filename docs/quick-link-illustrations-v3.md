# Quick-link illustrations — editorial v3

Created on 2026-10-04 using the imagegen skill and OpenAI's built-in image generation tool. Original generated raster illustrations; reference websites informed the navigation composition, not copied artwork.

## Active set and destinations

| Link | Destination | Illustration |
| --- | --- | --- |
| Dịch vụ | `/services` | Adult supported mobility exercise with a specialist |
| Phương pháp | `/treatments` | Hands applying manual shoulder therapy |
| Về Holistic | `/about` | Three symbolic adults representing the people behind the clinic |

The group illustration is conceptual, not a portrait or claim about actual staff. The about page remains a story/philosophy page, reflected in its link label and description.

## Direction and integration

Transparent editorial pen-and-ink contours in sage `#48614C` and muted clay `#90776E`, natural adult proportions, no text or logos. The previous therapy illustration was a style reference for the first new asset; the new services illustration was the style reference for the other two.

PNG sources: `.context/imagegen/quick-links/{services,methods,about}-editorial-v3.png`.

Production assets: `public/images/quick-links/{services,methods,about}-editorial-v3.webp`, 512×512 with generated alpha preserved. Sharp only resizes and encodes the original outputs. Display at 72px desktop / 64px at widths up to 980px.

Layout: one cream navigation band, three equal columns above 980px and three horizontal rows below. Fine vertical/horizontal separators, Roboto Slab labels, Roboto Serif descriptions and directional arrows. The whole item is a semantic link. Artwork is decorative with empty alt text. Existing visible keyboard focus is preserved; reduced-motion disables the arrow animation.

## Research and decision

- [Legacy Holistic](https://www.holisticvn.com/): services, methods, team overview links. The new third label matches the current about page.
- [Menkind](https://menkind.co/haarverlies): restrained strip composition with fine separators, used only as layout inspiration.
- [Baba services](https://www.callbaba.com/services/): clear destination labels, short context and arrows.
- Detailed findings and evidence limitations: `.context/quicklinks-research/recommendation.md`.

## Visual inspection

- Homepage rendered in the existing dev server at desktop 1440px and mobile 390px; all three images loaded, with empty decorative alt text.
- Mobile document width is 390px, matching the viewport; the section uses three horizontal rows.
- Browser DOM shows the three labels and destinations listed above.
- Preview captures: `.context/quicklinks-three-desktop.png`, `.context/quicklinks-three-mobile.png`.
- An existing local preview script at `localhost:8400/live.js` reports a refused connection. No image load error was observed for the new artwork.
- No automated tests or typecheck were run for this change.

## Exact generation prompts

### services

```text
Use case: stylized-concept.
Asset type: ONE original transparent editorial spot illustration for the "Dịch vụ" navigation link of HolisticVN, an adult physiotherapy and rehabilitation clinic. This is the first of a coordinated THREE-illustration set displayed at 72 CSS pixels inside a cream editorial navigation strip.
Input image: the supplied illustration is STYLE REFERENCE ONLY. Preserve the sage and clay hand-drawn contour aesthetic, but use fewer cleaner, slightly stronger strokes so it reads at small size. Do not copy the reference subject.
Subject: a standing adult performing a gentle supported arm mobility exercise, with a rehabilitation specialist standing beside them and guiding the raised forearm. Show two naturally proportioned adults in simple plain exercise clothes, no uniforms or medical props. Calm collaborative body language. One clear small human scene with a readable silhouette.
Style/medium: mature editorial pen-and-ink drawing, elegant sparse organic contour lines with slight natural variation, mostly empty transparent interiors, very minimal facial and clothing detail. Adult wellness journal, no cartoon simplification. Main contours visibly stronger than tiny hair detail.
Palette: deep muted sage #48614C primary lines; muted clay #90776E a few secondary contour strokes only. No other colors, no broad filled shapes.
Composition: square, centered, subject occupies approximately 78% of the canvas height and width, balanced transparent margins. No background objects, no shadow, no surrounding shapes.
Background: genuinely transparent alpha, including inside the contour drawing.
Constraints: original drawing, no text, numbers, letters, logos, watermark, circular frame, panels, badges, crosshatching, gradients, 3D or photo. No anatomical detail, floating disembodied extra limbs, medical cross, hearts, lotus, cute people, geometric app glyphs.
```
