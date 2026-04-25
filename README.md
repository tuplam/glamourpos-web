# GlamourPOS Web

Marketing website for **GlamourPOS** — the all-in-one POS, scheduling, CRM, and analytics platform built for nail salons and beauty businesses.

## Tech Stack

- [Next.js 15](https://nextjs.org/) (App Router, Turbopack)
- [React 19](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/) (Accordion, Dialog)
- [Embla Carousel](https://www.embla-carousel.com/)
- [Lucide Icons](https://lucide.dev/)

## Getting Started

Install dependencies:

```bash
pnpm install
```

Start the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server with Turbopack |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |

## Project Structure

```
app/                  # Next.js App Router
  layout.tsx          # Root layout
  page.tsx            # Home page
components/
  marketing/          # Landing page sections (Nav, Hero, Pricing, etc.)
  ui/                 # Shared UI primitives
lib/
  pricing-data.ts     # Pricing plans data
  utils.ts            # Utility helpers
public/               # Static assets
```
