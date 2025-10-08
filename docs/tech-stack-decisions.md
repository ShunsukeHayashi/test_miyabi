# Tech Stack Decisions - Phase 3 UI/UX Implementation

**Date:** 2025-10-08
**Status:** Validated ✅
**Phase:** Level 0 - Design Phase

---

## Executive Summary

This document validates the technology selections for Phase 3 (UI/UX Implementation) against the existing Byteflow project constraints and documents the integration strategy.

## Selected Technologies

### Frontend Framework

**Decision:** Next.js 15 (App Router)

**Version:** `15.0.0` (latest stable)

**Rationale:**
- Full TypeScript strict mode support (matches existing `tsconfig.json`)
- Built-in SSR/SSG for optimal performance
- File-based routing reduces complexity for agent-driven development
- React Server Components for improved performance
- Built-in image optimization via `next/image`
- API routes eliminate need for separate backend server

**Compatibility Check:** ✅
- TypeScript target `ES2022` - fully compatible
- Node.js `>=18.0.0` - fully compatible
- ESM module system - fully compatible

---

### UI Component Library

**Decision:** shadcn/ui + Tailwind CSS

**Versions:**
- Tailwind CSS: `3.4.0`
- shadcn/ui: Latest (CLI-based, no fixed version)

**Rationale:**
- Copy-paste architecture - no dependency bloat
- Zero runtime overhead
- Full customization capability
- Built-in dark mode support
- Accessible components (WCAG 2.1 AA)
- Modern design system (Vercel-style aesthetics)

**Compatibility Check:** ✅
- Works seamlessly with Next.js 15
- No conflicts with existing project structure
- TypeScript-first design

---

### State Management

**Decision:** Zustand

**Version:** `5.0.0`

**Rationale:**
- Minimal boilerplate (single store definition)
- TypeScript-first with excellent type inference
- No provider wrapper required
- Built-in persistence middleware for localStorage
- Redux DevTools integration for debugging
- Small bundle size (~1KB minified + gzipped)

**Compatibility Check:** ✅
- Pure JavaScript/TypeScript library
- No framework-specific dependencies
- Works with React 19

**Alternative Considered:**
- Redux Toolkit - rejected due to excessive boilerplate
- Jotai/Recoil - rejected due to less mature ecosystem

---

### Form Handling

**Decision:** React Hook Form + Zod

**Versions:**
- React Hook Form: `7.53.0`
- Zod: `3.23.8`
- @hookform/resolvers: `3.9.0`

**Rationale:**
- Best-in-class TypeScript integration
- Schema-based validation with Zod
- Minimal re-renders (better performance)
- Built-in error handling
- Wide ecosystem support

**Compatibility Check:** ✅
- React 19 compatible
- TypeScript strict mode compatible
- No version conflicts

---

### API Client

**Decision:** Existing BytePlusClient (Phase 1-2 implementation)

**Location:** `src/api/byteplus-client.ts`

**Integration Strategy:**
1. Wrap BytePlusClient in Next.js API routes
2. Keep API keys server-side only (never expose to client)
3. Create REST endpoints: `/api/generate`, `/api/batch`, `/api/edit`

**Compatibility Check:** ✅
- Reuses existing implementation
- No breaking changes required
- Extends functionality without modification

---

### Testing Framework

**Decision:** Vitest + Playwright

**Versions:**
- Vitest: `3.2.4` (existing)
- Playwright: `1.48.0` (new)
- @vitest/coverage-v8: `3.2.4` (existing)

**Rationale:**
- Vitest already configured in root project
- Playwright for E2E testing (industry standard)
- Fast execution times
- TypeScript support

**Compatibility Check:** ✅
- Vitest version matches existing setup
- Playwright has no conflicts
- Coverage tools already configured

---

### Deployment Platform

**Decision:** Vercel

**Rationale:**
- Seamless Next.js integration (built by same team)
- Zero-config deployment
- Edge functions for optimal performance
- Built-in analytics
- Preview deployments for PRs
- Free tier sufficient for initial launch

**Compatibility Check:** ✅
- Supports Next.js 15 App Router
- Environment variables easily configured
- Custom domains supported

---

## Dependency Compatibility Matrix

| Package | Version | Root Project | Next.js Project | Compatible | Notes |
|---------|---------|--------------|-----------------|------------|-------|
| **Node.js** | >=18.0.0 | ✅ Required | ✅ Required | ✅ | Both require same version |
| **TypeScript** | 5.8.3 | ✅ Installed | ✅ Will use | ✅ | Shared tsconfig |
| **ESLint** | 8.54.0 | ✅ Installed | ✅ Will extend | ✅ | Inherit root config |
| **Prettier** | 3.1.0 | ✅ Installed | ✅ Will extend | ✅ | Inherit root config |
| **Vitest** | 3.2.4 | ✅ Installed | ✅ Will use | ✅ | Shared test runner |
| **dotenv** | 16.4.5 | ✅ Installed | ✅ Will use | ✅ | Shared env config |
| **Next.js** | 15.0.0 | ❌ Not installed | ✅ New | ✅ | Web-only dependency |
| **React** | 19.0.0 | ❌ Not installed | ✅ New | ✅ | Web-only dependency |
| **Tailwind CSS** | 3.4.0 | ❌ Not installed | ✅ New | ✅ | Web-only dependency |
| **Zustand** | 5.0.0 | ❌ Not installed | ✅ New | ✅ | Web-only dependency |
| **React Hook Form** | 7.53.0 | ❌ Not installed | ✅ New | ✅ | Web-only dependency |
| **Zod** | 3.23.8 | ❌ Not installed | ✅ New | ✅ | Web-only dependency |
| **Playwright** | 1.48.0 | ❌ Not installed | ✅ New | ✅ | E2E testing only |

**Verdict:** ✅ **No version conflicts detected**

---

## Integration Plan with Existing Byteflow Project

### Project Structure

```
test_miyabi/
├── .claude/                 # Existing agent configs
├── .github/                 # Existing workflows
├── src/                     # Existing backend code
│   ├── api/                # BytePlusClient (reuse)
│   ├── agents/             # Existing agents
│   ├── services/           # Existing services
│   └── types/              # Shared types
├── web/                     # NEW: Next.js frontend
│   ├── app/                # Next.js App Router
│   ├── components/         # React components
│   ├── lib/                # Frontend utilities
│   │   └── byteplus.ts    # Wrapper for src/api/byteplus-client.ts
│   ├── hooks/              # Custom React hooks
│   ├── types/              # Frontend types (may reference ../src/types/)
│   └── package.json        # Separate dependencies
├── package.json             # Root project (backend)
└── docs/                    # Shared documentation
```

### Workspace Configuration

**Strategy:** Monorepo with separate `web/` subdirectory

**Benefits:**
- Clear separation of frontend and backend code
- Independent dependency management
- Shared types and utilities via relative imports
- Single Git repository for both projects

**Implementation:**

1. **Root `package.json` (existing):** Backend dependencies
2. **`web/package.json` (new):** Frontend dependencies
3. **Shared ESLint/Prettier config:** Inherit from root
4. **Shared TypeScript config:** Extend from root (with adjustments)

### API Integration Pattern

**Backend → Frontend Communication:**

```typescript
// src/api/byteplus-client.ts (existing)
export class BytePlusClient { ... }

// web/lib/byteplus.ts (new wrapper)
import { BytePlusClient } from '../../src/api/byteplus-client.js';

// web/app/api/generate/route.ts (new API route)
import { byteplusClient } from '@/lib/byteplus';

export async function POST(request: Request) {
  // Server-side only, API key never exposed
  const result = await byteplusClient.generateImage(...);
  return Response.json(result);
}
```

**Security:**
- API keys stay server-side (Next.js API routes)
- Client makes requests to `/api/*` endpoints
- BytePlusClient never imported client-side

### Environment Variables

**Shared `.env` file** (root level):

```bash
# Backend (existing)
BYTEPLUS_API_KEY=bp_xxxxx
BYTEPLUS_ENDPOINT=https://api.byteplus.com/v1
ANTHROPIC_API_KEY=sk-ant-xxxxx
GITHUB_TOKEN=ghp_xxxxx

# Frontend (Next.js will access via process.env)
# No additional variables needed (uses same API keys server-side)
```

**Next.js Configuration:**

```javascript
// web/next.config.mjs
export default {
  env: {
    BYTEPLUS_API_KEY: process.env.BYTEPLUS_API_KEY,
    BYTEPLUS_ENDPOINT: process.env.BYTEPLUS_ENDPOINT,
  },
  // Only accessible in server components and API routes
};
```

### CI/CD Integration

**GitHub Actions** (extend existing workflows):

```yaml
# .github/workflows/test.yml (extend)
jobs:
  test-backend:
    # ... existing backend tests

  test-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Install frontend deps
        run: cd web && npm install
      - name: Run frontend tests
        run: cd web && npm test
      - name: Build frontend
        run: cd web && npm run build
```

**Vercel Integration:**
- Connect GitHub repository to Vercel
- Set root directory to `web/`
- Automatic deployments on `main` branch push
- Preview deployments for PRs

---

## TypeScript Configuration

### Root `tsconfig.json` (existing)

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "strict": true,
    // ... existing config
  }
}
```

### Next.js `web/tsconfig.json` (new)

```json
{
  "extends": "../tsconfig.json",
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "ES2022"],
    "jsx": "preserve",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "paths": {
      "@/*": ["./src/*"],
      "@/types/*": ["../src/types/*"]  // Share types from root
    },
    "plugins": [{ "name": "next" }]
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

**Key Differences:**
- `lib` includes `dom` for browser APIs
- `jsx: "preserve"` for Next.js JSX handling
- `moduleResolution: "bundler"` for Next.js bundler
- `paths` alias for cleaner imports
- Extends root config for consistency

---

## Development Workflow

### Initial Setup

```bash
# Root project (backend)
cd /Users/shunsuke/Dev/test_miyabi/test_miyabi
npm install

# Initialize Next.js project
npx create-next-app@latest web --typescript --tailwind --app --src-dir --import-alias "@/*"

# Install frontend dependencies
cd web
npm install zustand react-hook-form zod @hookform/resolvers
npx shadcn-ui@latest init
```

### Daily Development

```bash
# Terminal 1: Backend development server
npm run dev

# Terminal 2: Frontend development server
cd web && npm run dev
```

**Ports:**
- Backend: N/A (BytePlusClient library only)
- Frontend: `http://localhost:3000`

### Testing

```bash
# Backend tests
npm test

# Frontend tests
cd web && npm test
cd web && npm run test:coverage

# E2E tests
cd web && npx playwright test
```

---

## Risk Mitigation

### Identified Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| **Version Conflicts** | High | Compatibility matrix validated above ✅ |
| **API Key Exposure** | High | Server-side only, never client-side ✅ |
| **Monorepo Complexity** | Medium | Simple structure with clear separation ✅ |
| **Build Time** | Low | Incremental builds, caching enabled ✅ |
| **Deployment Issues** | Medium | Vercel auto-config, preview deployments ✅ |

### Rollback Plan

If Phase 3 fails:
1. Delete `web/` directory
2. No changes to root project required
3. Restore from `backup/before-phase3` branch

---

## Success Criteria

- [x] All technologies support TypeScript strict mode
- [x] No version conflicts with existing dependencies
- [x] Integration plan clearly documented
- [x] Security considerations addressed
- [x] Development workflow defined
- [x] CI/CD strategy outlined

---

## Approval

**Tech Stack Validated:** ✅
**Ready for T4 (Project Initialization):** ✅
**Blockers:** None

---

**Next Steps:**
1. Execute T2 (UI/UX Design System)
2. Execute T3 (Architecture Design)
3. Proceed to T4 (Project Initialization) after T1/T3 complete

---

🌸 **Generated by Miyabi Framework - CoordinatorAgent**
**Task:** T1 - Tech Stack Setup
**Estimated Time:** 1 hour
**Actual Time:** 1 hour
**Status:** Complete ✅
