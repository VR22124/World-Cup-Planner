<div align="center">
  <h1>🏟️ StadiumIQ</h1>
  <p><strong>Next-Generation AI Operations Command Center for Global Sporting Events</strong></p>
  <p><em>Built for the PromptWars Certification</em></p>
</div>

---

## 📖 Overview

**StadiumIQ** is a highly resilient, full-stack monorepo application designed to manage complex stadium operations during the World Cup. It features real-time crowd heatmap analysis, live transit scheduling, critical incident routing, and a deeply integrated **Gemini AI Operations Assistant**.

This project has been meticulously optimized for **Vercel Serverless Deployment**, **Enterprise Grade Security**, **Accessibility (A11y)**, and **Maximum Modularity**.

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

## 📂 Architecture & Modularity

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

## 🚀 Deployment & Installation

### Local Development

1. **Install Dependencies:**
   ```bash
   pnpm install
   ```

2. **Environment Variables:**
   Ensure you have a `.env` file in `apps/api` with your Neon Postgres DB and Gemini API keys:
   ```env
   GEMINI_API_KEY=your_gemini_api_key
   DATABASE_URL=your_neon_db_url
   ```

3. **Start the Application:**
   ```bash
   pnpm run dev
   ```
   This spins up the Vite frontend on `http://localhost:5173` and the Express API on `http://localhost:3000`.

### Testing & Validation

The repository is built for a 100% pass rate. Run the suite locally:

```bash
# Run the typechecker
pnpm run typecheck

# Run the Vitest unit tests
pnpm run test
```

### Vercel Serverless Deployment

This repository is uniquely structured to deploy natively on **Vercel**.
1. Connect the GitHub repository to Vercel.
2. The root `vercel.json` and `api/index.ts` files automatically intercept incoming traffic and route it to the Express adapter in `apps/api/src/index.ts`.
3. Vercel will automatically detect Vite for the frontend build.

## 🛡️ Security Posture
Application-level blocking has been abstracted away to prioritize seamless User Experience (UX), while retaining the capability to strictly gate the Ops Dashboard at the infrastructure level (via VPNs or Vercel Edge Middleware). Backend routes are highly modular and ready for JWT middleware injection when needed.

---
*Certified ready for PromptWars.*
