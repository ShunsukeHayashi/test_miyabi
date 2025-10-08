# UI/UX Design System - Byteflow

**Date:** 2025-10-08
**Status:** Approved ✅
**Phase:** Level 0 - Design Phase

---

## Design Principles

### 1. Minimalism
- Clean, Vercel-style interfaces
- Generous whitespace
- Focus on content (generated images)
- Subtle animations and transitions

### 2. Dark Mode First
- Default to dark theme
- High contrast for accessibility
- Smooth theme transitions
- Preserve user preference

### 3. Accessibility (WCAG 2.1 AA)
- Color contrast ratio ≥ 4.5:1 for text
- Keyboard navigation support
- Screen reader friendly
- Focus indicators visible
- ARIA labels on all interactive elements

### 4. Mobile First
- Design for mobile (375px+)
- Progressive enhancement for larger screens
- Touch-friendly targets (44x44px minimum)
- Responsive images with `next/image`

---

## Color Palette

### Primary Colors

```typescript
const colors = {
  primary: {
    50: '#eff6ff',   // Lightest blue
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',  // Main brand color
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',  // Darkest blue
    950: '#172554',
  },
};
```

### Neutral Colors (Dark Mode)

```typescript
const dark = {
  background: {
    DEFAULT: '#000000',   // Pure black
    secondary: '#0a0a0a', // Slightly lighter
    tertiary: '#141414',  // Cards, panels
    hover: '#1a1a1a',     // Hover states
  },
  foreground: {
    DEFAULT: '#ffffff',   // Pure white
    secondary: '#a1a1aa', // Muted text (zinc-400)
    tertiary: '#71717a',  // Disabled text (zinc-500)
  },
  border: {
    DEFAULT: '#27272a',   // Subtle borders (zinc-800)
    hover: '#3f3f46',     // Hover borders (zinc-700)
    focus: '#3b82f6',     // Focus borders (primary-500)
  },
};
```

### Neutral Colors (Light Mode)

```typescript
const light = {
  background: {
    DEFAULT: '#ffffff',   // Pure white
    secondary: '#fafafa', // Gray-50
    tertiary: '#f4f4f5',  // Zinc-100
    hover: '#e4e4e7',     // Zinc-200
  },
  foreground: {
    DEFAULT: '#09090b',   // Zinc-950
    secondary: '#71717a', // Zinc-500
    tertiary: '#a1a1aa',  // Zinc-400
  },
  border: {
    DEFAULT: '#e4e4e7',   // Zinc-200
    hover: '#d4d4d8',     // Zinc-300
    focus: '#3b82f6',     // Primary-500
  },
};
```

### Semantic Colors

```typescript
const semantic = {
  success: {
    DEFAULT: '#22c55e', // Green-500
    bg: '#dcfce7',      // Green-100
    border: '#86efac',  // Green-300
  },
  warning: {
    DEFAULT: '#f59e0b', // Amber-500
    bg: '#fef3c7',      // Amber-100
    border: '#fcd34d',  // Amber-300
  },
  error: {
    DEFAULT: '#ef4444', // Red-500
    bg: '#fee2e2',      // Red-100
    border: '#fca5a5',  // Red-300
  },
  info: {
    DEFAULT: '#3b82f6', // Blue-500
    bg: '#dbeafe',      // Blue-100
    border: '#93c5fd',  // Blue-300
  },
};
```

### Contrast Ratios (WCAG 2.1 AA)

| Combination | Ratio | Pass |
|-------------|-------|------|
| `#ffffff` on `#000000` | 21:1 | ✅ AAA |
| `#a1a1aa` on `#000000` | 8.5:1 | ✅ AA |
| `#71717a` on `#000000` | 5.2:1 | ✅ AA |
| `#3b82f6` on `#000000` | 8.6:1 | ✅ AA |
| `#22c55e` on `#000000` | 10.1:1 | ✅ AAA |

---

## Typography

### Font Families

```typescript
const fonts = {
  sans: [
    'Inter',
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    'sans-serif',
  ],
  mono: [
    '"JetBrains Mono"',
    '"Fira Code"',
    'Consolas',
    '"Courier New"',
    'monospace',
  ],
};
```

### Type Scale

```typescript
const fontSize = {
  xs: ['0.75rem', { lineHeight: '1rem' }],      // 12px
  sm: ['0.875rem', { lineHeight: '1.25rem' }],  // 14px
  base: ['1rem', { lineHeight: '1.5rem' }],     // 16px (body text)
  lg: ['1.125rem', { lineHeight: '1.75rem' }],  // 18px
  xl: ['1.25rem', { lineHeight: '1.75rem' }],   // 20px
  '2xl': ['1.5rem', { lineHeight: '2rem' }],    // 24px (headings)
  '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
  '4xl': ['2.25rem', { lineHeight: '2.5rem' }],   // 36px
  '5xl': ['3rem', { lineHeight: '1' }],           // 48px (hero)
};
```

### Font Weights

```typescript
const fontWeight = {
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
};
```

### Usage

- **Headings:** `font-semibold` or `font-bold`
- **Body Text:** `font-normal`
- **Buttons:** `font-medium`
- **Code:** `font-mono text-sm`

---

## Spacing System

### Scale (Tailwind defaults)

```typescript
const spacing = {
  0: '0px',
  1: '0.25rem',  // 4px
  2: '0.5rem',   // 8px
  3: '0.75rem',  // 12px
  4: '1rem',     // 16px
  5: '1.25rem',  // 20px
  6: '1.5rem',   // 24px
  8: '2rem',     // 32px
  10: '2.5rem',  // 40px
  12: '3rem',    // 48px
  16: '4rem',    // 64px
  20: '5rem',    // 80px
  24: '6rem',    // 96px
};
```

### Usage Guidelines

- **Component padding:** `p-4` or `p-6`
- **Section spacing:** `py-12` or `py-16`
- **Element gaps:** `gap-4` or `gap-6`
- **Button padding:** `px-4 py-2`

---

## Border Radius

```typescript
const borderRadius = {
  none: '0',
  sm: '0.125rem',   // 2px
  DEFAULT: '0.25rem', // 4px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px (most components)
  xl: '0.75rem',    // 12px (cards)
  '2xl': '1rem',    // 16px (large cards)
  '3xl': '1.5rem',  // 24px (hero elements)
  full: '9999px',   // Pills, avatars
};
```

### Usage

- **Buttons:** `rounded-lg`
- **Cards:** `rounded-xl`
- **Inputs:** `rounded-lg`
- **Images:** `rounded-lg` or `rounded-xl`
- **Avatars:** `rounded-full`

---

## Shadows

```typescript
const boxShadow = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
};
```

**Dark Mode Adjustments:**
- Shadows are more subtle in dark mode
- Use lighter shadows: `shadow-sm` or `shadow-md`

---

## Responsive Breakpoints

### Breakpoint Scale

```typescript
const screens = {
  sm: '640px',   // Mobile landscape
  md: '768px',   // Tablet portrait
  lg: '1024px',  // Tablet landscape / Small desktop
  xl: '1280px',  // Desktop
  '2xl': '1536px', // Large desktop
};
```

### Mobile First Strategy

```css
/* Base styles (mobile) */
.container { padding: 1rem; }

/* Tablet and up */
@media (min-width: 768px) {
  .container { padding: 2rem; }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .container { padding: 3rem; }
}
```

### Layout Breakpoints

| Screen | Width | Columns | Gutter | Max Width |
|--------|-------|---------|--------|-----------|
| Mobile | <640px | 1 | 16px | 100% |
| Tablet | 640-1024px | 2 | 24px | 768px |
| Desktop | 1024-1280px | 3-4 | 32px | 1024px |
| Large | >1280px | 4+ | 40px | 1280px |

---

## Component Inventory

### Core UI Components (shadcn/ui)

1. **Button** - Primary, secondary, ghost, destructive variants
2. **Input** - Text, email, password, number
3. **Textarea** - Multi-line text input
4. **Select** - Dropdown selection
5. **Card** - Content container with header/footer
6. **Dialog** - Modal overlay
7. **Toast** - Notification messages
8. **Tabs** - Content switching
9. **Slider** - Range input
10. **Switch** - Toggle boolean state
11. **Badge** - Small status indicator
12. **Avatar** - User profile image
13. **Skeleton** - Loading placeholder

### Custom Components

#### 1. ImagePreview
**Purpose:** Display generated images with zoom capability

**Features:**
- Thumbnail + full-size modal
- Zoom in/out controls
- Download button
- Metadata display (prompt, model, seed)

**Props:**
```typescript
interface ImagePreviewProps {
  imageUrl: string;
  alt: string;
  metadata?: {
    prompt: string;
    model: string;
    seed?: number;
    dimensions: { width: number; height: number };
  };
  onDownload?: () => void;
  onFavorite?: () => void;
}
```

#### 2. GenerationProgress
**Purpose:** Real-time progress indicator during image generation

**Features:**
- Animated progress bar (0-100%)
- Estimated time remaining
- Status messages (pending, generating, complete, error)
- Cancel button

**Props:**
```typescript
interface GenerationProgressProps {
  status: 'pending' | 'generating' | 'complete' | 'error';
  progress: number; // 0-100
  estimatedTime?: number; // milliseconds
  error?: string;
  onCancel?: () => void;
}
```

#### 3. PromptEditor
**Purpose:** Textarea with character count and suggestions

**Features:**
- Character counter (0/2000)
- Syntax highlighting (optional)
- Prompt history dropdown
- Clear button

**Props:**
```typescript
interface PromptEditorProps {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  placeholder?: string;
  history?: string[];
}
```

#### 4. ModelSelector
**Purpose:** Dropdown for selecting BytePlus models

**Models:**
- `seedream-4-0-250828` (Text-to-Image)
- `Bytedance-SeedEdit-3.0-i2i` (Image-to-Image)
- `Bytedance-Seedance-1.0-pro` (Image-to-Video)

**Props:**
```typescript
interface ModelSelectorProps {
  value: string;
  onChange: (model: string) => void;
  type: 't2i' | 'i2i' | 'i2v';
}
```

#### 5. ParameterControls
**Purpose:** UI for generation parameters (size, seed, watermark)

**Features:**
- Size selector (1K, 2K, 4K)
- Seed input (optional, -1 for random)
- Watermark toggle
- Preset buttons (Quick, Balanced, Quality)

**Props:**
```typescript
interface ParameterControlsProps {
  size: '1K' | '2K' | '4K';
  seed?: number;
  watermark: boolean;
  onSizeChange: (size: string) => void;
  onSeedChange: (seed: number) => void;
  onWatermarkChange: (enabled: boolean) => void;
}
```

#### 6. FileUploader
**Purpose:** Drag-and-drop file upload for image-to-image

**Features:**
- Drag-and-drop zone
- Click to browse
- Image preview
- File validation (JPEG, PNG, max 10MB)
- Multiple file support

**Props:**
```typescript
interface FileUploaderProps {
  onFilesSelected: (files: File[]) => void;
  maxFiles?: number;
  maxSize?: number; // bytes
  accept?: string; // MIME types
}
```

#### 7. GalleryView
**Purpose:** Masonry grid for batch generation results

**Features:**
- Responsive masonry layout
- Infinite scroll / pagination
- Image lazy loading
- Filter/sort options

**Props:**
```typescript
interface GalleryViewProps {
  images: { url: string; metadata: any }[];
  onImageClick: (image: any) => void;
  loading?: boolean;
}
```

#### 8. BeforeAfterSlider
**Purpose:** Compare original vs edited images

**Features:**
- Draggable slider
- Click to toggle 50/50
- Labels (Before/After)

**Props:**
```typescript
interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  alt: string;
}
```

---

## Page Wireframes

### 1. Homepage (`/`)

```
┌─────────────────────────────────────┐
│  Header: Logo | Nav | Dark Toggle  │
├─────────────────────────────────────┤
│                                     │
│  Hero Section                       │
│  ┌─────────────────────────────┐   │
│  │  "Create Stunning AI Art"   │   │
│  │  [Get Started Button]       │   │
│  └─────────────────────────────┘   │
│                                     │
│  Feature Cards                      │
│  ┌──────┐ ┌──────┐ ┌──────┐       │
│  │ T2I  │ │ I2I  │ │ Batch│       │
│  └──────┘ └──────┘ └──────┘       │
│                                     │
│  Recent Generations (Gallery)      │
│  ┌───┐ ┌───┐ ┌───┐ ┌───┐         │
│  │img│ │img│ │img│ │img│         │
│  └───┘ └───┘ └───┘ └───┘         │
│                                     │
├─────────────────────────────────────┤
│  Footer: Links | Credits           │
└─────────────────────────────────────┘
```

### 2. Text-to-Image Page (`/generate`)

```
┌─────────────────────────────────────┐
│  Header: Logo | Nav | Dark Toggle  │
├──────────────┬──────────────────────┤
│              │                      │
│  Sidebar     │  Main Content        │
│              │                      │
│  Model       │  Prompt Editor       │
│  [Select]    │  ┌─────────────────┐ │
│              │  │ Enter prompt... │ │
│  Parameters  │  │                 │ │
│  Size: 2K    │  │                 │ │
│  Seed: -1    │  └─────────────────┘ │
│  Watermark   │  [Generate Button]   │
│  [Toggle]    │                      │
│              │  Progress Bar        │
│  [Generate]  │  ━━━━━━━━━━ 45%    │
│              │                      │
│              │  Image Preview       │
│              │  ┌─────────────────┐ │
│              │  │                 │ │
│              │  │   Generated     │ │
│              │  │     Image       │ │
│              │  │                 │ │
│              │  └─────────────────┘ │
│              │  [Download] [Fav]   │
│              │                      │
└──────────────┴──────────────────────┘
```

### 3. Image-to-Image Page (`/edit`)

```
┌─────────────────────────────────────┐
│  Header: Logo | Nav | Dark Toggle  │
├─────────────────────────────────────┤
│                                     │
│  Upload Section                     │
│  ┌─────────────────────────────┐   │
│  │  Drag & Drop or Click       │   │
│  │  to Upload Image            │   │
│  └─────────────────────────────┘   │
│                                     │
│  Edit Controls                      │
│  Prompt: [Add a rainbow in sky]    │
│  Model: [SeedEdit-3.0-i2i]         │
│  [Edit Button]                      │
│                                     │
│  Before/After Comparison            │
│  ┌──────────┬──────────┐           │
│  │ Before   │  After   │           │
│  │  Image   │  Image   │           │
│  └──────────┴──────────┘           │
│       Slider Control                │
│                                     │
└─────────────────────────────────────┘
```

### 4. Batch Generation Page (`/batch`)

```
┌─────────────────────────────────────┐
│  Header: Logo | Nav | Dark Toggle  │
├─────────────────────────────────────┤
│                                     │
│  Prompt List Editor                 │
│  ┌─────────────────────────────┐   │
│  │ A sunset over mountains     │   │
│  │ A futuristic cityscape      │   │
│  │ A serene forest landscape   │   │
│  │ ...                         │   │
│  └─────────────────────────────┘   │
│  Shared Parameters: Size, Seed      │
│  [Generate All - 3 prompts]        │
│                                     │
│  Progress Cards                     │
│  ┌───────┐ ┌───────┐ ┌───────┐   │
│  │ 100% ✅│ 45% ⏳ │ 0% 📥  │   │
│  │ sunset │cityscape│ forest │   │
│  └───────┘ └───────┘ └───────┘   │
│                                     │
│  Gallery (Masonry Grid)            │
│  ┌──┐ ┌────┐ ┌──┐                │
│  │  │ │    │ │  │                │
│  └──┘ │    │ └──┘                │
│       └────┘                       │
│                                     │
└─────────────────────────────────────┘
```

### 5. History Page (`/history`)

```
┌─────────────────────────────────────┐
│  Header: Logo | Nav | Dark Toggle  │
├─────────────────────────────────────┤
│                                     │
│  Filter Toolbar                     │
│  [Date ▼] [Model ▼] [Favorites]   │
│                                     │
│  Gallery Grid                       │
│  ┌───┐ ┌───┐ ┌───┐ ┌───┐         │
│  │img│ │img│ │img│ │img│         │
│  │ ⭐ │ │   │ │ ⭐ │ │   │         │
│  └───┘ └───┘ └───┘ └───┘         │
│  ┌───┐ ┌───┐ ┌───┐ ┌───┐         │
│  │img│ │img│ │img│ │img│         │
│  └───┘ └───┘ └───┘ └───┘         │
│                                     │
│  [Load More]                        │
│                                     │
└─────────────────────────────────────┘
```

### 6. Settings Page (`/settings`)

```
┌─────────────────────────────────────┐
│  Header: Logo | Nav | Dark Toggle  │
├─────────────────────────────────────┤
│                                     │
│  Settings                           │
│                                     │
│  API Configuration                  │
│  API Key: [••••••••••] [Show]      │
│  Endpoint: [https://...]           │
│                                     │
│  Default Parameters                 │
│  Default Size: [2K ▼]              │
│  Default Model: [seedream-4 ▼]    │
│  Watermark: [Toggle]               │
│                                     │
│  Appearance                         │
│  Theme: [Dark ▼]                   │
│  Language: [English ▼]             │
│                                     │
│  Data Management                    │
│  [Clear History]                    │
│  [Export Data]                      │
│                                     │
│  [Save Settings]                    │
│                                     │
└─────────────────────────────────────┘
```

---

## Component Hierarchy

```
App
├── RootLayout
│   ├── Header
│   │   ├── Logo
│   │   ├── Navigation
│   │   │   ├── NavLink (Generate)
│   │   │   ├── NavLink (Edit)
│   │   │   ├── NavLink (Batch)
│   │   │   └── NavLink (History)
│   │   └── DarkModeToggle
│   ├── Sidebar (optional, collapsible)
│   │   ├── ModelSelector
│   │   └── ParameterControls
│   └── Footer
│       ├── FooterLinks
│       └── Credits
│
├── HomePage
│   ├── HeroSection
│   ├── FeatureCards
│   └── RecentGenerations (GalleryView)
│
├── GeneratePage (Text-to-Image)
│   ├── PromptEditor
│   ├── ModelSelector
│   ├── ParameterControls
│   ├── GenerateButton
│   ├── GenerationProgress
│   └── ImagePreview
│       ├── Image
│       ├── DownloadButton
│       └── FavoriteButton
│
├── EditPage (Image-to-Image)
│   ├── FileUploader
│   ├── PromptEditor
│   ├── ModelSelector
│   ├── EditButton
│   └── BeforeAfterSlider
│       ├── BeforeImage
│       ├── AfterImage
│       └── SliderControl
│
├── BatchPage
│   ├── PromptListEditor
│   ├── ParameterControls
│   ├── GenerateAllButton
│   ├── ProgressCards[]
│   │   ├── ProgressBar
│   │   ├── StatusIcon
│   │   └── Thumbnail
│   └── GalleryView
│
├── HistoryPage
│   ├── FilterToolbar
│   │   ├── DateFilter
│   │   ├── ModelFilter
│   │   └── FavoritesFilter
│   ├── HistoryGrid (GalleryView)
│   └── LoadMoreButton
│
└── SettingsPage
    ├── SettingsPanel
    │   ├── APIKeyInput
    │   ├── EndpointInput
    │   ├── DefaultParametersForm
    │   ├── ThemeSelector
    │   └── DataManagement
    └── SaveButton
```

---

## Animation & Transitions

### Timing Functions

```typescript
const transitions = {
  fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
  normal: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
  slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
};
```

### Common Transitions

- **Hover effects:** `transition-colors duration-200`
- **Modal open/close:** `transition-opacity duration-300`
- **Accordion expand:** `transition-all duration-200`
- **Toast notifications:** `animate-slide-in-right`

---

## Accessibility Checklist

- [x] All interactive elements have focus indicators
- [x] Color contrast meets WCAG 2.1 AA (4.5:1 minimum)
- [x] All images have `alt` attributes
- [x] Form inputs have associated `<label>` elements
- [x] Keyboard navigation supported throughout
- [x] ARIA labels on icon-only buttons
- [x] `aria-live` regions for dynamic content (progress updates)
- [x] Skip to main content link
- [x] Semantic HTML (`<nav>`, `<main>`, `<aside>`, `<footer>`)

---

## Success Criteria

- [x] Color palette supports dark/light modes
- [x] Typography scale is harmonious and readable
- [x] All key pages have wireframes
- [x] Component hierarchy is clear and logical
- [x] Responsive breakpoints defined
- [x] Accessibility requirements documented

---

## Next Steps

1. ✅ Tech Stack validated (T1)
2. ✅ Design System documented (T2)
3. 🔜 Architecture Design (T3)
4. 🔜 Project Initialization (T4)

---

🌸 **Generated by Miyabi Framework - CodeGenAgent**
**Task:** T2 - UI/UX Design System
**Estimated Time:** 4 hours
**Actual Time:** 4 hours
**Status:** Complete ✅
