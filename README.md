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

- **Node.js**: 18.0.0以上
- **npm**: 9.0.0以上
- **Git**: 最新版

### 2. Installation

```bash
# Clone repository
git clone https://github.com/ShunsukeHayashi/test_miyabi.git
cd test_miyabi

# Install dependencies (root)
npm install

# Install dependencies (web)
cd web && npm install && cd ..
```

### 3. Environment Setup

```bash
# Copy example environment file
cp .env.example .env

# Edit .env and add your API keys
nano .env
```

Required environment variables:

```bash
# BytePlus API (Required)
BYTEPLUS_API_KEY=your_byteplus_api_key
BYTEPLUS_ENDPOINT=https://ark.ap-southeast.bytepluses.com/api/v3

# Anthropic API (Optional, for agents)
ANTHROPIC_API_KEY=your_anthropic_api_key

# GitHub (Optional, for agent automation)
GITHUB_TOKEN=your_github_token
GITHUB_OWNER=your_github_username
GITHUB_REPO=test_miyabi

# JWT Secret (for web authentication)
JWT_SECRET=your_secure_random_secret_key_here
JWT_REFRESH_SECRET=your_refresh_secret_key_here
```

### 4. Run Web Application

```bash
cd web

# Development mode
npm run dev

# Build for production
npm run build
npm start

# Run tests
npm test              # Component tests
npm run test:e2e     # E2E tests
npm run test:coverage # Coverage report
```

Visit: http://localhost:3000

### 5. Run Autonomous Agents (CLI)

```bash
# Dry-run mode (no API key required)
npm run agents:parallel:exec -- --issues 59,57,56 --concurrency 3 --dry-run

# Single issue execution
npm run agents:parallel:exec -- --issue 59

# Multiple issues in parallel
npm run agents:parallel:exec -- --issues 29,30,32 --concurrency 2

# Debug mode
npm run agents:parallel:exec -- --issue 59 --log-level debug
```

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

- [ ] **Phase 4: 最適化・スケーリング** (Week 9-12) - 🚧 In Progress
  - [ ] Performance optimization
  - [ ] Vercel production deployment
  - [ ] Webhook integration
  - [ ] README documentation update
  - [ ] Cost optimization engine
  - [ ] Real-time streaming

## 📊 Project Metrics

**Implementation Statistics:**
- **Total Commits**: 11
- **Files Changed**: 141
- **Lines Added**: 23,750+
- **Lines Deleted**: 177
- **PRs Merged**: 5
- **Issues Closed**: 28+

**Test Coverage:**
- **E2E Tests**: 2 test suites
- **Component Tests**: 4 test suites
- **Coverage Target**: 80%+
- **Test Files**: 10+

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

### Common Issues

**1. "BytePlus API key is required" error**
```bash
# Make sure .env file exists and contains BYTEPLUS_API_KEY
cp .env.example .env
nano .env  # Add your API key
```

**2. "Cannot find module" errors**
```bash
# Reinstall dependencies
rm -rf node_modules web/node_modules
npm install
cd web && npm install
```

**3. Web application won't start**
```bash
# Check port availability
lsof -ti:3000 | xargs kill -9

# Restart dev server
cd web && npm run dev
```

**4. Agent execution fails**
```bash
# Use dry-run mode to test without API calls
npm run agents:parallel:exec -- --issues 59,57,56 --concurrency 3 --dry-run

# Check logs with debug mode
npm run agents:parallel:exec -- --issue 59 --log-level debug
```

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
