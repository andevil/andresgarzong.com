# Salsita with Cris — Project Memory

> Updated each session and on every milestone. Source of truth for current state.

---

## Project

**Site:** andresgarzong.com  
**Repo:** https://github.com/andevil/andresgarzong.com  
**Stack:** Next.js 15.5.19 · React 19 · TypeScript · Tailwind CSS v4 · `motion/react` · `@mux/mux-video-react` · `@phosphor-icons/react` · MagicUI (hand-built)

---

## Design Rules (non-negotiable)

- **No border radius anywhere** — enforced globally via `* { border-radius: 0 !important; }` in `globals.css`
- **Fonts:** Cormorant Garamond (headings/display) · DM Sans (body/UI) — loaded via `next/font/google`
- **Gold `#C9A84C`** is the only accent color
- **Hero video** Mux playback ID: `LgNB00c7gLG4emTMep78OyYXPwcqcfcwqeth02oj8G5X8`
- All animations via `motion/react`; always respect `useReducedMotion()`
- Copy tone: warm, Colombian, soulful, social-dance-focused — NOT corporate, NOT Bachata-first

---

## File Structure

```
app/
  layout.tsx          — fonts + metadata
  page.tsx            — assembles all 9 sections
  globals.css         — @theme tokens, global rules, marquee keyframes

components/
  Navbar.tsx          — fixed, scroll-aware, mobile fullscreen overlay
  Hero.tsx            — Mux video bg, staggered editorial text
  StyleStrip.tsx      — continuous marquee with gold dot separators
  About.tsx           — two-column, portrait fallback, NumberTicker stats
  Services.tsx        — numbered editorial list rows
  Testimonials.tsx    — pull quote + 2-col supporting grid
  BookingCalendar.tsx — 3-step animated booking (calendar → form → success)
  Contact.tsx         — MagicUI Dock + social handle list
  Footer.tsx          — minimal single-row, dynamic year
  magicui/
    Marquee.tsx
    BlurFade.tsx
    NumberTicker.tsx
    Dock.tsx

lib/
  data.ts             — all copy, services, testimonials, social links, availability
  utils.ts            — cn() class helper
```

---

## Milestones

| # | Milestone | Status |
|---|-----------|--------|
| 1 | Node.js installed (v24.17.0, arm64 tarball → `~/bin`) | ✅ |
| 2 | Project scaffolded (package.json, tsconfig, next.config, postcss, eslint) | ✅ |
| 3 | `npm install` succeeded (Next 15.5.19 + all deps) | ✅ |
| 4 | `globals.css` with `@theme` tokens + sharp-corners rule | ✅ |
| 5 | `lib/data.ts` — all content centralised | ✅ |
| 6 | MagicUI components (Marquee, BlurFade, NumberTicker, Dock) | ✅ |
| 7 | All 9 section components written | ✅ |
| 8 | `npm run lint` + `npm run build` — 0 errors, 0 warnings | ✅ |
| 9 | Pushed to public GitHub repo | ✅ |

---

## Placeholders to replace before launch

1. **Portrait** → add real photo at `/public/images/cristhian-portrait.jpg`
2. **YouTube URL** → update `href` in `lib/data.ts` `socialLinks`
3. **Instagram / TikTok handles** → verify in `lib/data.ts`
4. **Email** → `andresgarzong@gmail.com` (confirm this is correct)
5. **Booking availability** → replace `availability` in `lib/data.ts` with real backend

---

## Node.js (local dev)

Installed from official arm64 tarball (no Homebrew yet — needs sudo in a real terminal):
- `~/.local/node-v24.17.0-darwin-arm64/`
- Symlinked: `~/bin/node`, `~/bin/npm`, `~/bin/npx`

To install permanently: open Terminal → `brew install node`
