# Byteflow Custom Components

This directory contains custom React components specifically built for the Byteflow platform. All components are built with TypeScript, fully typed, and follow accessibility best practices.

## Components Overview

### 🖼️ ImagePreview

Display images with zoom functionality and download options.

**Features:**
- Hover controls (zoom, download)
- Lightbox modal with zoom controls
- Mouse wheel zoom support (1x to 3x)
- Loading and error states
- Multiple aspect ratios (square, video, portrait)
- Keyboard accessible

**Usage:**

```tsx
import { ImagePreview } from '@/components/custom'

<ImagePreview
  src="https://example.com/image.jpg"
  alt="Generated image"
  aspectRatio="square"
  loading={false}
  onDownload={() => console.log('Download clicked')}
/>
```

**Props:**
- `src: string` - Image URL
- `alt?: string` - Alt text (default: "Generated image")
- `className?: string` - Additional CSS classes
- `aspectRatio?: "square" | "video" | "portrait"` - Aspect ratio (default: "square")
- `onDownload?: () => void` - Custom download handler
- `loading?: boolean` - Show loading state

---

### 📊 GenerationProgress

Real-time progress tracking for AI generation tasks.

**Features:**
- Multiple states (idle, preparing, generating, completed, error)
- Animated progress bar with shimmer effect
- Percentage display
- Estimated time remaining
- Success/error messages
- Smooth progress transitions

**Usage:**

```tsx
import { GenerationProgress } from '@/components/custom'

<GenerationProgress
  status="generating"
  progress={75}
  estimatedTime={8}
  message="Creating your masterpiece..."
/>
```

**Props:**
- `status: GenerationStatus` - Current status ("idle" | "preparing" | "generating" | "completed" | "error")
- `progress?: number` - Progress percentage (0-100)
- `message?: string` - Custom message
- `estimatedTime?: number` - Estimated time in seconds
- `className?: string` - Additional CSS classes

---

### ✍️ PromptEditor

Advanced prompt editor with character counting and AI optimization.

**Features:**
- Auto-resizing textarea
- Real-time character count with visual feedback
- Min/max length validation
- Progress bar indicator
- AI optimization button (optional)
- Keyboard shortcuts (Cmd/Ctrl + Enter to submit)
- Over-limit warning
- Accessible with ARIA attributes

**Usage:**

```tsx
import { PromptEditor } from '@/components/custom'

const [prompt, setPrompt] = useState('')

<PromptEditor
  value={prompt}
  onChange={setPrompt}
  label="Your Prompt"
  placeholder="Describe the image you want to generate..."
  maxLength={2000}
  minLength={10}
  showOptimize={true}
  onOptimize={handleOptimize}
/>
```

**Props:**
- `value: string` - Current prompt value
- `onChange: (value: string) => void` - Change handler
- `label?: string` - Label text (default: "Prompt")
- `placeholder?: string` - Placeholder text
- `maxLength?: number` - Maximum character count (default: 2000)
- `minLength?: number` - Minimum character count (default: 0)
- `rows?: number` - Initial textarea rows (default: 4)
- `className?: string` - Additional CSS classes
- `onOptimize?: () => void` - AI optimization handler
- `optimizing?: boolean` - Show optimizing state
- `showOptimize?: boolean` - Show optimize button (default: false)
- `error?: string` - Error message
- `disabled?: boolean` - Disable input

---

### 🤖 ModelSelector

Select BytePlus AI models with detailed information.

**Features:**
- Grouped by model type (T2I, I2I, I2V)
- Model details card
- Feature list
- Max resolution display
- Recommended badge
- Compact and detailed views
- Filter by type

**Usage:**

```tsx
import { ModelSelector } from '@/components/custom'

const [model, setModel] = useState('seedream-4-0-250828')

<ModelSelector
  value={model}
  onChange={setModel}
  showDetails={true}
  filterByType="t2i"
/>
```

**Props:**
- `value: string` - Selected model ID
- `onChange: (value: string) => void` - Change handler
- `disabled?: boolean` - Disable selector
- `className?: string` - Additional CSS classes
- `showDetails?: boolean` - Show model details card (default: true)
- `filterByType?: ModelType` - Filter models by type ("t2i" | "i2i" | "i2v")

**Available Models:**
- `seedream-4-0-250828` - SEEDDREAM 4.0 (Text-to-Image, 4K)
- `Bytedance-SeedEdit-3.0-i2i` - SEEDEDIT 3.0 (Image-to-Image, 2K)
- `Bytedance-Seedance-1.0-pro` - SEEDANCE 1.0 Pro (Image-to-Video, 1080P)

---

### ⚙️ ParameterControls

Fine-tune generation parameters with an intuitive interface.

**Features:**
- Model-specific controls (T2I, I2I, I2V)
- Size/resolution selector
- Aspect ratio selector (images)
- Duration slider (videos)
- Watermark toggle
- Advanced options (collapsible)
  - Seed control with randomizer
  - Quantity slider (images)
  - Fixed camera toggle (videos)
- Visual sliders with value display

**Usage:**

```tsx
import { ParameterControls, GenerationParameters } from '@/components/custom'

const [params, setParams] = useState<GenerationParameters>({
  size: '2K',
  ratio: '1:1',
  watermark: true,
  quantity: 1
})

<ParameterControls
  value={params}
  onChange={setParams}
  modelType="t2i"
/>
```

**Props:**
- `value: GenerationParameters` - Current parameters
- `onChange: (value: GenerationParameters) => void` - Change handler
- `modelType: "t2i" | "i2i" | "i2v"` - Model type
- `className?: string` - Additional CSS classes
- `disabled?: boolean` - Disable all controls

**GenerationParameters Interface:**
```typescript
interface GenerationParameters {
  size: string            // "1K" | "2K" | "4K" | "720P" | "1080P"
  ratio?: string          // "1:1" | "16:9" | "9:16" | "4:3" | "3:4"
  seed?: number           // Random seed (0-999999)
  watermark: boolean      // Enable watermark
  quantity?: number       // Number of images (1-4)
  duration?: number       // Video duration in seconds (5-20)
  fixedLens?: boolean     // Fixed camera for videos
}
```

---

### 🌓 ThemeToggle

Switch between light and dark modes.

**Features:**
- Button and select variants
- System theme support
- Animated icon transitions
- Prevents hydration mismatch
- Accessible (ARIA labels, screen reader support)

**Usage:**

```tsx
import { ThemeToggle } from '@/components/custom'

// Button variant (icon only)
<ThemeToggle variant="button" />

// Select variant (with system option)
<ThemeToggle variant="select" />
```

**Props:**
- `variant?: "button" | "select"` - Display variant (default: "button")
- `className?: string` - Additional CSS classes

---

## Demo Page

Visit `/components` to see all components in action with interactive examples.

## Import Patterns

```tsx
// Individual imports
import { ImagePreview } from '@/components/custom/image-preview'
import { GenerationProgress } from '@/components/custom/generation-progress'

// Barrel imports (recommended)
import {
  ImagePreview,
  GenerationProgress,
  PromptEditor,
  ModelSelector,
  ParameterControls,
  ThemeToggle
} from '@/components/custom'

// Type imports
import type {
  GenerationStatus,
  ModelType,
  ModelInfo,
  GenerationParameters
} from '@/components/custom'
```

## Styling

All components use:
- **Tailwind CSS** for styling
- **shadcn/ui** components as primitives
- **CSS variables** for theming (light/dark mode)
- **lucide-react** for icons

## Accessibility

All components follow WCAG 2.1 AA standards:
- ✅ Keyboard navigation
- ✅ ARIA attributes
- ✅ Screen reader support
- ✅ Focus indicators
- ✅ Color contrast

## TypeScript

All components are fully typed with:
- Strict mode enabled
- Explicit prop types
- Exported type definitions
- IntelliSense support

## Dependencies

Required packages:
- `react` & `react-dom`
- `next` & `next-themes`
- `@radix-ui/*` (via shadcn/ui)
- `lucide-react`
- `tailwindcss`
- `class-variance-authority`
- `clsx` & `tailwind-merge`

## Contributing

When adding new components:
1. Create the component file in this directory
2. Export it from `index.ts`
3. Add documentation to this README
4. Add examples to `/components` demo page
5. Include TypeScript types
6. Follow accessibility guidelines
7. Test in light and dark modes

---

**Built for Byteflow** 🌸 - AI Image Generation Platform powered by BytePlus
