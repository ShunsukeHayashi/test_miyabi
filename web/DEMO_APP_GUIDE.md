# BytePlus Demo Application Guide

## 🚀 Quick Start

### Running the Demo

```bash
cd web
npm install
npm run dev
```

Navigate to: **http://localhost:3000/demo**

## 📋 Overview

The BytePlus Demo Application is a comprehensive showcase of all BytePlus AI capabilities, organized in an intuitive tabbed interface. It demonstrates:

- ✨ **T2I** (Text-to-Image) - Generate images from text descriptions
- 🎨 **I2I** (Image-to-Image) - Edit and transform existing images
- 🎬 **I2V** (Image-to-Video) - Animate static images into videos
- ⚡ **Batch** - Generate multiple images in parallel

## 🎯 Features by Tab

### 1. T2I (Text-to-Image)

**What it does:** Generate high-quality images from text prompts using SEEDREAM models.

**Key Features:**
- **Model Selection**: Choose from SEEDREAM 4.0, 3.5, or 3.0
- **Resolution Options**: 1K (1024×1024), 2K (2048×2048), 4K (4096×4096)
- **Seed Control**: Set seed for reproducible results or randomize
- **Watermark Toggle**: Add/remove BytePlus watermark
- **Example Prompts**: Quick-start with pre-built prompts
- **Generation Time**: Real-time tracking
- **Actions**: Download image, copy URL

**How to use:**
1. Enter a text description in the prompt field
2. Select model and resolution
3. Adjust seed if needed (or use random)
4. Click "Generate Image"
5. Wait for generation (typically 5-10 seconds)
6. Download or copy the generated image URL

**Example Prompts:**
```
"A futuristic cityscape at sunset, cyberpunk style, neon lights, high detail, 8K"
"A serene mountain lake with crystal clear water, pine trees, golden hour lighting"
"Abstract geometric patterns in vibrant colors, modern art style, symmetrical"
"A cozy coffee shop interior, warm lighting, plants, bokeh background"
```

**Best Practices:**
- Use detailed, descriptive prompts for better results
- Specify art style, lighting, and quality level
- SEEDREAM 4.0 offers highest quality but slower generation
- Use same seed to reproduce exact results

---

### 2. I2I (Image-to-Image)

**What it does:** Transform and edit existing images using SeedEdit 3.0 AI model.

**Key Features:**
- **Image Upload**: Drag-and-drop or click to upload (max 10MB)
- **Supported Formats**: JPG, PNG, WebP
- **Image Preview**: Before/after comparison
- **Resolution Control**: Output at 1K, 2K, or 4K
- **Example Edits**: Pre-built editing instructions
- **Clear Function**: Remove uploaded image and start over

**How to use:**
1. Upload a source image (click or drag-and-drop)
2. Enter editing instructions (what you want to change)
3. Select output resolution
4. Click "Edit Image"
5. Wait for processing (typically 8-15 seconds)
6. Compare with original and download

**Example Editing Instructions:**
```
"Transform into watercolor painting style"
"Add dramatic sunset lighting and warm colors"
"Convert to black and white with high contrast"
"Make it look like a vintage photograph from the 1970s"
```

**Tips:**
- Be specific about what you want to change
- Mention style, colors, lighting, or atmosphere
- Works best with clear, high-quality source images
- Larger resolutions take longer to process

---

### 3. I2V (Image-to-Video)

**What it does:** Animate static images into dynamic videos using Seedance 1.0 Pro.

**Key Features:**
- **Image Upload**: Same as I2I (max 10MB)
- **Resolution**: 720P (HD) or 1080P (Full HD)
- **Aspect Ratio**: 16:9 (landscape), 9:16 (portrait), 1:1 (square)
- **Duration**: 5 or 10 seconds
- **Camera Control**:
  - Dynamic camera (default) - AI-controlled movement
  - Fixed lens - Static framing, content animates
- **Motion Prompts**: Optional instructions for camera/animation
- **Video Player**: Inline playback with controls
- **Thumbnail**: Auto-generated preview image

**How to use:**
1. Upload a source image
2. (Optional) Enter motion prompt describing desired animation
3. Select resolution and aspect ratio
4. Choose duration (5s or 10s)
5. Toggle fixed lens if you want static camera
6. Click "Generate Video"
7. Wait for processing (typically 30-60 seconds)
8. Play video inline or download

**Example Motion Prompts:**
```
"Dynamic camera movement, cinematic style, smooth motion"
"Gentle zoom in, professional cinematography"
"Pan from left to right, showcase the scene"
"Slow motion effect, dramatic atmosphere"
```

**Camera Modes:**
- **Dynamic Camera** (default): AI adds camera movements like pan, zoom, tilt
- **Fixed Lens**: Camera stays still, only content moves (good for product demos)

**Tips:**
- Use landscape images for 16:9 videos
- Fixed lens works better for product showcases
- Dynamic camera creates more cinematic results
- Higher resolution = longer processing time

---

### 4. Batch Generation

**What it does:** Generate multiple images simultaneously with parallel processing.

**Key Features:**
- **Multi-Prompt Input**: Add unlimited prompts
- **Dynamic List**: Add/remove prompts on the fly
- **Shared Settings**: Apply same model/size/watermark to all
- **Concurrency Control**: 1-10 parallel requests
  - 1 = Sequential (slowest, most stable)
  - 3 = Balanced (recommended)
  - 5 = Fast
  - 10 = Maximum (fastest, but may hit rate limits)
- **Real-Time Progress**: Track completion status
- **Success/Failure Stats**:
  - Total completed/total
  - Success count
  - Failure count
  - Success rate percentage
  - Average time per image
- **Result Gallery**: Grid view of all generated images
- **Error Display**: Detailed failure reasons

**How to use:**
1. Enter first prompt or click "Load Examples"
2. Click "+ Add Prompt" to add more (no limit)
3. Configure shared settings (model, size, watermark)
4. Set concurrency level (3 recommended)
5. Click "Generate X Images"
6. Monitor progress bar
7. Review results and statistics
8. Download successful images

**Example Batch:**
```
"A modern minimalist living room, Scandinavian design, natural light"
"A cozy bedroom with warm lighting, bohemian style, plants"
"A sleek kitchen with marble countertops, contemporary design"
"A home office with wooden desk, large windows, inspirational"
```

**Concurrency Guide:**
| Level | Speed | Stability | Use Case |
|-------|-------|-----------|----------|
| 1 | Slowest | Most stable | Testing, debugging |
| 3 | Good | Balanced | **Recommended** for most cases |
| 5 | Fast | Generally stable | Large batches (10-20 images) |
| 10 | Fastest | May hit limits | Small batches (3-5 images) |

**Tips:**
- Start with 3 concurrent requests for optimal balance
- Use lower concurrency if you hit rate limits
- Failed items show error messages for debugging
- All successful images auto-save to history

---

## 🎨 UI/UX Features

### General Features (All Tabs)
- **Dark Mode**: Toggle via theme button in header
- **Responsive Design**: Works on mobile, tablet, desktop
- **Toast Notifications**: Success/error feedback
- **Generation Time**: Displayed in badges
- **Loading States**: Animated spinners during processing
- **History Tracking**: All generations auto-saved
- **Download**: One-click image/video download
- **Copy URL**: Quick clipboard copy

### Navigation
- **Header Menu**: "Demo" is featured first
- **Tab Switching**: Instant without page reload
- **Mobile Friendly**: Collapsible navigation

### Visual Design
- Gradient hero section with animated icon
- Feature cards highlighting capabilities
- Consistent spacing and typography
- Clean, modern card-based layout
- Accessible color contrast

---

## 🛠️ Technical Details

### API Integration

All components use the existing BytePlus API infrastructure:

**Client-Side:**
- `apiClient.generateImage()` - T2I generation
- `apiClient.editImage()` - I2I editing
- `apiClient.generateVideo()` - I2V animation
- `apiClient.batchGenerate()` - Batch processing

**Server-Side API Routes:**
- `/api/generate` - Text-to-Image
- `/api/edit` - Image-to-Image
- `/api/generate-video` - Image-to-Video
- `/api/batch` - Batch generation

### State Management

**Hooks Used:**
- `useGenerate()` - T2I with loading/error states
- `useEditImage()` - I2I with file upload
- `useBatchGenerate()` - Batch with progress tracking
- `useToast()` - Notifications
- `useAppStore()` - History persistence

### Component Structure

```
/web/src/
├── app/
│   └── demo/
│       └── page.tsx           # Main demo page with tabs
├── components/
│   ├── demo/
│   │   ├── t2i-demo.tsx      # Text-to-Image component
│   │   ├── i2i-demo.tsx      # Image-to-Image component
│   │   ├── i2v-demo.tsx      # Image-to-Video component
│   │   └── batch-demo.tsx    # Batch generation component
│   ├── ui/
│   │   ├── badge.tsx         # Badge component
│   │   ├── progress.tsx      # Progress bar component
│   │   └── ...               # Other UI components
│   └── layout/
│       └── header.tsx        # Navigation with Demo link
└── lib/
    ├── api-client.ts         # API client
    ├── utils.ts              # Utility functions
    └── store.ts              # App state
```

---

## 🔧 Configuration

### Environment Variables

Required in `.env` or `.env.local`:

```bash
# BytePlus API Configuration
BYTEPLUS_API_KEY=your_api_key_here
BYTEPLUS_ENDPOINT=https://ark.ap-southeast.bytepluses.com/api/v3
```

### Image Upload Limits

```typescript
// Max file size
maxSize: 10 * 1024 * 1024  // 10MB

// Accepted formats
accept: "image/*"  // JPG, PNG, WebP, etc.
```

### Rate Limits

BytePlus API limits (handled automatically):
- **10 requests/second** (client-side rate limiting)
- **Auto-retry** with exponential backoff
- **Batch concurrency** configurable (1-10)

---

## 🐛 Troubleshooting

### Common Issues

**1. "Image upload failed"**
- Check file size (max 10MB)
- Ensure file is an image format (JPG, PNG, WebP)
- Try a different image

**2. "Rate limit exceeded"**
- Reduce batch concurrency to 3 or lower
- Wait 10 seconds before retrying
- Avoid rapid repeated requests

**3. "Generation timeout"**
- Large images (4K) take longer
- Videos take 30-60 seconds
- Check internet connection
- Try smaller resolution

**4. "Failed to generate image"**
- Check API key in environment variables
- Verify BYTEPLUS_ENDPOINT is correct
- Check prompt is not empty
- Review error message in toast

**5. Dark mode issues**
- Clear browser cache
- Check theme toggle in header
- Verify ThemeProvider is working

### Debug Mode

Enable debug logging in browser console:

```javascript
localStorage.setItem('debug', 'true')
```

Then refresh the page to see detailed API logs.

---

## 📊 Performance Tips

### For Best Results

**T2I:**
- Use SEEDREAM 4.0 for highest quality
- Start with 2K resolution for balance
- Detailed prompts = better results
- Same seed = reproducible output

**I2I:**
- Upload high-quality source images
- Be specific in editing instructions
- 2K resolution recommended
- Clear source image before uploading new one

**I2V:**
- Use landscape images for 16:9 videos
- 5-second videos generate faster
- Fixed lens for product demos
- Dynamic camera for cinematic effect

**Batch:**
- Start with 3 concurrent requests
- Test 1-2 prompts before large batches
- Use shared settings for consistency
- Monitor success rate and adjust

---

## 🚀 Next Steps

### Extending the Demo

Want to add more features?

1. **Sequential Generation**: Add multi-image story mode
2. **Prompt Optimization**: Integrate T2T for auto-enhancement
3. **Vision API**: Add image analysis tab
4. **Advanced Settings**: Expose more API parameters
5. **Export Options**: Bulk download, PDF export
6. **Comparison View**: Side-by-side A/B testing

### Learn More

- [BytePlus API Specification](../BYTEPLUS_API_SPECIFICATION.md)
- [Integration Test Guide](../tests/integration/README.md)
- [Project Documentation](../README.md)

---

## 📝 License

This demo application is part of the test_miyabi (Byteflow) project.

**Built with:**
- Next.js 15.5
- React 19
- TypeScript
- Tailwind CSS
- Radix UI
- BytePlus AI API

**Developed with:**
- 🤖 Claude Code (Autonomous Development)
- 🌸 Miyabi Framework
- 📚 Shikigaku Theory (識学理論)

---

*Last Updated: 2025-10-09*
*Version: 1.0.0*
