# Services AI illustrations

Approved for the `/services` page by the owner on 2026-11-26, after reviewing
Manual/Training/Recovery v2 and keeping Electro v1. These are AI illustrations,
not photographs of Holistic premises, staff, patients or equipment. At the owner’s subsequent request, visible AI captions were removed; alt text
describes the image content neutrally. Provenance remains documented here. Images do not establish clinical technique, protocol, device settings or
outcomes. No identifiable faces are shown.

## Production integration

Four landscape originals (1536×1024 PNG) were generated using the built-in image
generation tool. The selected versions were converted without resizing/cropping
to WebP with `cwebp -q 86`. Next Image supplies responsive versions; the first
service image is eager-loaded and subsequent images are lazy-loaded.

The route selects this owner-approved illustration set by service group. CMS
content/order/treatment links/booking still supply the page. CMS image fields and
shared image fallbacks are preserved for other consumers; this route intentionally
uses the approved local illustration instead of the CMS service image. The real
clinic photographs remain in `public/images`.

Image frames keep the page ratios: 3:2 desktop, 16:9 tablet (capped at 360px),
4:3 mobile. Centered cover crops retain the relevant action. Training may crop a
portion of the instructor at the left; tablet Recovery trims parts of the tub
rim. These are illustrations, not technical or whole-room photographs.

## Provenance and prompts

Local originals and full generation history are preserved in the gitignored
`.context/services-image-study/` folder. V2 used the listed local files as actual
image-generation references after visual inspection. Their original clinic and
fanpage provenance is recorded in PRODUCT.md. No live fanpage verification is
claimed for the revision. Electro v1 is a generic generated still life; it did not
use a reference image. Original source files are not overwritten.

### Manual

- Asset: `public/images/services/manual-ai-v2.webp` (216,976 bytes).
- References: Iastm.jpg, ManualTherapy.jpg, TreatmentBeds.jpg.
- Original PNG SHA-256: `c357a42405a3ba46924946197a9502c06779b10e48e8a21d79641faa38edc02d`.
- WebP SHA-256: `d163685c46be922fbf86a433a16f0badceaa41ef30c7075251a1b2496a057413`.

Successful generation prompt:

```text
Use case: photorealistic-natural. Create a NEW 3:2 landscape editorial medical rehabilitation illustration based on the three provided visual references. These show a rounded stainless soft-tissue tool and black clinical gloves, a prone treatment posture, and a functional dark brown vinyl treatment bed with a brown towel and white base. A modest clinical scene of an ordinary adult lying face down, fully dressed in loose dark athletic trousers and covered by a brown clinical towel over the torso, with ONLY a small upper shoulder-blade treatment area visible above the towel. Another adult caregiver in a plain grey-teal short-sleeve polo and black examination gloves stands at the bed side, using the smooth rounded-edge flat metal tool in gentle contact with that small shoulder-blade area as in reference Iastm, other gloved hand alongside. Both heads completely outside the frame, caregiver shoulders down only, no face or reflections. Medium shot focused on caregiver gloved hands, simple tool, towel and treatment bed, not intimate body framing. Matter-of-fact professional musculoskeletal rehabilitation, no nudity, no sexual context, no glamour, no blood, needles or invasive procedure. Do not add technical details or protocols that are not visible in the source. Natural ordinary indoor light and realistic brown vinyl/towel textures, plain room, no spa props or decor. Keep tool contact and hands centrally in the middle 65% of frame for 4:3 and 16:9 crop safety. Anatomically plausible hands, a simple distinct metal implement with rounded edges. No text or branding from the reference posters, no logos or watermark. New AI concept illustration, not an actual photograph of Holistic staff, patients or facilities.
```

### Electro

- Asset: `public/images/services/electro-ai-v1.webp` (108,050 bytes).
- References: General device concept; no claim to depict a clinic-owned device.
- Original PNG SHA-256: `c893109eef421f21cc7339841369e3c838decb906c58984f7500b02295735cf4`.
- WebP SHA-256: `eb2c6e416503f6041bf1ab47963e5fa656bc6ae12a8ba875b5fed3ade3610371`.

Successful generation prompt:

```text
Use case: photorealistic-natural. Asset type: standalone editorial healthcare still-life concept preview for a rehabilitation services page, not documentation of real Holistic equipment. Generate one landscape 3:2 photograph, ideally 1536x1024. At table height with a gentle three-quarter view, a compact generic off-white electrotherapy unit sits switched OFF on a pale oak trolley beside a neatly folded cream towel. Its small dark screen is completely blank; no numbers, labels, brands, model names or settings. A single tidy pair of insulated leads connects to two ordinary flat grey electrode pads resting UNUSED on the towel, no body or treatment application. Device and pads form a coherent compact centered grouping with believable simple construction. Include surrounding negative space and a soft out-of-focus cream wall and muted sage curtain; this is an anonymous tabletop study, not a staged replica of any clinic. Soft bright side daylight, restrained editorial photography with tactile realistic plastics, linen and wood. Neutral cream, sage and grey, no red illumination or dominant red. Keep all essential device parts and electrode pads in central 65% width and 65% height so centered 4:3 and 16:9 crops retain them. No people, no protocols or efficacy depiction, no readable text, no logos, no watermark, no needles, no branded product design.
```

### Training

- Asset: `public/images/services/training-ai-v2.webp` (168,146 bytes).
- References: Coaching.jpg, Studio.jpg, HeroBlog.jpg.
- Original PNG SHA-256: `af2832e7443a401d2041385415b4d28c67146e0590637935695e05b368eba369`.
- WebP SHA-256: `ffd8ab70181df1adce45cb65e64074aa0b152ddde9d7ecf16b9eb1734db867bc`.

Successful generation prompt:

```text
Use case: photorealistic-natural. Generate one NEW 3:2 landscape editorial rehab-and-performance concept image, ideally 1536x1024, based closely on attached visual references. Ref 1 Coaching supplies the actual visible movement and objects: adult in brown exercise clothes hinges forward, arms lowered holding two small round black dumbbells with metal handles, bare feet supported by two separate low black heel wedges on a grey mat, one-to-one guide crouched beside in muted teal clothes, close hand cue near wrist/knee. Ref 2 Studio and ref 3 HeroBlog supply functional gym context only: white metal rack uprights with adjustment holes, black weight plates and dark padded bench, black framed arched window, ordinary training floor. Create a new documentary-style medium-wide scene with these same visible movement relationships, not a new exercise or protocol: ordinary adult participant in plain brown T-shirt and knee-length shorts in a controlled shallow hip-hinge position holding a dumbbell in each hand, barefoot on two black wedge supports; guide in plain teal polo and charcoal trousers crouched alongside, one hand giving a precise nearby cue beside the participant's wrist, without extra limbs or hands fused together. Use grey mat and a softly defocused white rack and black plates behind them, practical room rather than beige yoga studio. Crop BOTH heads entirely out of the composition, even at top edge; no identifiable face or mirrors. Preserve ordinary body proportions, anatomically plausible back, knees, hands and feet. Keep weights, grip, knee cue and both feet within the central 75% width, between 20% and 80% of frame height, with breathing space for centered 4:3 and 16:9 crops. Plain dumbbell ends with NO weight numbers or brand, no signage or text, no logos or watermark, no needles, no outcome claims or intense athletic glamour. Neutral practical indoor daylight; do not replace the equipment and active coaching with spa decor. New AI illustration, not a documentary claim about actual Holistic people or a verified prescribed protocol.
```

### Recovery

- Asset: `public/images/services/recovery-ai-v2.webp` (341,312 bytes).
- References: ColdPlungeTub.jpg.
- Original PNG SHA-256: `c83a9f4833e2f37734f833de820b807eddc9370686dda8507b3dd16e55822af7`.
- WebP SHA-256: `5bb052883ad0c09070eff2d7dac3b1f4d97de603a794e83eead1ba484590d1eb`.

Successful generation prompt:

```text
Use case: photorealistic-natural. Generate one NEW 3:2 landscape editorial rehabilitation recovery illustration, ideally 1536x1024. The attached ColdPlungeTub photo is a visual reference for the actual type of equipment and materials, not an edit target and not proof of a new clinic photograph. Show a practical round cold-plunge tub from an elevated oblique angle, the bowl centered with the full pale cream rim visible, inner walls tiled with small cobalt blue, light blue and white square mosaic tiles closely informed by the reference. Clear cool water with a modest scattering of floating irregular ice pieces; a simple stainless handrail enters from the left rim as seen in the reference. Retain coherent circular tub geometry and consistent tiled inner wall, realistic transparent water and submerged tile refraction. Do NOT add the ambiguous brown round submerged object visible in the reference, whose function is unknown. No people or body parts. Tight enough on tub to avoid inventing a complete facility, but enough plain practical pale non-slip floor around it to allow crop flexibility. Keep entire principal rim within central 80% width and between 18% and 82% height so centered 4:3 and 16:9 crops retain blue mosaic, water and ice. Natural practical indoor lighting, honest material textures, clinical-sport recovery feel rather than spa, no candles, wood decking, towels still-life, bowls, drinking glasses, decorative plants, steam or luxury pool architecture. No device controls, temperature readings, duration, therapy promises, text, branding, logos or watermark. The blue mosaic tub is the main color and provides clear visual variety from electrotherapy equipment. This is a new AI illustrative concept inspired by a verified local source, not a photograph or exact architectural reconstruction of Holistic's facility.
```

## Verification

At 320/768/1440px all four group images loaded, captions appeared and no horizontal
page overflow was observed. Focused captures are saved locally as
`.context/services-approved-{training-320,recovery-768,manual-1440}.png`.
Responsively tablet preview was also inspected. Lint, typecheck, 544 tests and
production build passed. The original caption assertion was removed when the owner requested removing the captions. This verifies local integration, not deployed/CMS proof.
