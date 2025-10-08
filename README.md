# Byteflow - BytePlus画像生成プラットフォーム 🌸

> 超リッチな画像・動画生成体験を、数行のコードで。

**Byteflow**は、BytePlus API（SEEDREAM4、SEEDEDIT、SEEDANCE）とClaude AI（DeepSeek-R1、Skylark-pro）を活用した次世代AIビジュアルコンテンツ生成プラットフォームです。Miyabiフレームワークと10つの自律型AI Agentsにより、完全自動化された開発・デプロイ・運用を実現します。

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15.5-black.svg)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue.svg)](https://react.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)

## ✨ 主要機能

### 🎨 画像・動画生成
- **Text-to-Image**: SEEDREAM4による最大4K高品質画像生成
- **Image-to-Image**: SEEDEDITによる画像編集・スタイル転送
- **Image-to-Video**: SEEDDANCEによる動画生成（最大10秒、1080P）
- **Batch Generation**: 複数プロンプトの並列生成
- **T2T Prompt Optimization**: DeepSeek-R1/Skylark-proによる自動プロンプト最適化

### 🌐 Full-Stack Web Application
- **Next.js 15 + React 19**: 最新のReact Server Componentsを活用
- **5つの機能ページ**: Generate, Edit, Batch, History, Settings
- **JWT認証システム**: Prisma ORM + bcrypt + jose
- **状態管理**: Zustand with localStorage persistence
- **UI/UX**: shadcn/ui + Radix UI + Tailwind CSS

### 🤖 10つの自律型AI Agents
- **Miyabi Framework (7 agents)**: Coordinator, Issue, CodeGen, Review, PR, Deployment, Test
- **Specialized Agents (3 agents)**: ContentGen, ImageGen, VideoGen
- **DAGベースの並列実行**: Critical Path特定と最適化
- **識学理論準拠**: 責任の明確化、権限の委譲、階層の設計

### 🧪 Testing & Quality
- **E2Eテスト**: Playwright (navigation, text-to-image flows)
- **Component Tests**: Vitest + Testing Library
- **Coverage Reporting**: v8 coverage provider (80%+ target)
- **TypeScript Strict Mode**: 型安全性100%保証

## 📦 プロジェクト構造

```
test_miyabi/
├── src/                          # Core Agent System & API
│   ├── agents/                   # 10 Autonomous Agents
│   │   ├── base-agent.ts        # BaseAgent abstract class
│   │   ├── coordinator.ts       # DAG-based task orchestration
│   │   ├── codegen.ts           # AI-driven code generation
│   │   ├── review.ts            # Quality scoring & validation
│   │   ├── pr.ts                # Automated PR creation
│   │   ├── deployment.ts        # CI/CD automation
│   │   ├── test.ts              # Test execution & coverage
│   │   ├── issue.ts             # Issue analysis & labeling
│   │   ├── content-gen-agent.ts # T2T prompt optimization
│   │   ├── image-gen-agent.ts   # Image generation operations
│   │   └── video-gen-agent.ts   # Video generation operations
│   ├── api/                      # BytePlus API Integration
│   │   ├── byteplus-client.ts   # Core API client
│   │   ├── byteplus-ai.ts       # Unified AI interface
│   │   └── text-generation-client.ts  # T2T client
│   ├── services/                 # Business Logic
│   │   ├── prompt-optimizer.ts  # Single-step optimization
│   │   └── prompt-chain.ts      # Multi-step prompt chaining
│   ├── cli/                      # CLI Tools
│   │   ├── agent-runner.ts      # Parallel agent execution
│   │   └── index.ts             # Main CLI entry
│   ├── db/                       # Database
│   │   ├── schema.ts            # Prisma schema
│   │   └── migrations/          # SQL migrations
│   └── types/                    # TypeScript Types
├── web/                          # Next.js Application
│   ├── src/app/                  # App Router pages
│   │   ├── generate/            # Text-to-Image page
│   │   ├── edit/                # Image-to-Image page
│   │   ├── batch/               # Batch generation page
│   │   ├── history/             # Generation history
│   │   ├── settings/            # User settings
│   │   └── api/                 # API routes
│   │       ├── generate/        # Image generation API
│   │       ├── edit/            # Image editing API
│   │       ├── batch/           # Batch generation API
│   │       └── auth/            # Authentication APIs
│   ├── src/components/          # React Components
│   │   ├── custom/              # Custom components
│   │   ├── forms/               # Form components
│   │   ├── layout/              # Layout components
│   │   └── ui/                  # shadcn/ui components
│   ├── src/hooks/               # Custom React Hooks
│   ├── src/lib/                 # Utility Functions
│   ├── e2e/                     # E2E Tests (Playwright)
│   └── tests/                   # Component Tests (Vitest)
├── docs/                         # Documentation
│   ├── architecture.md          # System architecture
│   ├── design-system.md         # UI/UX design system
│   └── tech-stack-decisions.md  # Technology decisions
├── examples/                     # Demo Code
│   ├── demo-basic.ts            # Basic usage examples
│   ├── demo-optimization.ts     # T2T optimization examples
│   ├── demo-chain.ts            # Prompt chaining examples
│   └── demo-story.ts            # Story generation examples
└── .claude/                      # Claude Code Configuration
    ├── commands/                # Custom slash commands
    └── settings.json            # Claude settings
```

## 🚀 Quick Start

### 1. Prerequisites

- **Node.js**: 18.0.0以上 ([Download](https://nodejs.org/))
- **npm**: 9.0.0以上 (included with Node.js)
- **Git**: 最新版 ([Download](https://git-scm.com/))
- **BytePlus API Key**: Sign up at [BytePlus Console](https://console.byteplus.com/)

**Verify Installation**:
```bash
node --version  # Should be v18.0.0 or higher
npm --version   # Should be v9.0.0 or higher
git --version   # Should be v2.x.x or higher
```

### 2. Installation

#### Step 1: Clone Repository
```bash
git clone https://github.com/ShunsukeHayashi/test_miyabi.git
cd test_miyabi
```

#### Step 2: Install Root Dependencies
```bash
npm install

# Expected output:
# added 150+ packages in 30s
```

#### Step 3: Install Web App Dependencies
```bash
cd web
npm install

# Expected output:
# added 200+ packages in 45s

cd ..
```

### 3. Environment Configuration

#### Step 1: Create Environment Files

**For Root Project**:
```bash
# Copy example file
cp .env.example .env

# Edit with your preferred editor
nano .env  # or: vim .env, code .env
```

**For Web App**:
```bash
cd web
cp .env.local.example .env.local
nano .env.local
cd ..
```

#### Step 2: Configure API Keys

**Root `.env`** (required for CLI agents):
```bash
# BytePlus API (Required)
BYTEPLUS_API_KEY=bp_xxxxxxxxxxxxxxxxxxxxx
BYTEPLUS_ENDPOINT=https://ark.ap-southeast.bytepluses.com/api/v3/images/generations

# Anthropic API (Optional, for AI agents)
ANTHROPIC_API_KEY=sk-ant-api03-xxxxxxxxxxxxx

# GitHub (Optional, for agent automation)
GITHUB_TOKEN=ghp_xxxxxxxxxxxxx
GITHUB_OWNER=YourGitHubUsername
GITHUB_REPO=test_miyabi
```

**Web `web/.env.local`** (required for web app):
```bash
# JWT Secret - Generate with: openssl rand -base64 32
JWT_SECRET=your_secure_32_character_random_string_here_please_change

# Database (SQLite - default location)
DATABASE_URL="file:./dev.db"

# BytePlus API
BYTEPLUS_API_KEY=bp_xxxxxxxxxxxxxxxxxxxxx
BYTEPLUS_ENDPOINT=https://ark.ap-southeast.bytepluses.com/api/v3/images/generations
```

**Generate Secure JWT Secret**:
```bash
# macOS/Linux:
openssl rand -base64 32

# Or Node.js:
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Copy the output to JWT_SECRET in .env.local
```

#### Step 3: Setup Database

```bash
cd web

# Initialize Prisma database
npx prisma generate

# Create database schema
npx prisma db push

# Verify database (opens Prisma Studio GUI)
npx prisma studio
# Visit: http://localhost:5555

cd ..
```

### 4. Run Web Application

#### Development Mode

```bash
cd web
npm run dev
```

**Expected Output**:
```
  ▲ Next.js 15.5.4
  - Local:        http://localhost:3000
  - Ready in 2.3s

✓ Compiled / in 500ms
```

#### Open in Browser

Visit: **http://localhost:3000**

You should see the Byteflow homepage with:
- ✨ Header with navigation (Generate, Edit, Batch, History, Settings)
- 📊 Feature cards
- 🎨 Quick start buttons

#### First-Time Setup

1. **Create Account**:
   - Click "Sign Up" (top-right corner)
   - Enter email and password (min 8 chars, 1 uppercase, 1 number)
   - Click "Create Account"

2. **Configure API Key** (in web app):
   - Navigate to **Settings** page
   - Enter your BytePlus API Key
   - Click "Test" to verify connection
   - Save settings

3. **Generate Your First Image**:
   - Navigate to **Generate** page
   - Enter a prompt: `"A beautiful sunset over mountains, photorealistic"`
   - Select model: `SEEDREAM 4.0`
   - Click "Generate Image"
   - Wait ~8 seconds
   - Download or save to favorites!

#### Production Build

```bash
cd web

# Build optimized version
npm run build

# Start production server
npm start

# Or build and start:
npm run build && npm start
```

#### Run Tests

```bash
cd web

# Unit tests (Vitest)
npm test

# Watch mode
npm run test:watch

# E2E tests (Playwright)
npm run test:e2e

# E2E with UI
npm run test:e2e:ui

# Coverage report
npm run test:coverage
# Open: web/coverage/index.html
```

### 5. Run Autonomous Agents (CLI)

The Miyabi Framework provides 10 autonomous agents that can execute tasks automatically.

#### Basic Agent Execution

```bash
# View available commands
npm run agents:parallel:exec -- --help

# Dry-run mode (no API calls, for testing)
npm run agents:parallel:exec -- --issues 59,57,56 --concurrency 3 --dry-run

# Single issue execution
npm run agents:parallel:exec -- --issue 59

# Multiple issues in parallel
npm run agents:parallel:exec -- --issues 29,30,32 --concurrency 2

# Debug mode with verbose logging
npm run agents:parallel:exec -- --issue 59 --log-level debug
```

#### Agent Workflow Example

1. **Create GitHub Issue**:
   ```bash
   gh issue create \
     --title "Add user profile page" \
     --body "Create /profile page with user info and settings"
   ```

2. **Run Agent Pipeline**:
   ```bash
   # Replace 60 with your issue number
   npm run agents:parallel:exec -- --issue 60
   ```

3. **Monitor Progress**:
   - IssueAgent analyzes and labels issue
   - CoordinatorAgent creates DAG execution plan
   - CodeGenAgent generates code
   - ReviewAgent validates quality (80%+ score)
   - TestAgent runs tests
   - PRAgent creates Draft PR
   - DeploymentAgent deploys (if configured)

4. **Review Results**:
   ```bash
   # Check generated PR
   gh pr list

   # View agent logs
   tail -f agent-execution.log
   ```

### 6. Verify Installation

Run system verification:
```bash
npm run verify
```

**Expected Output**:
```
✓ Node.js version: v20.10.0
✓ npm version: v10.2.3
✓ TypeScript compilation: Success
✓ Web app build: Success
✓ Database connection: OK
✓ Environment variables: All required vars present
✓ API connectivity: BytePlus API reachable

✅ All checks passed! System is ready.
```

### Next Steps

1. **Explore Features**: Try all 5 pages (Generate, Edit, Batch, History, Settings)
2. **Read Documentation**: Check [docs/](./docs/) for detailed guides
3. **Try Examples**: Run code in [examples/](./examples/) folder
4. **Customize**: Modify components in `web/src/components/`
5. **Deploy**: Follow [Vercel deployment guide](#) (coming soon)

### Quick Reference Card

| Task | Command |
|------|---------|
| Start web app | `cd web && npm run dev` |
| Run tests | `cd web && npm test` |
| Build production | `cd web && npm run build` |
| Run agents | `npm run agents:parallel:exec -- --issue <num>` |
| View database | `cd web && npx prisma studio` |
| Check types | `npm run typecheck` |
| Format code | `npm run format` |
| Verify system | `npm run verify` |

## 📖 Usage Examples

### Text-to-Image Generation

```typescript
import { BytePlusClient } from './src/api/byteplus-client.js';

const client = new BytePlusClient({
  apiKey: process.env.BYTEPLUS_API_KEY!,
  endpoint: process.env.BYTEPLUS_ENDPOINT!
});

// Basic text-to-image
const result = await client.generateImage({
  model: 'seedream-4-0-250828',
  prompt: 'A beautiful sunset over mountains, photorealistic style',
  size: '2K',
  watermark: true,
  seed: 42
});

console.log(`Generated: ${result.data[0].url}`);
```

### T2T Prompt Optimization

```typescript
import { BytePlusAI } from './src/api/byteplus-ai.js';

const ai = new BytePlusAI({
  apiKey: process.env.BYTEPLUS_API_KEY!,
  endpoint: process.env.BYTEPLUS_ENDPOINT!
});

// Automatic prompt optimization
const result = await ai.generateImage(
  {
    model: 'seedream-4-0-250828',
    prompt: 'a beautiful sunset',  // Simple input
    size: '2K'
  },
  { optimizePrompt: true }  // AI enhances the prompt
);

console.log(`Optimized prompt: ${result.data[0].revised_prompt}`);
```

### Multi-Step Prompt Chaining

```typescript
import { PromptChain } from './src/services/prompt-chain.js';

const chain = new PromptChain({
  apiKey: process.env.BYTEPLUS_API_KEY!,
  endpoint: process.env.BYTEPLUS_ENDPOINT!
});

// 3-step prompt refinement
const result = await chain.execute(
  'cyberpunk city',
  [
    {
      name: 'Style Analysis',
      systemPrompt: 'Analyze and expand the cyberpunk aesthetic',
      temperature: 0.8
    },
    {
      name: 'Technical Details',
      systemPrompt: 'Add lighting, composition, camera details',
      temperature: 0.6
    },
    {
      name: 'Final Polish',
      systemPrompt: 'Refine for maximum quality',
      temperature: 0.5
    }
  ]
);

console.log('Final prompt:', result.finalPrompt);
```

### Story Generation (連続画像)

```typescript
const images = await ai.generateStory(
  'A hero\'s journey: village → forest → castle',
  3,  // 3 images
  {
    model: 'seedream-4-0-250828',
    size: '2K',
    watermark: false
  }
);

images.forEach((img, i) => {
  console.log(`Scene ${i + 1}: ${img.data[0].url}`);
});
```

### Image-to-Video Generation

```typescript
import { VideoGenAgent } from './src/agents/video-gen-agent.js';

const videoAgent = new VideoGenAgent(
  process.env.BYTEPLUS_API_KEY!,
  process.env.BYTEPLUS_ENDPOINT!
);

const result = await videoAgent.execute({
  id: 'task-1',
  title: 'Generate Product Video',
  description: 'Create a product showcase video',
  request: {
    image: 'https://example.com/product.jpg',
    prompt: 'Dynamic camera movement, professional lighting',
    resolution: '1080P',
    duration: 5,
    fixedLens: false  // Dynamic camera movement
  },
  // ... other task properties
});

console.log(`Video: ${result.output.url}`);
```

## 🏗️ Architecture

### System Overview

```mermaid
graph TB
    subgraph "User Interface"
        WEB[Next.js Web App]
        CLI[CLI Tool]
    end

    subgraph "Miyabi Framework - 10 Autonomous Agents"
        COORD[CoordinatorAgent<br/>DAG Orchestration]
        ISSUE[IssueAgent<br/>Analysis & Labeling]
        CODEGEN[CodeGenAgent<br/>AI Code Generation]
        REVIEW[ReviewAgent<br/>Quality Validation]
        PR[PRAgent<br/>PR Automation]
        DEPLOY[DeploymentAgent<br/>CI/CD]
        TEST[TestAgent<br/>Test Execution]
        CONTENT[ContentGenAgent<br/>T2T Optimization]
        IMAGE[ImageGenAgent<br/>Image Operations]
        VIDEO[VideoGenAgent<br/>Video Operations]
    end

    subgraph "API Layer"
        BYTEAI[BytePlus AI Client]
        BYTECLIENT[BytePlus Client]
        TEXTGEN[Text Generation Client]
    end

    subgraph "External Services"
        SEEDREAM[SEEDREAM4 API<br/>Image Generation]
        SEEDEDIT[SEEDEDIT API<br/>Image Editing]
        SEEDANCE[SEEDANCE API<br/>Video Generation]
        DEEPSEEK[DeepSeek-R1<br/>Text Generation]
        SKYLARK[Skylark-pro<br/>Text Generation]
        CLAUDE[Claude Sonnet 4<br/>AI Reasoning]
    end

    subgraph "Database"
        PRISMA[(Prisma ORM)]
        SQLITE[(SQLite)]
    end

    WEB --> COORD
    CLI --> COORD

    COORD --> ISSUE
    COORD --> CODEGEN
    COORD --> CONTENT
    COORD --> IMAGE
    COORD --> VIDEO

    CODEGEN --> REVIEW
    REVIEW --> TEST
    TEST --> PR
    PR --> DEPLOY

    CONTENT --> BYTEAI
    IMAGE --> BYTEAI
    VIDEO --> BYTECLIENT

    BYTEAI --> TEXTGEN
    BYTEAI --> BYTECLIENT

    BYTECLIENT --> SEEDREAM
    BYTECLIENT --> SEEDEDIT
    BYTECLIENT --> SEEDANCE

    TEXTGEN --> DEEPSEEK
    TEXTGEN --> SKYLARK

    CODEGEN --> CLAUDE
    ISSUE --> CLAUDE

    WEB --> PRISMA
    PRISMA --> SQLITE

    style COORD fill:#f9f,stroke:#333,stroke-width:4px
    style SEEDREAM fill:#9cf,stroke:#333,stroke-width:2px
    style CLAUDE fill:#fcf,stroke:#333,stroke-width:2px
```

### Data Flow - Image Generation

```mermaid
sequenceDiagram
    participant User
    participant Web as Next.js App
    participant Store as Zustand Store
    participant API as API Route
    participant Agent as ImageGenAgent
    participant BytePlus as BytePlus API
    participant DB as SQLite DB

    User->>Web: Enter prompt & click Generate
    Web->>Store: Update loading state
    Web->>API: POST /api/generate

    API->>Agent: execute(ImageGenRequest)
    Agent->>Agent: Validate input

    opt Prompt Optimization
        Agent->>BytePlus: T2T optimization request
        BytePlus-->>Agent: Enhanced prompt
    end

    Agent->>BytePlus: Generate image (SEEDREAM4)
    BytePlus-->>Agent: Image URL + metadata

    Agent->>Agent: Quality validation

    alt Quality Score >= 80
        Agent-->>API: Success response
        API->>DB: Save to history
        DB-->>API: Saved
        API-->>Web: {imageUrl, metadata}
        Web->>Store: Add to history
        Web->>User: Display image
    else Quality Score < 80
        Agent->>Agent: Retry with adjusted parameters
    end
```

### Miyabi Framework (10 Agents)

| Agent | Type | Responsibility | Tech Stack |
|-------|------|----------------|------------|
| **CoordinatorAgent** | Orchestration | DAGベースのタスク分解、Critical Path特定、並列実行制御 | Claude Sonnet 4 |
| **IssueAgent** | Analysis | Issue分析、識学理論65ラベル体系による自動分類、複雑度推定 | Claude Sonnet 4 |
| **CodeGenAgent** | Generation | AI駆動コード生成、TypeScript strict mode対応 | Claude Sonnet 4 |
| **ReviewAgent** | Quality | 静的解析、セキュリティスキャン、品質スコアリング（80点以上）| ESLint, TypeScript |
| **PRAgent** | Integration | Conventional Commits準拠、Draft PR自動作成 | GitHub CLI |
| **DeploymentAgent** | Deployment | 自動デプロイ、ヘルスチェック、自動Rollback | Vercel, Firebase |
| **TestAgent** | Testing | テスト実行、カバレッジレポート（80%+目標）| Vitest, Playwright |
| **ContentGenAgent** | Optimization | T2Tプロンプト最適化、マルチステップチェーン | DeepSeek-R1, Skylark-pro |
| **ImageGenAgent** | Generation | 画像生成オペレーション、品質検証 | SEEDREAM4, SEEDEDIT |
| **VideoGenAgent** | Generation | 動画生成オペレーション、レンダリング制御 | SEEDANCE |

### Technology Stack

**Backend:**
- **Language**: TypeScript 5.8 (strict mode)
- **Runtime**: Node.js 18+
- **AI Models**: Claude Sonnet 4, DeepSeek-R1, Skylark-pro
- **APIs**: BytePlus (SEEDREAM4, SEEDEDIT, SEEDANCE)
- **Database**: Prisma ORM + SQLite
- **Authentication**: JWT (jose) + bcrypt

**Frontend:**
- **Framework**: Next.js 15.5.4 (App Router)
- **UI Library**: React 19.2.0
- **UI Components**: shadcn/ui + Radix UI
- **Styling**: Tailwind CSS 3.4
- **State Management**: Zustand 5.0.8
- **Form Handling**: React Hook Form + Zod
- **Icons**: lucide-react

**Testing:**
- **Unit Tests**: Vitest 3.2.4
- **E2E Tests**: Playwright 1.56.0
- **Coverage**: @vitest/coverage-v8
- **Component Testing**: @testing-library/react 16.3.0

**DevOps:**
- **CI/CD**: GitHub Actions (26+ workflows)
- **CLI**: Commander.js 14.0.1
- **Terminal UI**: chalk 5.6.2 + ora 9.0.0
- **Deployment**: Vercel (planned)

## 🎯 Development Roadmap

- [x] **Phase 1: 基盤構築** (Week 1-2) - ✅ Completed
  - [x] Project initialization
  - [x] BytePlus API integration
  - [x] TypeScript type definitions
  - [x] T2T prompt optimization

- [x] **Phase 2: コア機能実装** (Week 3-5) - ✅ Completed
  - [x] Text-to-Image generation page
  - [x] Image-to-Image editing page
  - [x] Batch generation functionality
  - [x] History management system
  - [x] Settings page
  - [x] Authentication system (JWT + Prisma)

- [x] **Phase 3: 高度機能実装** (Week 6-8) - ✅ Completed
  - [x] E2E tests (Playwright)
  - [x] Component tests (Vitest)
  - [x] 10 autonomous agents
  - [x] DAG-based parallel execution
  - [x] Form components with validation

- [ ] **Phase 4: 最適化・スケーリング** (Week 9-12) - 🚧 In Progress (20% Complete)
  - [ ] Performance optimization
  - [ ] Vercel production deployment
  - [ ] Webhook integration
  - [x] README documentation update
  - [ ] Cost optimization engine
  - [ ] Real-time streaming

## 📊 Project Metrics

**Implementation Statistics:**
- **Total Commits**: 15+
- **Files Changed**: 160+
- **Lines Added**: 30,000+
- **Lines Deleted**: 200+
- **PRs Merged**: 5
- **Issues Closed**: 35+ (Phase 1: 5/5, Phase 2: 26/26, Phase 3: 4/4)

**Test Coverage:**
- **Unit Tests**: 6 auth test files (1,159+ lines, 80+ test cases)
- **E2E Tests**: 2 test suites (Playwright)
- **Component Tests**: 4 test suites (Vitest)
- **Coverage Target**: 80%+
- **Test Files**: 15+

**Code Quality:**
- **TypeScript**: Strict mode enabled
- **ESLint**: Configured with Next.js rules
- **Prettier**: Code formatting enforced
- **Quality Score**: 80%+ required by ReviewAgent

## 🎨 Web Application Features

### 1. Generate Page (`/generate`)
- Text-to-Image generation with SEEDREAM4
- Real-time generation progress
- Image preview with download
- Favorites system
- AI-enhanced prompt display

### 2. Edit Page (`/edit`)
- Image-to-Image editing
- Drag-and-drop file upload
- Before/after comparison slider
- Parameter controls (size, watermark, seed)

### 3. Batch Page (`/batch`)
- Multi-prompt parallel generation
- Progress tracking for each prompt
- Bulk download functionality
- Queue management

### 4. History Page (`/history`)
- Generation history with filters (all/image/video)
- Favorites management
- Download individual or bulk
- Clear history functionality

### 5. Settings Page (`/settings`)
- API key configuration with test button
- Default model selection (image/video)
- Default size (1K/2K/4K)
- Auto-prompt optimization toggle
- Theme selection (light/dark/system)
- History management (max items: 50/100/200/500/unlimited)

## 📚 Documentation

- [PROJECT_DEFINITION.md](./PROJECT_DEFINITION.md) - Comprehensive project definition
- [CLAUDE.md](./CLAUDE.md) - Claude Code development context
- [docs/architecture.md](./docs/architecture.md) - System architecture details
- [docs/design-system.md](./docs/design-system.md) - UI/UX design system
- [docs/tech-stack-decisions.md](./docs/tech-stack-decisions.md) - Technology decision logs
- [PHASE3_IMPLEMENTATION_PLAN.md](./PHASE3_IMPLEMENTATION_PLAN.md) - Phase 3 implementation plan
- [PHASE3_DAG.md](./PHASE3_DAG.md) - DAG-based task execution plan
- [examples/](./examples/) - Code examples and demos

## 🛠️ Custom Claude Code Commands

Available slash commands:

- `/test` - Run project tests
- `/generate-docs` - Auto-generate documentation from code
- `/create-issue` - Interactively create issues for agent execution
- `/deploy` - Execute deployment
- `/verify` - System verification (env, compile, tests)
- `/security-scan` - Security vulnerability scan
- `/agent-run` - Execute autonomous agent pipeline

## 🤝 Contributing

This project follows the **Shikigaku Theory** (識学理論) autonomous development methodology. Contributions are welcome through the agent-driven workflow:

1. **Create GitHub Issue** - Describe feature/bugfix
2. **Automatic Labeling** - IssueAgent classifies with 65-label system
3. **Agent Execution** - Run `/agent-run` to trigger pipeline
4. **Quality Check** - ReviewAgent validates (80%+ score required)
5. **Merge** - PRAgent creates Draft PR for review

### Contribution Guidelines

- Follow TypeScript strict mode
- Maintain 80%+ test coverage
- Use Conventional Commits format
- Document all public APIs
- Update CLAUDE.md for context changes

## 🐛 Troubleshooting

### Environment & Setup Issues

#### 1. "BytePlus API key is required" error

**Problem**: Missing or invalid API key configuration

**Solution**:
```bash
# Create .env file from example
cp .env.example .env

# Edit and add your API key
nano .env

# Required variables:
BYTEPLUS_API_KEY=bp_xxxxx  # Get from BytePlus Console
BYTEPLUS_ENDPOINT=https://ark.ap-southeast.bytepluses.com/api/v3/images/generations
```

**Verification**:
```bash
# Test API connection
node -e "console.log(process.env.BYTEPLUS_API_KEY ? 'API key loaded' : 'API key missing')"
```

#### 2. "Cannot find module" errors

**Problem**: Missing or corrupted dependencies

**Solution**:
```bash
# Clean install for root project
rm -rf node_modules package-lock.json
npm install

# Clean install for web app
cd web
rm -rf node_modules package-lock.json .next
npm install
cd ..

# Rebuild TypeScript
npm run build
```

#### 3. Web application won't start (Port conflicts)

**Problem**: Port 3000 already in use

**Solution**:
```bash
# Find and kill process using port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
cd web
PORT=3001 npm run dev

# Or configure in package.json:
# "dev": "next dev -p 3001"
```

#### 4. Prisma migration errors

**Problem**: Database schema mismatch

**Solution**:
```bash
cd web

# Reset database (WARNING: destroys data)
rm -f prisma/dev.db prisma/dev.db-journal
npx prisma migrate reset --force

# Or apply pending migrations
npx prisma migrate deploy

# Regenerate Prisma Client
npx prisma generate

# Verify schema
npx prisma studio  # Opens GUI at http://localhost:5555
```

### Runtime Issues

#### 5. Agent execution fails

**Problem**: Agent crashes or produces errors

**Solution**:
```bash
# Use dry-run mode (no API calls)
npm run agents:parallel:exec -- --issues 59,57,56 --concurrency 3 --dry-run

# Enable debug logging
npm run agents:parallel:exec -- --issue 59 --log-level debug

# Check for missing environment variables
npm run agents:parallel:exec -- --issue 59 --check-env

# Single-threaded execution for debugging
npm run agents:parallel:exec -- --issue 59 --concurrency 1
```

#### 6. Image generation returns 429 (Rate Limit)

**Problem**: Too many requests to BytePlus API

**Solution**:
```bash
# The client has built-in rate limiting (10 req/sec)
# Reduce concurrency for batch generation

# In your code:
const result = await batchGenerate({
  prompts: [...],
  maxConcurrency: 3,  // Reduce from 10 to 3
})

# Or wait and retry:
# The client automatically retries with exponential backoff
```

#### 7. JWT token errors

**Problem**: "Invalid token" or authentication failures

**Solution**:
```bash
# Regenerate JWT secret
cd web
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Add to .env.local:
JWT_SECRET=<generated_secret>

# Clear cookies and re-login
# In browser: DevTools > Application > Cookies > Clear All

# Verify token generation
cd web
npm run test -- tests/lib/auth/jwt.test.ts
```

### Build & Deployment Issues

#### 8. TypeScript compilation errors

**Problem**: Type errors preventing build

**Solution**:
```bash
# Check for errors
npm run typecheck

# Common fixes:
# 1. Update @types packages
npm install -D @types/node@latest @types/react@latest

# 2. Clear TypeScript cache
rm -rf node_modules/.cache web/.next

# 3. Regenerate Prisma types
cd web && npx prisma generate && cd ..

# 4. Verify tsconfig.json strict mode
# Ensure: "strict": true
```

#### 9. Next.js build fails

**Problem**: Build errors in production

**Solution**:
```bash
cd web

# Clear build cache
rm -rf .next

# Check for missing environment variables
npm run build 2>&1 | grep "Environment"

# Build with verbose logging
npm run build -- --debug

# Test production build locally
npm run build && npm start
```

#### 10. Vitest tests fail

**Problem**: Test suite errors

**Solution**:
```bash
cd web

# Run specific test file
npm test -- tests/lib/auth/jwt.test.ts

# Update snapshots if needed
npm test -- -u

# Clear test cache
rm -rf node_modules/.vitest

# Run with coverage to identify issues
npm run test:coverage
```

### API Integration Issues

#### 11. BytePlus API returns 400 (Bad Request)

**Problem**: Invalid request parameters

**Solution**:
```typescript
// Verify request format:
const request: ImageGenerationRequest = {
  model: 'seedream-4-0-250828',  // Correct model name
  prompt: 'A beautiful sunset',   // Non-empty prompt
  size: '2K',  // Valid size: '1K' | '2K' | '4K'
  watermark: true,  // Boolean, not string
  // seed: 42,  // Optional, must be number
}

// Check response for details:
try {
  const result = await client.generateImage(request);
} catch (error) {
  console.error('API Error:', error.message);
  console.error('Status:', error.statusCode);
  console.error('Details:', error.response);
}
```

#### 12. Generated images are low quality

**Problem**: Poor image quality despite good prompts

**Solution**:
```typescript
// Use T2T prompt optimization:
const ai = new BytePlusAI({ apiKey, endpoint });

const result = await ai.generateImage(
  {
    model: 'seedream-4-0-250828',
    prompt: 'your simple prompt',
    size: '4K',  // Use highest resolution
  },
  {
    optimizePrompt: true,  // Enable AI enhancement
    // Or use prompt chaining:
    useChain: true,
  }
);

// Adjust guidance scale (if supported):
// Higher values = more prompt adherence
// Lower values = more creativity
```

### Performance Issues

#### 13. Slow image generation

**Problem**: Generation takes too long

**Solution**:
```bash
# Check your internet connection:
ping api.byteplus.com

# Use batch generation with concurrency:
const results = await batchGenerate({
  prompts: [...],
  maxConcurrency: 5,  // Parallel generation
})

# Consider using lower resolution for preview:
size: '1K',  // Faster than '4K'

# Enable caching (if implemented):
# Check for duplicate prompts before generating
```

#### 14. High memory usage

**Problem**: Application crashes with OOM errors

**Solution**:
```bash
# Increase Node.js memory limit:
NODE_OPTIONS="--max-old-space-size=4096" npm run dev

# Or in package.json:
"dev": "NODE_OPTIONS='--max-old-space-size=4096' next dev"

# Clear history periodically:
# In web app: Settings > History Management > Clear History

# Limit batch size:
maxConcurrency: 3,  // Instead of 10
```

### Getting Help

If you encounter an issue not listed here:

1. **Check GitHub Issues**: https://github.com/ShunsukeHayashi/test_miyabi/issues
2. **Enable Debug Logging**: Set `DEBUG=*` environment variable
3. **Run Diagnostics**:
   ```bash
   npm run verify  # Runs system checks
   ```
4. **Collect Logs**:
   ```bash
   # Agent logs
   npm run agents:parallel:exec -- --issue 59 --log-level debug > agent.log 2>&1

   # Web app logs
   cd web && npm run dev > server.log 2>&1
   ```
5. **Create Issue**: Include logs, environment details, and reproduction steps

## 📄 License

MIT License - See [LICENSE](./LICENSE) file for details

## 🙏 Acknowledgments

- **BytePlus** - For powerful image/video generation APIs
- **Anthropic** - For Claude AI and advanced reasoning capabilities
- **Miyabi Framework** - For autonomous agent orchestration
- **识学理論 (Shikigaku Theory)** - For organizational principles

## 📞 Support

- **Issues**: https://github.com/ShunsukeHayashi/test_miyabi/issues
- **Documentation**: See [docs/](./docs/) folder
- **Examples**: See [examples/](./examples/) folder

---

🌸 **Byteflow** - Beauty in AI-Powered Visual Creation

*Powered by Miyabi Framework | Built with Claude Code | Phase 1-3 Complete*

**Status**: ✅ Production Ready | 🚧 Phase 4 In Progress
