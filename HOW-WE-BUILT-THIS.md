# How We Built Salsita with Cris — A Complete Walkthrough

> A step-by-step guide to reverse-engineering this project so you can build the next one yourself (with or without an AI co-pilot).

---

## Table of Contents

1. [What We Built](#1-what-we-built)
2. [Tools & Accounts You Need](#2-tools--accounts-you-need)
3. [Phase 1 — Project Setup](#3-phase-1--project-setup)
4. [Phase 2 — GitHub Setup](#4-phase-2--github-setup)
5. [Phase 3 — Deploying to the Internet (Vercel)](#5-phase-3--deploying-to-the-internet-vercel)
6. [Phase 4 — The Database (Supabase)](#6-phase-4--the-database-supabase)
7. [Phase 5 — Building the Portfolio Page](#7-phase-5--building-the-portfolio-page)
8. [Phase 6 — Building the CRM](#8-phase-6--building-the-crm)
9. [Phase 7 — Public Event Pages](#9-phase-7--public-event-pages)
10. [The Git Workflow — How We Saved Our Work](#10-the-git-workflow--how-we-saved-our-work)
11. [Commands Cheat Sheet](#11-commands-cheat-sheet)
12. [How to Replicate This for a New Project](#12-how-to-replicate-this-for-a-new-project)
13. [Key Concepts Explained Simply](#13-key-concepts-explained-simply)

---

## 1. What We Built

A complete web presence for **Cristhian Garzón (Salsita with Cris)**, a Colombian salsa instructor based in Budapest. The project has two parts:

### The Public Website (`andresgarzong.com`)
- A one-page portfolio showcasing Cristhian's story, classes, and contact info
- Public event pages at short URLs like `andresgarzong.com/events/salsa-workshop-july`
- Each event page has a thumbnail image, details, and contact buttons (WhatsApp + Instagram)
- The event URLs are designed to be shared on social media (with preview images)

### The CRM (Customer Relationship Manager) — `/crm`
- A private admin panel only Cristhian can log into
- Manages **people** (students), **courses** (recurring weekly classes), and **workshops** (one-off events)
- Can create events with a custom short URL + thumbnail image
- Tracks registrations, enrollments, attendance, and payments

---

## 2. Tools & Accounts You Need

Before starting any project like this, create accounts on these platforms:

| Tool | What it does | Cost |
|------|-------------|------|
| **GitHub** (github.com) | Stores your code online, tracks all changes | Free |
| **Vercel** (vercel.com) | Hosts your website on the internet | Free tier available |
| **Supabase** (supabase.com) | Your database + file storage + user login | Free tier available |
| **Node.js** (nodejs.org) | Runs JavaScript on your computer | Free |
| **VS Code** (code.visualstudio.com) | Code editor | Free |
| **Claude Code** (claude.ai/code) | AI co-pilot for coding | Paid |

Also install on your computer:
- **Git** — `brew install git` (Mac) or download from git-scm.com
- **Node.js** — download the LTS version from nodejs.org
- **npm** — comes with Node.js automatically

---

## 3. Phase 1 — Project Setup

### 3.1 Create the Next.js App

This is the very first command you run. Open your Terminal and navigate to where you want your project folder to live, then run:

```bash
npx create-next-app@latest andresgarzong.com
```

It asks you a series of questions. Answer them like this:
```
Would you like to use TypeScript? → Yes
Would you like to use ESLint? → Yes
Would you like to use Tailwind CSS? → Yes
Would you like your code inside a `src/` directory? → No
Would you like to use App Router? → Yes
Would you like to use Turbopack? → Yes
Would you like to customize the import alias? → No (press Enter)
```

This creates a folder called `andresgarzong.com` with a working website inside it.

### 3.2 Enter the Project Folder

```bash
cd andresgarzong.com
```

From this point forward, every command you run is inside this folder.

### 3.3 Start the Development Server

```bash
npm run dev
```

Open your browser and go to `http://localhost:3000`. You should see the default Next.js welcome page. This is your "local" version — only you can see it on your computer.

To stop the server: press `Ctrl + C` in the terminal.

### 3.4 Install the Packages We Used

Over the course of the project we installed many extra tools. Here's what each one does and the command used:

```bash
# Supabase — connects to our database and handles login
npm install @supabase/supabase-js @supabase/ssr

# date-fns — formats dates nicely (e.g., "Monday, 21 June 2025")
npm install date-fns

# Phosphor Icons — the icon library (arrows, clocks, map pins, etc.)
npm install @phosphor-icons/react

# React Hook Form — handles forms (login form, event creation form, etc.)
npm install react-hook-form

# Zod — validates form data (checks that required fields are filled)
npm install zod

# Hookform resolvers — connects Zod validation to React Hook Form
npm install @hookform/resolvers@3
```

> **Why version @3 for hookform resolvers?** Version 4 had type incompatibilities with our setup. When packages conflict, pin the older version that works.

### 3.5 Project Folder Structure

After setup, the key folders look like this:

```
andresgarzong.com/
├── app/                    ← Pages of the website
│   ├── page.tsx            ← The homepage (/)
│   ├── layout.tsx          ← Wraps every page (fonts, global styles)
│   ├── globals.css         ← Global CSS styles
│   ├── crm/                ← The private admin area (/crm/...)
│   │   ├── layout.tsx      ← CRM shell (sidebar + topbar)
│   │   ├── login/          ← Login page
│   │   ├── people/         ← Manage students
│   │   ├── courses/        ← Manage courses
│   │   └── workshops/      ← Manage workshops
│   └── events/
│       └── [slug]/         ← Public event pages (/events/any-url)
├── components/
│   └── crm/                ← Reusable CRM components
├── lib/
│   ├── supabase/           ← Supabase connection files
│   └── utils.ts            ← Helper functions (like fmtTime)
├── public/                 ← Static files (images, etc.)
├── .env.local              ← Secret keys (NEVER commit this to GitHub)
└── package.json            ← Lists all installed packages
```

---

## 4. Phase 2 — GitHub Setup

GitHub is where you store your code online. Think of it like Google Drive but specifically for code — it tracks every single change you ever made.

### 4.1 Create a Repository on GitHub

1. Go to github.com and log in
2. Click the **+** button → **New repository**
3. Name it `andresgarzong.com`
4. Set it to **Private** (so your code isn't public)
5. Do NOT add a README or .gitignore yet (we'll do that from our computer)
6. Click **Create repository**

GitHub will show you a page with commands. Use the second set ("push an existing repository").

### 4.2 Initialize Git in Your Project

Back in your terminal (inside the project folder):

```bash
# Tell git to start tracking this folder
git init

# Tell git who you are (do this once per computer)
git config --global user.name "Your Name"
git config --global user.email "your@email.com"
```

### 4.3 Create a .gitignore File

This file tells git to IGNORE certain files — especially secrets. Create a file called `.gitignore` in the root of your project with these contents:

```
node_modules/
.next/
.env.local
.env*.local
```

> **CRITICAL**: `.env.local` contains your database passwords. It must NEVER go to GitHub. The `.gitignore` file prevents this accident.

### 4.4 Connect to GitHub and Push

```bash
# Stage all files (prepare them to be saved)
git add .

# Save a snapshot with a message describing what you did
git commit -m "Initial commit"

# Connect your local project to GitHub (replace with your actual URL)
git remote add origin https://github.com/andevil/andresgarzong.com.git

# Push your code to GitHub
git push -u origin main
```

Go to your GitHub repository — you should see all your files there now.

---

## 5. Phase 3 — Deploying to the Internet (Vercel)

Vercel takes your GitHub repository and automatically turns it into a live website.

### 5.1 Connect Vercel to GitHub

1. Go to vercel.com and sign up (use your GitHub account to sign in — it connects automatically)
2. Click **Add New Project**
3. Select your `andresgarzong.com` repository
4. Click **Deploy**

Vercel will build your project and give you a URL like `andresgarzong.com.vercel.app`. Your site is live!

### 5.2 Add Your Custom Domain

1. In Vercel, go to your project → **Settings** → **Domains**
2. Add `andresgarzong.com`
3. Vercel gives you DNS records to add
4. Go to your domain registrar (where you bought the domain) and add those records
5. Wait a few minutes — your custom domain is live

### 5.3 Add Environment Variables to Vercel

Your `.env.local` file doesn't go to GitHub, so Vercel doesn't know your database passwords. You have to add them manually:

1. In Vercel → your project → **Settings** → **Environment Variables**
2. Add:
   - `NEXT_PUBLIC_SUPABASE_URL` = your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your Supabase anon key
3. Click **Save** and **Redeploy**

### 5.4 How Auto-Deploy Works

From this point on, every time you push code to GitHub, Vercel automatically rebuilds and redeploys your site. The workflow is:

```
You edit code → git commit → git push → Vercel deploys automatically
```

---

## 6. Phase 4 — The Database (Supabase)

Supabase is our database. It stores all the data: people, courses, workshops, registrations, etc.

### 6.1 Create a Supabase Project

1. Go to supabase.com and sign up
2. Click **New Project**
3. Choose a name (e.g., `salsita-crm`), set a strong database password, choose a region close to Budapest (e.g., Frankfurt)
4. Wait ~2 minutes for the project to spin up

### 6.2 Get Your API Keys

In Supabase → **Project Settings** → **API**:
- Copy the **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
- Copy the **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Add these to your `.env.local` file:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...your-long-key...
```

### 6.3 Create the Supabase Client Files

We created three files to connect our app to Supabase:

**`lib/supabase/client.ts`** — for use in browser components:
```ts
import { createBrowserClient } from '@supabase/ssr'
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

**`lib/supabase/server.ts`** — for use in server components:
```ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll() { return cookieStore.getAll() }, setAll(toSet) { ... } } }
  )
}
```

**`lib/supabase/middleware.ts`** — runs on every page request, checks if user is logged in:
```ts
// If user tries to visit /crm/* without being logged in → redirect to /crm/login
```

### 6.4 Create the Database Tables

In Supabase → **SQL Editor**, we ran SQL commands to create our tables. Key tables:

```sql
-- People (students)
CREATE TABLE people (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  dance_role TEXT,
  dance_experience TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Workshops (one-off events)
CREATE TABLE workshops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  date DATE,
  start_time TIME,
  end_time TIME,
  location TEXT,
  price NUMERIC,
  capacity INTEGER,
  status TEXT DEFAULT 'upcoming',
  type TEXT,
  description TEXT,
  slug TEXT UNIQUE,           -- short URL: /events/this-slug
  thumbnail_url TEXT,         -- image stored in Supabase Storage
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Courses (recurring weekly classes)
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  day_of_week TEXT,
  start_time TIME,
  end_time TIME,
  location TEXT,
  default_price NUMERIC,
  capacity INTEGER,
  status TEXT DEFAULT 'active',
  level TEXT,
  description TEXT,
  slug TEXT UNIQUE,
  thumbnail_url TEXT,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 6.5 Row Level Security (RLS)

RLS is Supabase's way of controlling who can see what data. Think of it as a bouncer for each table.

```sql
-- Enable RLS on every table
ALTER TABLE people ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshops ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

-- Only logged-in users can manage people/registrations
CREATE POLICY "auth users only" ON people FOR ALL TO authenticated USING (true);

-- Anyone (even without an account) can READ workshops and courses
-- This is needed for the public /events/ pages
CREATE POLICY "public read workshops" ON workshops FOR SELECT TO anon USING (true);
CREATE POLICY "public read courses" ON courses FOR SELECT TO anon USING (true);
```

> **Why do we need the anon policy?** When someone opens your event link in incognito mode or shares it on WhatsApp, they're not logged in. Without the `anon` policy, the page returns no data and shows an error.

### 6.6 Set Up File Storage (for event images)

In Supabase → **Storage** → **New Bucket**:
- Name: `event-images`
- Public: Yes (so images can be shown on the public event page)

Storage policies:
- Anyone can **read** (view images)
- Only logged-in users can **upload/delete**

### 6.7 Create an Admin User

In Supabase → **Authentication** → **Users** → **Invite User**:
- Enter Cristhian's email
- He receives a magic link to set his password
- This is the login for the CRM

---

## 7. Phase 5 — Building the Portfolio Page

The homepage (`app/page.tsx`) is a one-page portfolio. Key design decisions:

- **Color palette**: warm cream background `#F7F1E7`, dark brown `#171410`, gold accent `#C9A84C`
- **Sharp corners everywhere** on the portfolio (no border-radius) — gives a clean, editorial feel
- **Fonts**: a display font for headings (Playfair Display or similar), clean sans-serif for body

### The border-radius problem we solved

The CRM uses rounded corners (modern UI), but the portfolio uses sharp corners (design choice). We couldn't use `* { border-radius: 0 }` globally because it would break the CRM. Solution: wrap the portfolio in a class and scope the rule:

```css
/* globals.css */
.portfolio-root * {
  border-radius: 0 !important;
}
```

```tsx
/* app/page.tsx */
export default function HomePage() {
  return (
    <div className="portfolio-root">
      {/* all portfolio content here */}
    </div>
  )
}
```

---

## 8. Phase 6 — Building the CRM

### 8.1 The CRM Layout

`app/crm/layout.tsx` is the shell that wraps all CRM pages. It provides:
- Warm gradient background
- Decorative blurred gold orbs
- Sidebar (navigation menu)
- Topbar (hamburger menu for mobile)
- Roboto font (loaded via `next/font/google`)

**The login page exception**: on the login page we don't want the sidebar. We detect which page we're on using a custom header set in the middleware:

```ts
// middleware.ts
supabaseResponse.headers.set('x-pathname', request.nextUrl.pathname)

// layout.tsx
const pathname = headersList.get('x-pathname') ?? ''
const isLogin = pathname === '/crm/login'
if (isLogin) { return <bare login shell> }
return <full sidebar shell>
```

### 8.2 The Visual Style — Glassmorphism

The CRM uses a design style called "glassmorphism" — cards look like frosted glass:

```tsx
// A glass card
<div className="rounded-2xl border border-white/60 bg-white/60 backdrop-blur-sm shadow-sm">

// A glass input field
<input className="rounded-xl border border-white/50 bg-white/60 backdrop-blur-sm px-3 py-2.5" />

// A gold button
<button className="rounded-xl bg-[#C9A84C] px-4 py-2 text-[#171410]">
```

The key CSS properties:
- `bg-white/60` → white background at 60% opacity (see-through)
- `backdrop-blur-sm` → blurs what's behind the element (the frosted glass effect)
- `border-white/60` → semi-transparent white border

### 8.3 The Sidebar

`components/crm/CRMSidebar.tsx` — the navigation panel on the left.

**Mobile behavior**: on small screens, the sidebar slides in from the left when you tap the hamburger menu (☰), and slides out when you tap the X or tap a menu link.

We use DOM manipulation (not React state) to toggle the sidebar because the hamburger button is in a different component (Topbar) than the sidebar itself:

```ts
function closeSidebar() {
  document.getElementById('crm-sidebar')?.classList.replace('translate-x-0', '-translate-x-full')
  document.getElementById('crm-overlay')?.classList.add('hidden')
}
```

### 8.4 Forms — React Hook Form + Zod

Every creation form (new workshop, new course, new person) follows the same pattern:

```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

// 1. Define what the form data looks like
const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  date: z.string().min(1, 'Date is required'),
  price: z.coerce.number().min(0),
})

type FormData = z.infer<typeof schema>

// 2. Use the form
export function WorkshopForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    const supabase = createClient()
    await supabase.from('workshops').insert(data)
    router.push('/crm/workshops')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name')} />
      {errors.name && <p>{errors.name.message}</p>}
    </form>
  )
}
```

### 8.5 Auto-Generated Short URLs (Slugs)

When you type a workshop name like "Budapest Salsa Night", the slug field auto-fills with `budapest-salsa-night`. You can edit it manually. Once you manually change it, auto-fill stops (so you don't lose your custom slug):

```tsx
const [slugTouched, setSlugTouched] = useState(false)
const watchedName = useWatch({ control, name: 'name' })

useEffect(() => {
  if (!slugTouched && watchedName) {
    setValue('slug', toSlug(watchedName))
  }
}, [watchedName, slugTouched])

// toSlug converts "Budapest Salsa Night!" → "budapest-salsa-night"
function toSlug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}
```

### 8.6 Image Upload to Supabase Storage

`components/crm/ImageUpload.tsx` — handles uploading a thumbnail:

1. User picks a file from their computer
2. File is uploaded to the `event-images` bucket in Supabase Storage
3. Supabase returns a public URL
4. That URL is saved in the `thumbnail_url` column of the workshop/course

```tsx
const { data } = await supabase.storage
  .from('event-images')
  .upload(`workshops/${Date.now()}.jpg`, file)

const { data: { publicUrl } } = supabase.storage
  .from('event-images')
  .getPublicUrl(data.path)

setValue('thumbnail_url', publicUrl)
```

### 8.7 AM/PM Time Display

We created a utility function in `lib/utils.ts`:

```ts
export function fmtTime(t: string | null | undefined): string {
  if (!t) return '—'
  const [hStr, mStr] = t.split(':')
  const h = parseInt(hStr, 10)
  const period = h >= 12 ? 'PM' : 'AM'
  const hour = h % 12 || 12
  return `${hour}:${mStr} ${period}`
}

// Usage: fmtTime('14:30') → "2:30 PM"
// Usage: fmtTime('09:00') → "9:00 AM"
```

---

## 9. Phase 7 — Public Event Pages

`app/events/[slug]/page.tsx` — the public-facing page for each event.

### How Dynamic Routes Work

The `[slug]` in the folder name is a **dynamic segment** — it matches any URL. So:
- `/events/salsa-workshop` → slug = `"salsa-workshop"`
- `/events/beginners-course-july` → slug = `"beginners-course-july"`

```tsx
export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  // Look up the event by slug in the database
  const result = await getEvent(slug)
  if (!result) notFound() // Shows 404 page
  // Render the event...
}
```

### Social Media Preview (OG Tags)

When you paste the link on WhatsApp or Instagram, it shows a preview card. This is controlled by `generateMetadata()`:

```tsx
export async function generateMetadata({ params }) {
  const event = await getEvent(slug)
  return {
    title: `${event.name} — Salsita with Cris`,
    openGraph: {
      images: [{ url: event.thumbnail_url, width: 1200, height: 630 }],
    },
    twitter: { card: 'summary_large_image' },
  }
}
```

### The Banner Image

The hero image at the top uses Facebook banner proportions (16:6 ratio — wider than 16:9, less tall):

```tsx
<div className="relative w-full" style={{ aspectRatio: '16/6' }}>
  <img
    src={event.thumbnail_url}
    className="absolute inset-0 h-full w-full object-cover object-center"
  />
  {/* Dark gradient overlay so text is readable */}
  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
  {/* Title overlaid on the image */}
  <div className="absolute bottom-0 left-0 right-0 p-5">
    <h1 className="text-white text-4xl">{event.name}</h1>
  </div>
</div>
```

---

## 10. The Git Workflow — How We Saved Our Work

Every time we finished a meaningful chunk of work, we committed and pushed to GitHub. Here's the exact workflow:

```bash
# 1. See what files changed
git status

# 2. See the actual changes in detail
git diff

# 3. Stage specific files (add to the "save snapshot")
git add app/events/slug/page.tsx
git add components/crm/WorkshopForm.tsx

# OR stage everything at once (use carefully — don't stage .env.local!)
git add -A

# 4. Save the snapshot with a message
git commit -m "feat(events): add public event page with OG meta"

# 5. Push to GitHub (and trigger Vercel deploy)
git push
```

### Commit Message Convention

We followed a pattern called "conventional commits":
- `feat(area): what you added` — new feature
- `fix(area): what you fixed` — bug fix
- `refactor(area): what you reorganized` — code cleanup

Examples from this project:
```
feat(crm): add slug + image upload to workshop and course forms
fix(events): constrain full page to centered column layout
fix(crm): mobile sidebar X button and nav-link close behavior
```

### Viewing History

```bash
# See all past commits
git log --oneline

# See what changed in a specific commit
git show abc1234
```

---

## 11. Commands Cheat Sheet

### Starting & Running

```bash
npm run dev          # Start local development server (localhost:3000)
npm run build        # Build production version (checks for errors)
npm run lint         # Check code for style problems
```

### Git

```bash
git status           # See what changed
git diff             # See the changes line by line
git add .            # Stage all changes
git add <file>       # Stage one file
git commit -m "msg"  # Save a snapshot
git push             # Push to GitHub (triggers Vercel deploy)
git pull             # Pull latest changes from GitHub
git log --oneline    # See commit history
```

### Installing Packages

```bash
npm install <package>          # Add a package
npm install <package>@3        # Add a specific version
npm uninstall <package>        # Remove a package
```

---

## 12. How to Replicate This for a New Project

Follow these steps in order for any new website + CRM:

### Step 1: Create the App
```bash
npx create-next-app@latest your-project-name
cd your-project-name
```

### Step 2: Set Up GitHub
```bash
git init
git add .
git commit -m "Initial commit"
# Create repo on github.com, then:
git remote add origin https://github.com/yourusername/your-project.git
git push -u origin main
```

### Step 3: Set Up Supabase
1. Create project on supabase.com
2. Create your database tables in SQL Editor
3. Enable RLS on all tables + add policies
4. Create admin user in Authentication → Users
5. Copy URL and anon key to `.env.local`

### Step 4: Connect to Vercel
1. Import from GitHub on vercel.com
2. Add environment variables (Supabase URL + key)
3. Deploy

### Step 5: Build Your Features
From here it's about:
- Creating pages in `app/`
- Creating components in `components/`
- Connecting to Supabase for data
- Committing and pushing regularly

### Step 6: After Every Feature
```bash
git add <changed files>
git commit -m "feat: describe what you built"
git push
```

---

## 13. Key Concepts Explained Simply

### What is Next.js?
A framework for building websites with React. It handles routing (URLs), server-side rendering (fast page loads), and API routes. Think of it as the scaffolding of the house.

### What is React?
A JavaScript library for building user interfaces. Instead of writing HTML directly, you write components — reusable building blocks. Think of components like LEGO bricks.

### What is TypeScript?
JavaScript but with types. You declare what kind of data a variable holds (string, number, object), and the editor warns you before you make mistakes. It catches bugs before your users do.

### What is Tailwind CSS?
Instead of writing a separate CSS file, you add utility classes directly to your HTML:
- `text-red-500` = red text
- `p-4` = padding of 16px on all sides
- `flex items-center` = flexbox, vertically centered

### What is Supabase?
A backend-as-a-service. It gives you a PostgreSQL database, authentication (login/logout), and file storage — all without managing a server. Think of it as renting a pre-built kitchen instead of building one from scratch.

### What is RLS (Row Level Security)?
Rules you set on database tables that control who can read/write which rows. Example: "only the logged-in user can see their own data" or "anyone can read the public events table."

### What is a Slug?
A URL-friendly version of a name. `"Budapest Salsa Night"` → `"budapest-salsa-night"`. Used in URLs because spaces and special characters aren't allowed.

### What is a Dynamic Route?
A page whose URL contains a variable part. `app/events/[slug]/page.tsx` matches `/events/anything` — the word "anything" becomes the `slug` variable you use to look up data.

### What is an Environment Variable?
A secret stored outside your code. Instead of writing your database password directly in the code (where anyone on GitHub could see it), you put it in `.env.local` and reference it as `process.env.YOUR_KEY_NAME`. Vercel stores these securely on their servers.

### What is a Component?
A reusable piece of UI. Instead of writing the same button HTML 50 times, you write a `<Button>` component once and use it everywhere. Change it in one place, it updates everywhere.

### What is a Commit?
A saved snapshot of your code at a point in time. Like a save point in a video game. You can always go back to any past commit.

### What is Glassmorphism?
A design style where UI elements look like frosted glass — semi-transparent with a blur effect. Achieved in CSS with `backdrop-blur` and semi-transparent backgrounds (`bg-white/60`).

---

*Built with Next.js 15, React 19, TypeScript, Tailwind CSS v4, and Supabase. Deployed on Vercel.*

*Co-built with Claude Code (Anthropic) — June 2025*
