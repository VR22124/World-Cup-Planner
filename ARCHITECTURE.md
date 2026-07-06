# StadiumIQ Architecture

This document provides a high-level overview of the StadiumIQ application architecture, design patterns, and critical technical decisions.

## System Overview

StadiumIQ is a highly scalable, real-time command center application built to manage stadium operations during major global sporting events like the World Cup. It leverages modern web technologies and a sophisticated AI backend to deliver actionable insights based on live simulated data.

## Monorepo Structure

The project utilizes a Turborepo-inspired monorepo structure, strictly isolating domains for maximum modularity and reusability:

- `apps/web/`: The React 19 Frontend (Vite)
- `apps/api/`: The Express.js Backend and Gemini AI services
- `packages/api-client-react/`: Auto-generated Orval React Query hooks for seamless typed API fetching
- `packages/api-zod/`: Auto-generated Zod validation schemas
- `packages/api-spec/`: OpenAPI specification defining the contract between frontend and backend
- `packages/db/`: Database schemas and ORM (Drizzle) configurations

## Backend Architecture (apps/api)

The backend is built with Express.js and is strictly optimized for **Vercel Serverless Functions**.

### Serverless Routing (`api/index.ts`)
To bridge the gap between traditional Node/Express server architectures and Serverless execution, a lightweight adapter sits at the root of the repository (`/api/index.ts`). This file imports the configured Express app and exposes it as a default export, which Vercel's `@vercel/node` builder maps to serverless endpoints.

### Simulation Engine (`apps/api/src/services/simulator/`)
The core data engine for StadiumIQ is a real-time Simulator. Originally a monolith, it has been refactored into distinct cohesive modules:
1. **`core.ts`**: Handles seeded randomness, shared utilities, and types.
2. **`match.ts`**: Calculates match phases, scores, and weather elements.
3. **`crowd.ts`**: Models gate congestion, sector heatmaps, and total attendance dynamically.
4. **`transport.ts`**: Simulates inbound/outbound transit delays.
5. **`incidents.ts`**: Spawns critical emergency alerts and routes them to operations.

### AI Integration (`apps/api/src/services/aiService.ts`)
StadiumIQ leverages the Gemini API. The AI Service dynamically injects live JSON context from the Simulator Engine (gate status, live heatmaps, incident queues) directly into the AI's system prompt. This ensures the AI does not hallucinate and generates pinpoint accurate operational recommendations based on current real-world constraints.

## Frontend Architecture (apps/web)

Built with **React 19** and **Vite**, utilizing a component-based architecture powered by Shadcn UI.

### State Management
State is managed exclusively via **TanStack React Query**, utilizing the auto-generated hooks from `packages/api-client-react/`. This guarantees perfectly typed requests and responses.

### Accessibility (A11y)
Accessibility is heavily prioritized across all critical user interfaces:
- **Ops Dashboard**: Utilizes `role="alert"` and `aria-live="assertive"` to ensure incoming critical incidents are immediately announced by screen readers.
- **AI Chat Widget**: Implemented with `role="dialog"` and explicit `aria-label`s on all interactive elements to prevent keyboard traps and guarantee context.

## Testing Strategy

The repository utilizes **Vitest** for all testing requirements.
- **Frontend Unit Tests**: React Testing Library renders components via `jsdom`, testing UI states (e.g., Header rendering, Chat Widget interactivity). API hooks are explicitly mocked to isolate UI behavior.
- **Backend Unit Tests**: Critical path business logic (such as the AI Context generator) is tested to ensure accurate data extraction and injection.

The test suite is verified via `pnpm run test` and `pnpm run typecheck` across all workspace applications.
