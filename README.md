# My Clothing App — Enterprise Monorepo

Enterprise-grade, multi-platform e-commerce platform spanning **Next.js (Web)** and **Expo (Mobile)**, managed with **Turborepo** and **pnpm workspaces**.

## Monorepo Architecture

```text
my-clothing-app/
├── apps/
│   ├── web/                    # Next.js 15+ App Router Storefront (Web)
│   │   ├── src/
│   │   │   ├── app/            # Pages, layouts, metadata & store routes
│   │   │   ├── components/     # Web-specific UI & cart interactions
│   │   │   └── styles/         # Tailwind CSS & design tokens
│   │   ├── next.config.ts
│   │   └── package.json
│   │
│   └── mobile/                 # Expo Router App (iOS & Android) [Planned]
│       ├── app/                # File-based navigation
│       ├── components/         # Mobile primitives
│       └── package.json
│
├── packages/
│   ├── ui/                     # Shared design system components (@repo/ui)
│   ├── typescript-config/      # Shared strict tsconfig bases (@repo/typescript-config)
│   └── api-client/             # Shared typed API client & Zod schemas (@repo/api-client)
│
├── turbo.json                  # Turborepo task pipeline orchestration
├── pnpm-workspace.yaml         # Workspace linkage for pnpm
├── package.json                # Root package manifest & global scripts
└── README.md
```

## Quick Start

### Prerequisites
- Node.js >= 20.x
- pnpm >= 9.x or 10.x

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Run Next.js Web Storefront
```bash
# Run web app specifically:
pnpm --filter web dev

# Or run all workspace dev tasks via Turborepo:
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production
```bash
pnpm build
```

### 4. Lint Codebase
```bash
pnpm lint
```
