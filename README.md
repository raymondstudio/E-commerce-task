## URL
https://sendoatelier.netlify.app


# E-commerce Task — Vite + React + TypeScript

A responsive, component-driven e-commerce storefront built with Vite, React, TypeScript, Tailwind CSS and a collection of UI primitives (shadcn/ Radix UI). This repository demonstrates a modern frontend architecture with a product catalog, product detail pages, a cart & checkout flow, and order history.

## Key features

- Product listing (Shop) and product detail pages
- Add to cart, update cart quantities, remove items
- Checkout page (UI flow) and Order History
- Cart and order state managed through React Contexts (`CartContext`, `OrderContext`)
- Client-side routing using `react-router-dom`
- Accessible UI primitives via Radix + shadcn-style components
- Responsive design with Tailwind CSS and utility-first approach
- Animations via `framer-motion` and carousel support (embla)
- Form handling with `react-hook-form` and validation helpers

## Tech stack

- React 18 + TypeScript
- Vite (dev server / build)
- Tailwind CSS
- Radix UI primitives & shadcn-style component wrappers
- React Router DOM for routing
- React Query for async data patterns (included)
- Framer Motion, Embla Carousel, Recharts for UI/visuals
- Zod for schema validation

Dependencies and dev tools are declared in `package.json`.

## Project structure (important files)

- `src/` — main application source
	- `components/` — shared UI + page components (Header, Footer, ProductCard, ProductCarousel, ui/*)
	- `context/` — `CartContext.tsx`, `OrderContext.tsx` (app state)
	- `pages/` — `Home`, `Shop`, `ProductDetail`, `Cart`, `Checkout`, `OrderHistory`, `About`, `NotFound`
	- `lib/utils.ts` — utility helpers
	- `main.tsx` / `App.tsx` — app entry and routing

## Getting started (local development)

Prerequisites

- Node.js (recommend v18+)
- npm (or pnpm / yarn) — repository contains a `bun.lockb` but package scripts are standard npm scripts

Install and run locally (PowerShell)

```powershell
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview built production bundle
npm run preview

# Run linter
npm run lint
```

The dev server launched by `npm run dev` will show the app (typically at `http://localhost:5173` unless Vite reports a different port).

## Available scripts

- `dev` — start Vite dev server
- `build` — produce a production build with Vite
- `build:dev` — build using development mode
- `preview` — preview a production build locally
- `lint` — run ESLint across the codebase

These scripts are defined in `package.json`.

## Notes on architecture & conventions

- UI: small, composable components live under `components/ui` to keep primitives reusable across pages.
- State: cart and order state is kept in React Contexts to allow global access without prop-drilling.
- Data fetching: while local demo data may be used, the repo includes `@tanstack/react-query` to support async fetching, caching and mutation patterns.
- Accessibility: Radix primitives and semantic markup are used where possible.

## Development tips

- Add components to `components/ui` when creating new reusable UI pieces.
- Keep page-level data fetching in page components (or use React Query hooks in `lib/`).
- Use TypeScript types for props and API responses; add Zod schemas for runtime validation where useful.

## Suggested next steps / enhancements

- Integrate a backend or mock API (json-server / Mirage / MSW) for product and order persistence.
- Add unit & integration tests (Jest + React Testing Library / Vitest).
- Improve checkout flow with payment gateway integration (Stripe demo mode).
- Add CI (GitHub Actions) for linting and building on push.

## Contributing

Contributions are welcome. A few guidelines:

- Fork the repo and open a pull request with clear intent and a short description.
- Keep changes small and focused; update or add tests when changing logic.
- Follow existing code style (Tailwind + TypeScript patterns) and run `npm run lint` before submitting.

## License

No license file is included in this repository. If you want to make this project open-source, consider adding an MIT or other permissive license in a `LICENSE` file.

---

If you'd like, I can also:

- Add a short usage GIF or screenshots to the README
- Add a `CONTRIBUTING.md` with guidelines
- Wire up a basic `package.json` `prepare` script or Husky for pre-commit checks

Tell me which extras you want and I'll add them!
Book me at https://raymondstudio.dev

Support my work here: https://selar.com/showlove/raymondstudio