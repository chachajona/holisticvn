# Contact page refresh

Implemented proposal for `/contact`, 2026-10-30. Related scope: [#12](https://github.com/chachajona/holisticvn/issues/12), [#14](https://github.com/chachajona/holisticvn/issues/14), [#33](https://github.com/chachajona/holisticvn/issues/33). GitHub remains the source of task status; this UI change does not complete the email delivery acceptance work.

## Awwwards MCP research

Used `search_sites`, `search_elements`, `create_design_brief`, `get_site_elements`, `capture_live_site` and `analyze_page_structure`.

- [Skin Health Alliance](https://www.awwwards.com/sites/skin-health-alliance-1), Honorable Mention: the cached **Forms** element shows a large photo beside a quiet, open contact form, serif headings, flat pale surfaces, simple rules, and a rounded submit action. This is the primary contact reference. Adapted the clear form hierarchy, photo/contact pairing and green structural headings; retained Holistic's labeled, bordered fields, rather than copying the reference's underline-only inputs.
- [Garoa Skincare](https://www.awwwards.com/sites/garoa-skincare), SOTD / Developer Award: cached visual evidence supports warm brown/cream, restrained editorial typography and large photo framing. These reinforce the existing Warm Clay system; the design keeps Holistic's own colors and fonts.
- Calmlyss and Roveia Health were also inspected through search screenshots. They were less useful for this contact task and did not determine its structure.

Evidence limits: component search returned no contact/form matches; site elements supplied the useful Forms image. Skin Health Alliance's live capture was obscured by its cookie consent dialog; Garoa's current domain is parked. Roveia's attempted `/contact` URL is a 404. These captures do not establish current contact layouts. The brief had no motion/timing evidence, and no new motion was implemented. The page is an original adaptation, not a reproduction of either site's full-page section map.

## Implemented direction

- Standalone mono section marker with a trailing hairline.
- Two-column contact area: a shorter two-line heading and three full-row direct contact links; a linen callback form on the right. Mobile stacks in DOM reading order.
- Heading: “Bắt đầu từ một cuộc trò chuyện.” The form heading explains the callback, and its button says “Gửi lời nhắn”. No response-time or outcome promise was added.
- Separate visit band: real clinic entrance photo, approved address, Google Maps link and opening hours. No third-party map embed.
- Existing Roboto Slab/Serif/Mono, paper `#fdfaf6`, linen `#f6efe6`, sage `#48614c`, clay `#744d40`. Flat surfaces, 18px panels, 10px fields, pill submit action.
- Route-specific CSS module; shared form behavior and other pages' styles remain outside this change.
- `getPublicSiteData()` remains the source for phone, email, Zalo, hours and approved location. It preserves the one-clinic decision in PRODUCT.md despite the older two-clinic language in #12.
- `HeroAbout.jpg` is the clinic's owner-published entrance photo already approved in PRODUCT.md. No new raster assets or identifiable portraits.

## Verification

- `npm run lint`, `npm run typecheck`, `npm test`: passed; 53 test files / 417 tests.
- `npm run build`: passed; `/contact` remains static/ISR with a one-hour revalidation interval.
- Browser: 320, 390, 768 and 1440px; no horizontal overflow, one h1, images render. Production CSS and responsive stacking visually inspected.
- Keyboard: name → phone → optional email → message → submit → privacy link, all with visible focus. Empty submit focuses name and exposes two field errors plus the validation live region.
- Mocked API responses: 503 and network failure retain values and show a direct call link; a delayed success disables the pending button, clears the form and displays the callback acknowledgement. Payload retains `kind: contact` and `source: /contact`. No real email was sent.
- JavaScript disabled: heading, all three direct contact links and clinic address remain available at 390px without overflow. The existing client form still needs JavaScript to submit.
- The initial local server on port 3123 served a stale CSS asset, so development was checked on 3124 and production on 3125. During development, screenshot caret styling followed by HMR produced a hydration diagnostic; fresh production navigation did not reproduce it. Production emitted unused route-CSS preload warnings; intentional mocked HTTP/network failures emitted expected console errors. No unrelated shared-chrome or preload changes were made.
- Preview artifacts: `.context/contact-320.png`, `.context/contact-390.png`, `.context/contact-768.png`, `.context/contact-1440.png`.

## Verification lesson

A live domain or guessed `/contact` path can be parked, blocked or missing even when cached Awwwards evidence exists. Judge the useful cached component explicitly, disclose that limit, and do not infer a full-page structure or motion from it. The installed skill's referenced `scripts/skill-memory.mjs` was unavailable; this note records the lesson locally.
