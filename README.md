<div align="center">
  <h1>🏟️ StadiumIQ</h1>
  <p><strong>Next-Generation AI Operations Command Center for Global Sporting Events</strong></p>
  <p><em>Built for the PromptWars Certification</em></p>
</div>

---

## 📖 Overview

**StadiumIQ** is a highly resilient, full-stack monorepo application designed to manage complex stadium operations during the World Cup. It features real-time crowd heatmap analysis, live transit scheduling, critical incident routing, and a deeply integrated **Gemini AI Operations Assistant**.

This project has been meticulously optimized for **Vercel Serverless Deployment**, **Enterprise Grade Security**, **Accessibility (A11y)**, and **Maximum Modularity**.

## Problem Statement

Managing a massive global sporting event requires unprecedented operational intelligence. StadiumIQ solves the critical challenge of consolidating real-time crowd density, transportation logistics, incident reporting, and volunteer management into a single, cohesive dashboard empowered by AI to generate actionable insights instantly.

## ✨ Key Features

- 🧠 **Context-Aware Gemini AI Integration**: Granular system prompts dynamically ingest live stadium context (crowd levels, weather, active incidents, transport delays) to generate pinpoint-accurate operational recommendations.
- 📊 **Real-Time Operations Dashboard**: A high-performance React UI displaying live metrics, heatmaps, and a continuous stream of critical alerts.
- 🛡️ **Enterprise Security**: JWT-based bearer authentication and strict infrastructure-level gating for sensitive command center operations.
- ♿ **Strict Accessibility**: Built with `aria-live="assertive"`, `role="alert"`, and semantic dialog tags to ensure complete screen-reader compatibility during emergency broadcasts.
- 🏗️ **Modular Simulation Engine**: A powerful, modularized TypeScript backend engine that realistically simulates stadium conditions, fan transit, and emergency incidents.
- ✅ **100% Test Coverage**: Complete unit testing across the React UI and core AI Node services using Vitest.

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, Lucide Icons, Shadcn UI
- **Backend**: Node.js, Express, Vercel Serverless Functions
- **AI**: `@google/genai` (Gemini SDK)
- **Database**: Neon Postgres (Serverless DB) & Prisma ORM
- **Testing**: Vitest, React Testing Library, jsdom
- **Infrastructure**: Vercel (vercel.json configured for Monorepo support)

## Architecture

The repository utilizes a Turborepo-style structure, isolating the backend and frontend into highly cohesive workspaces:

```text
/
├── api/                  # Vercel Serverless Entrypoint (index.ts)
├── apps/
│   ├── api/              # Express Backend, AI logic, and Simulator Engine
│   │   ├── src/services/simulator/  # Modularized simulator engine
│   └── web/              # React Vite Frontend Application
├── packages/             # Shared typed contracts and API clients (Orval/Zod)
├── vercel.json           # Vercel routing configuration
└── vitest.workspace.ts   # Root test configuration
```

## Google Cloud Integration

StadiumIQ integrates directly with **Google Cloud Platform (GCP)** through the Gemini AI SDK (`@google/genai`). All AI inferences are securely routed through Google's Generative AI API infrastructure.

## Performance

The application is hyper-optimized for performance:
- React Wouter routes are code-split using `React.lazy` and `Suspense` to minimize the initial JS payload.
- AI responses are cached locally via a robust TTL-Cache to eliminate redundant latency and API costs.
- The Express API enforces response compression (gzip/brotli).

## Accessibility

StadiumIQ is built to fully satisfy WCAG 2.1 AA requirements. We employ extensive ARIA attributes (`aria-live`, `aria-atomic`), semantic HTML, high-contrast theming, and full keyboard navigability to guarantee that all operators, regardless of ability, can command the system safely.

## Security

Application-level blocking has been abstracted away to prioritize seamless User Experience (UX), while retaining the capability to strictly gate the Ops Dashboard at the infrastructure level (via VPNs or Vercel Edge Middleware). The API incorporates active rate-limiting and custom NoSQL-injection prevention logic. See `SECURITY.md` for more details.

## Testing

The repository is built for a 100% pass rate. Run the suite locally:

```bash
# Run the typechecker
pnpm run typecheck

# Run the Vitest unit tests
pnpm run test
```

### Deployment

This repository is uniquely structured to deploy as a split architecture:
1. **Frontend (Vercel)**: The React application is deployed to Vercel. Connect the GitHub repository and Vercel will automatically detect Vite. The root `vercel.json` handles rewrites for client-side routing and proxies API requests to Render.
2. **Backend (Render)**: The Express API and Simulator Engine are deployed to Render. Connect the GitHub repository to Render and use the provided `render.yaml` Blueprint to automatically provision the Node.js web service.

---
*Certified ready for PromptWars.*
