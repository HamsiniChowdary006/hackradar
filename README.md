# HackRadar

> A unified discovery platform for hackathons and tech events.

**HackRadar** aggregates hackathons from multiple popular platforms — **Devpost, Unstop, HackerEarth, Devfolio, MLH, Eventbrite, and Hack2Skill** — into a single, clean, filterable feed. It helps developers, students, and hackathon enthusiasts discover upcoming events, save favorites, manage preferences, and never miss a registration deadline.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Stack](https://img.shields.io/badge/stack-TanStack%20Start%20%2B%20Supabase-orange)
![Styling](https://img.shields.io/badge/styling-Tailwind%20CSS%20v4-06b6d4)

---

## Features

- **Aggregated Hackathon Feed** — Browse events from multiple platforms in one place.
- **Smart Filtering** — Filter by skill level, mode (online/offline/hybrid), location, and source platform.
- **User Authentication** — Secure email/password login with email verification, plus Google OAuth.
- **Saved Bookmarks** — Save hackathons to your personal list (database-backed).
- **In-App Notifications** — Get deadline reminders and updates via the notification bell.
- **Submission Portal** — Submit hackathons for review and inclusion.
- **Feedback Form** — Simple public feedback page with admin-only read access.
- **Responsive Neumorphic UI** — Soft, modern interface built with Tailwind CSS.
- **SEO Optimized** — Meta tags, Open Graph, JSON-LD structured data, sitemap, and robots.txt.
- **Automated Scraping** — Lovable Cloud Edge Functions pull fresh Devpost and Unstop listings daily.

---

## Tech Stack

### Frontend

| Technology | Purpose |
|------------|---------|
| [React 19](https://react.dev/) | UI library |
| [TanStack Start](https://tanstack.com/start/) | Full-stack React framework (SSR/SSG, file-based routing) |
| [TanStack Router](https://tanstack.com/router/) | Type-safe routing |
| [TanStack Query](https://tanstack.com/query/) | Server state management and data fetching |
| [Tailwind CSS v4](https://tailwindcss.com/) | Utility-first styling |
| [shadcn/ui](https://ui.shadcn.com/) | Accessible, composable UI primitives |
| [Radix UI](https://www.radix-ui.com/) | Headless accessible components |
| [Lucide React](https://lucide.dev/) | Iconography |
| [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) | Form handling and validation |

### Backend & Data

| Technology | Purpose |
|------------|---------|
| [Lovable Cloud / Supabase](https://lovable.dev/) | Managed backend, Postgres database, auth, and storage |
| [Supabase Auth](https://supabase.com/docs/guides/auth) | Email/password and OAuth authentication |
| [Supabase Edge Functions](https://supabase.com/docs/guides/functions) | Serverless functions for scraping hackathons |
| [PostgREST](https://postgrest.org/) | Auto-generated REST API over Postgres |
| [Row Level Security (RLS)](https://supabase.com/docs/guides/database/postgres/row-level-security) | Fine-grained data access control |

### Scraping & Integrations

| Technology | Purpose |
|------------|---------|
| [Apify](https://apify.com/) | Cloud scraping platform for Devpost and Unstop |
| [Lovable Cloud Connectors](https://docs.lovable.dev/integrations) | External service integrations |

### Tooling

| Technology | Purpose |
|------------|---------|
| [Vite 8](https://vitejs.dev/) | Build tool and dev server |
| [TypeScript](https://www.typescriptlang.org/) | Type safety |
| [ESLint](https://eslint.org/) | Linting |
| [Prettier](https://prettier.io/) | Code formatting |

---

## Project Structure

```
├── public/                    # Static assets, favicon, robots.txt, sitemap
├── src/
│   ├── components/            # Reusable UI components
│   │   ├── app-shell.tsx
│   │   ├── app-sidebar.tsx
│   │   ├── auth-modal.tsx
│   │   ├── filter-bar.tsx
│   │   ├── hackathon-card.tsx
│   │   ├── hackathon-detail-modal.tsx
│   │   ├── hackathon-listing.tsx
│   │   ├── notifications-bell.tsx
│   │   ├── stat-card.tsx
│   │   ├── top-bar.tsx
│   │   └── user-menu.tsx
│   ├── hooks/                 # Custom React hooks
│   ├── integrations/          # Supabase and Lovable integrations
│   │   └── supabase/
│   ├── lib/                   # Utility libraries and context providers
│   │   ├── auth-context.tsx
│   │   ├── bookmarks.ts
│   │   ├── hackathons.ts
│   │   ├── notifications.ts
│   │   └── utils.ts
│   ├── routes/                # TanStack file-based routes
│   │   ├── __root.tsx         # Root layout
│   │   ├── _authenticated/    # Protected routes
│   │   ├── about.tsx
│   │   ├── feedback.tsx
│   │   ├── help.tsx
│   │   ├── login.tsx
│   │   ├── signup.tsx
│   │   ├── forgot-password.tsx
│   │   ├── reset-password.tsx
│   │   └── sitemap[.]xml.ts
│   ├── router.tsx             # Router configuration
│   ├── server.ts              # Server entry
│   ├── start.ts               # TanStack Start configuration
│   └── styles.css             # Global styles and Tailwind theme
├── supabase/
│   ├── config.toml            # Supabase CLI configuration
│   └── functions/             # Edge Functions
│       ├── fetch-devpost-hackathons/
│       └── fetch-unstop-hackathons/
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## Database Schema

The app uses a Postgres database managed by Lovable Cloud. Key tables include:

- **`hackathons`** — Aggregated event listings from all supported platforms.
- **`pending_submissions`** — User-submitted hackathons awaiting admin review.
- **`saved_hackathons`** — Many-to-many join for user bookmarks.
- **`profiles`** — Extended user profile data.
- **`notifications`** — In-app notification messages.
- **`notification_preferences`** — Per-user notification settings.
- **`feedback`** — Public feedback submissions (insert-only for users, admin read).
- **`user_roles`** — Role-based access control (`admin`, `moderator`, `user`).
- **`scrape_log`** — Tracks the last successful run per scraper source.

All tables have **Row Level Security (RLS)** enabled with policies scoped to authenticated users, roles, and ownership.

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+ (or [Bun](https://bun.sh/))
- A Lovable Cloud / Supabase project
- (Optional) An [Apify](https://apify.com/) account for scraping

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/hackradar.git
cd hackradar

# Install dependencies
bun install
# or
npm install
```

### Environment Variables

Create a `.env` file in the project root with the following variables:

```env
# Supabase / Lovable Cloud
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Apify (server-side, used in Edge Functions)
APIFY_TOKEN=your-apify-token
```

> The Supabase URL and anon key are injected automatically when using Lovable Cloud. For local development, copy them from your project settings.

### Run the Development Server

```bash
bun run dev
# or
npm run dev
```

The app will be available at `http://localhost:8080`.

### Build for Production

```bash
bun run build
# or
npm run build
```

---

## Edge Functions

The project includes two serverless scrapers:

- **`fetch-devpost-hackathons`** — Scrapes Devpost via Apify actor `automation-lab~devpost-scraper`.
- **`fetch-unstop-hackathons`** — Scrapes Unstop via Apify actor `trusted_offshoot~unstop-hackathon-scraper`.

Both functions:

- Throttle runs to once every 24 hours using the `scrape_log` table.
- Map scraped data to the `hackathons` schema.
- Deduplicate on `title + event_start`.
- Log errors and URLs (with tokens redacted).

To deploy or invoke them, use the Lovable Cloud / Supabase CLI.

---

## Authentication Flow

1. **Sign Up** — Email/password with email verification, or Google OAuth.
2. **Sign In** — Redirected to the originally requested protected page.
3. **Protected Routes** — All core features (Home, Browse, Directory, Saved, Submit, Settings, Dashboard) live under the `_authenticated` layout and require login.
4. **Public Pages** — About, Help, Feedback, Blog, Login/Signup, Forgot/Reset Password remain public.

---

## SEO & Structured Data

Each route defines unique metadata via TanStack Router's `head()` API:

- Unique `<title>` and `<meta name="description">`
- Open Graph (`og:title`, `og:description`, `og:type`, `og:url`)
- Canonical links
- JSON-LD structured data:
  - `Organization` & `WebSite` on root
  - `CollectionPage` on home
  - `FAQPage` on help
  - `Article` on blog

Static SEO files:

- `public/robots.txt`
- `public/sitemap.xml`
- `public/llms.txt`

---

## Design System

HackRadar uses a **soft neumorphic** visual language with:

- Subtle shadows and rounded corners.
- A light-only theme (dark mode removed).
- Semantic Tailwind tokens for surfaces, text, and accents.
- Custom utility classes like `neu-card`, `neu-card-sm`, `neu-inset`, and `neu-pressable`.

---

## Deployment

This project is optimized for deployment on **Lovable** and **Cloudflare Workers** (via TanStack Start's edge-compatible build).

To publish from Lovable:

1. Push changes to your connected Git repository.
2. Lovable builds and deploys automatically.
3. Configure your custom domain if needed.

---

## Contributing

Contributions are welcome! If you'd like to add a new source platform, improve the scrapers, or enhance the UI, feel free to open an issue or pull request.

---

## License

This project is open source and available under the [MIT License](LICENSE).

---

## Acknowledgments

Built with ❤️ using [Lovable](https://lovable.dev), [TanStack](https://tanstack.com), and [Supabase](https://supabase.com).

HackRadar is an independent project and is not affiliated with Devpost, Unstop, HackerEarth, Devfolio, MLH, Eventbrite, or Hack2Skill.
