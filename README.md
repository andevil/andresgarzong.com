# Salsita with Cris — Cristhian Garzón Portfolio

An editorial-luxury one-page portfolio for **Cristhian Garzón**, a Colombian
salsa instructor and community builder based in Budapest.

Vogue-style editorial layout meets a warm Cali dance studio: cream paper, black
ink typography, a single gold accent, and sharp rectangular geometry (no border
radius anywhere).

## Stack

- **Next.js 15** (App Router) · **React 19** · **TypeScript**
- **Tailwind CSS v4** with design tokens in `app/globals.css` (`@theme`)
- **motion/react** for animation (always respects `useReducedMotion()`)
- **@mux/mux-video-react** for the hero background video
- **@phosphor-icons/react** (always `weight="light"`)
- Hand-rolled MagicUI components: Marquee, BlurFade, NumberTicker, Dock

## Run locally

```bash
npm install
npm run dev      # http://localhost:3000
```

Other scripts:

```bash
npm run build    # production build
npm run start    # serve the production build
npm run lint     # eslint (next/core-web-vitals)
```

## Structure

```
app/
  layout.tsx     # fonts (Cormorant Garamond + DM Sans) + metadata
  page.tsx       # section composition
  globals.css    # @theme tokens, global rules, marquee keyframes
components/
  Navbar · Hero · StyleStrip · About · Services
  Testimonials · BookingCalendar · Contact · Footer
  magicui/       # Marquee, BlurFade, NumberTicker, Dock
lib/
  data.ts        # all copy, services, testimonials, socials, availability
  utils.ts       # cn() className helper
public/images/   # drop the portrait here
```

## Placeholders to replace

| What | Where | Notes |
| --- | --- | --- |
| Portrait photo | `public/images/cristhian-portrait.jpg` | A vertical ~4:5 image. Until added, the About section shows a clean placeholder block. |
| Social links | `lib/data.ts` → `socialLinks` | Instagram / YouTube / TikTok / email handles + URLs. |
| Booking availability | `lib/data.ts` → `availability` | Mock dates/slots. Wire to a backend later; the UI has 3 steps (calendar → form → success) and no submission logic yet. |
| Testimonials | `lib/data.ts` | **Sample** copy for layout only — replace with real quotes. |
| Prices | `lib/data.ts` → `services` | HUF prices / "On request". |

## Notes

- The booking flow is front-end only — no backend, auth, database, or payments.
- The calendar's "today" is pinned to `2026-06-21` in `BookingCalendar.tsx` so the
  demo availability lines up; swap for `new Date()` when wiring real data.
- Hero video uses the provided Mux playback ID.
```
