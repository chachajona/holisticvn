# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Three audiences, treated as equally core (no single primary): office workers with chronic pain or postural issues (e.g. pelvic misalignment), recreational athletes recovering from injury, and professional athletes needing return-to-sport rehab and performance work. All are seeking non-surgical, non-drug musculoskeletal therapy and want one place that handles consultation, treatment, and long-term training instead of separate providers.

## Product Purpose

HolisticVN is a physical therapy / rehab clinic in TP. Hồ Chí Minh, presented through a Vietnamese-language Next.js site. It offers one continuous program spanning consultation, multi-method manual therapy, corrective exercise, recovery modalities (cold/infrared), and return-to-sport training. Success is a visitor booking (via Zalo, phone, or the booking flow) or requesting a consultation directly with clinic staff, and a patient completing the program with durable mobility/strength gains achieved without drugs or surgery.

## Positioning

A single continuous pathway (tư vấn → trị liệu → tập luyện) under one roof, versus patients having to visit separate clinics, gyms, and spas for consultation, therapy, and training. Stated pillars: Toàn diện (comprehensive), Xuyên suốt (continuous/uninterrupted), Bền vững (sustainable — no drugs, no surgery).

## Operating Context

Public marketing site (home, services, treatments, blog, about, contact, booking, policy pages) backed by an embedded Sanity Studio (`/studio`) as CMS, with a Sanity webhook triggering `POST /api/revalidate` for ISR. Consultation, contact and booking request forms send email directly to staff through Resend. The website has no customer database, internal CRM, account login or newsletter subscription. Staff receive the request, call the visitor, check availability in the clinic's separate booking system, enter the appointment there and confirm directly. Zalo links let visitors chat with staff. Automated Zalo OA notifications are deferred by the owner; form notifications currently use email only. A request is acknowledged after Resend accepts the email; no persistent queue or automatic message retry is kept. Analytics (GA4/GTM) load only after cookie consent; direct phone and chat links remain available without analytics consent. A legacy-site migration is in progress (see `docs/MIGRATION.md`): an offline script prepares exported Sanity website content for staged import, and changed paths need permanent redirects before domain cutover. Local dev requires no secrets — the site renders from fallback data when Sanity is not configured; forms fail clearly until email is configured. Production also requires the shared rate limiter. Redis stores only hashed-phone and aggregate counters expiring after one hour, never request contents or customer records.

## Capabilities and Constraints

Next.js 16 (App Router) + React 19, Sanity for content, Resend for transactional email, Redis for rate counters, Zod for validation. The "HÀ NỘI · QUẬN HOÀN KIẾM" utility-bar bug is fixed — `lib/content.ts`'s `site.address` now carries the confirmed TP. Hồ Chí Minh address (see Evidence on Hand). Opening hours are now confirmed: 09:00–21:00, all seven days (no different Saturday/Sunday hours). Public domain/canonical is `https://holisticvn.com` (decided 2026-10-06). The owner confirmed on 2026-10-07 that individual staff/founder bios are not needed; launch shows the team photo only, without personal profiles or unsupported founder-origin copy. The owner-supplied 1920×1281 team photo (2026-10-07, identical to the legacy original) is on /about with image quality 90; the owner confirmed on 2026-10-06 that the site photos come from the clinic fanpage. Full launch inventory with sources and owner decisions: `docs/CONTENT_INVENTORY.md`. Individual bios are out of launch scope, not a pending owner decision.

## Brand Commitments

Name "HolisticVN," wordmark "holistic — rehab & performance." Copy is Vietnamese-first (`lang="vi"`). Voice repeatedly anchors on "toàn diện / xuyên suốt / bền vững" and the non-drug, non-surgical philosophy — these three words function as recurring brand vocabulary, not just page copy.

## Evidence on Hand

Phone (082 895 9598), the clinic address (109/15 Lê Quốc Hưng, P. Xóm Chiếu, TP. Hồ Chí Minh; the owner explicitly confirmed on 2026-10-07 that Lê Quốc Hưng is the only operating clinic; 205 Nguyễn Đình Chiểu is no longer listed), and email (Holisticrep9@gmail.com) are confirmed real — sourced by fetching the live production site at holisticvn.com directly and now recorded as `site.phone` / `site.address` / `site.email` in `lib/content.ts`. Public location data stays pinned to the confirmed clinic even when legacy Sanity settings contain closed branches; other CMS contact settings remain editable. The three homepage testimonials are also confirmed real: they were verified two ways independently — they appear on the live production homepage (screenshot-checked) and the same quotes appear as customer-persona examples in the internal Holi Brand Guidelines deck — and are recorded in `lib/content.ts`'s `testimonials` array with their real context (job/age description, no invented names). The "founders là những người uy tín trong ngành" clause was deliberately dropped from the third testimonial when it was restored, since founder credentials specifically remain unconfirmed — don't reintroduce it. Numeric star ratings shown alongside testimonials on the live site were deliberately NOT carried over during the homepage v1 build: at that time the quotes had two independent sources and the ratings had none. The 2026-09-12 source for the old "41 đánh giá" count is no longer held; on 2026-10-06 the owner directed that the Google Maps listing be used instead: 5.0 stars, 644 reviews (`reviewSummary`), linked from the testimonials header. This aggregate does not establish individual ratings for the three legacy quotes; their unsupported per-quote stars are omitted. The "founders là những người uy tín trong ngành" clause remains unconfirmed and dropped; the ratings confirmation does not extend to it. Individual bios are omitted by owner decision. Still unconfirmed: staff/founder credentials, any press or numeric outcome claims (e.g. "cải thiện rõ rệt sau vài tuần" stays as the customer's own words in a quote, not as a site claim).

## Image Provenance

Homepage closing CTA texture (`public/assets/textures/brand-paper.webp`) comes directly from the owner's brand-guideline ZIP supplied on 2026-10-10: the standalone 626×417 paper/plaster background raster in `HoliBrandBrief_9.pdf`, converted to WebP without text, logos or generated decoration. It is used as a subtle static background on the brown consultation card. Extraction provenance and screen references: `docs/homepage-closing-cta-research.md`.

## Product Principles

- One continuous pathway beats fragmented care: every surface should reinforce consultation → therapy → training as one program, not separable services.
- Non-drug, non-surgical is core to trust: avoid copy or imagery implying medication or surgical intervention.
- Three audiences, no default hierarchy: office workers, recreational athletes, and professional athletes are equally core; don't let content default to privileging one.
- Placeholder is not truth: phone, address, and testimonials are now confirmed real (see Evidence on Hand); founder/staff bios and credentials remain unconfirmed drafts, not evidence to build on.
- Requests go directly to staff: the website does not store visitor requests or automatically create appointments. Staff manage scheduling and confirmation in the clinic’s own system.
