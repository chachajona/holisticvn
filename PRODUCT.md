# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Three audiences, treated as equally core (no single primary): office workers with chronic pain or postural issues (e.g. pelvic misalignment), recreational athletes recovering from injury, and professional athletes needing return-to-sport rehab and performance work. All are seeking non-surgical, non-drug musculoskeletal therapy and want one place that handles consultation, treatment, and long-term training instead of separate providers.

## Product Purpose

HolisticVN is a physical therapy / rehab clinic in TP. Hồ Chí Minh, presented through a Vietnamese-language Next.js site. It offers one continuous program spanning consultation, multi-method manual therapy, corrective exercise, recovery modalities (cold/infrared), and return-to-sport training. Success is a visitor booking (via Zalo, phone, or the booking flow) or becoming a qualified lead in the CRM, and a patient completing the program with durable mobility/strength gains achieved without drugs or surgery.

## Positioning

A single continuous pathway (tư vấn → trị liệu → tập luyện) under one roof, versus patients having to visit separate clinics, gyms, and spas for consultation, therapy, and training. Stated pillars: Toàn diện (comprehensive), Xuyên suốt (continuous/uninterrupted), Bền vững (sustainable — no drugs, no surgery).

## Operating Context

Public marketing site (home, services, treatments, blog, about, contact, booking, policy pages) backed by an embedded Sanity Studio (`/studio`) as CMS, with a Sanity webhook triggering `POST /api/revalidate` for ISR. Consultation, contact and booking request forms send email to Holistic through Resend and do not save new leads in Supabase. Staff call the visitor, check availability in the clinic's separate booking system, enter the appointment there and confirm directly. Newsletter signup still writes to Supabase. An internal CRM dashboard (`/dashboard`) gated by Supabase Auth serves Admin and Staff roles for existing or separately entered leads: RLS restricts Staff to leads assigned to them (select/update leads, create notes only on those leads), while Admins manage all leads and profiles including the team page. Analytics (GA4/GTM) and chat widgets (Zalo, Facebook) load only after cookie consent. A legacy-site migration is in progress (see `docs/MIGRATION.md`): a transform-only script normalizes exported legacy Supabase contacts and Sanity content for staged import, and changed paths need 301 redirects before domain cutover. Local dev requires no secrets — the site renders from fallback data when Sanity/Supabase/Resend aren't configured; forms fail clearly until email is configured.

## Capabilities and Constraints

Next.js 16 (App Router) + React 19, Supabase for auth/CRM data, Sanity for content, Resend for transactional email, Zod for validation. The "HÀ NỘI · QUẬN HOÀN KIẾM" utility-bar bug is fixed — `lib/content.ts`'s `site.address` now carries the confirmed TP. Hồ Chí Minh address (see Evidence on Hand). Opening hours are now confirmed: 09:00–21:00, all seven days (no different Saturday/Sunday hours). Still undecided/unconfirmed: real staff/founder bios.

## Brand Commitments

Name "HolisticVN," wordmark "holistic — rehab & performance." Copy is Vietnamese-first (`lang="vi"`). Voice repeatedly anchors on "toàn diện / xuyên suốt / bền vững" and the non-drug, non-surgical philosophy — these three words function as recurring brand vocabulary, not just page copy.

## Evidence on Hand

Phone (082 895 9598), both clinic addresses (205 Nguyễn Đình Chiểu, P. Bàn Cờ and 109/15 Lê Quốc Hưng, P. Xóm Chiếu, both TP. Hồ Chí Minh), and email (Holisticrep9@gmail.com) are confirmed real — sourced by fetching the live production site at holisticvn.com directly and now recorded as `site.phone` / `site.address` / `site.addressSecondary` / `site.email` in `lib/content.ts`. The three homepage testimonials are also confirmed real: they were verified two ways independently — they appear on the live production homepage (screenshot-checked) and the same quotes appear as customer-persona examples in the internal Holi Brand Guidelines deck — and are recorded in `lib/content.ts`'s `testimonials` array with their real context (job/age description, no invented names). The "founders là những người uy tín trong ngành" clause was deliberately dropped from the third testimonial when it was restored, since founder credentials specifically remain unconfirmed — don't reintroduce it. Numeric star ratings shown alongside testimonials on the live site were deliberately NOT carried over during the homepage v1 build: at that time the quotes had two independent sources and the ratings had none. The user has since confirmed (2026-09-12) they hold a real source for the star ratings and the aggregate review count ("03 / 41 ĐÁNH GIÁ" pattern), clearing them to ship — reintroduce ★★★★★ plus the review count in testimonial UI going forward. The "founders là những người uy tín trong ngành" clause remains unconfirmed and dropped; the ratings confirmation does not extend to it. Still unconfirmed: staff/founder bios, any press or numeric outcome claims (e.g. "cải thiện rõ rệt sau vài tuần" stays as the customer's own words in a quote, not as a site claim).

## Product Principles

- One continuous pathway beats fragmented care: every surface should reinforce consultation → therapy → training as one program, not separable services.
- Non-drug, non-surgical is core to trust: avoid copy or imagery implying medication or surgical intervention.
- Three audiences, no default hierarchy: office workers, recreational athletes, and professional athletes are equally core; don't let content default to privileging one.
- Placeholder is not truth: phone, address, and testimonials are now confirmed real (see Evidence on Hand); founder/staff bios and credentials remain unconfirmed drafts, not evidence to build on.
- CRM access is role-gated: Staff are scoped to their assigned leads; Admin has full visibility — reflect that boundary in any dashboard design work.
