/**
 * Tldraw Canvas Component
 *
 * Interactive drawing canvas with BytePlus image generation integration
 */

import { Tldraw, Editor, TLShapeId, AssetRecordType, createShapeId } from 'tldraw';
import 'tldraw/tldraw.css';
import { useState, useCallback, useRef, useEffect } from 'react';
import { ProxyClient } from '../lib/api/proxy-client';
import { CollaborationPanel } from './CollaborationPanel';
import { ImageGenAgent } from '../agents/ImageGenAgent';
import { VideoGenAgent } from '../agents/VideoGenAgent';
import { SettingsPanel } from './SettingsPanel';
import { ExportPanel } from './ExportPanel';
import { GenerationHistory, addToHistory } from './GenerationHistory';
import { AgentChatUI, addAgentResponse } from './AgentChatUI';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';

interface TldrawCanvasProps {
  apiKey?: string;
  endpoint?: string;
  geminiApiKey?: string;
  onImageGenerated?: (imageUrl: string) => void;
}

export function TldrawCanvas({ apiKey, endpoint, geminiApiKey, onImageGenerated }: TldrawCanvasProps) {
  const [editor, setEditor] = useState<Editor | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [generationType, setGenerationType] = useState<'image' | 'video' | 'edit'>('image');
  const [geminiSuggestion, setGeminiSuggestion] = useState<string | null>(null);
  const [roomId, setRoomId] = useState<string>('');
  const [agentEnabled, setAgentEnabled] = useState(false);
  const [videoAgentEnabled, setVideoAgentEnabled] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showAgentChat, setShowAgentChat] = useState(false);
  const agentRef = useRef<ImageGenAgent | null>(null);
  const videoAgentRef = useRef<VideoGenAgent | null>(null);

  /**
   * Export selected area of canvas as PNG blob
   * Uses tldraw 4.0 export API
   */
  const exportSelectionAsImage = useCallback(async (): Promise<{blob: Blob; dataUrl: string} | null> => {
    if (!editor) return null;

    try {
      // Get selected shape IDs
      const selectedShapes = editor.getSelectedShapes();

      if (selectedShapes.length === 0) {
        alert('⚠️ Please select elements on the canvas first!');
        return null;
      }

      console.log(`📸 Capturing ${selectedShapes.length} selected elements...`);

      // Export selection as SVG
      const svg = await editor.getSvgString(selectedShapes.map(s => s.id), {
        background: true,
        bounds: editor.getSelectionPageBounds() || undefined,
        padding: 16,
        darkMode: false,
      });

      if (!svg) {
        throw new Error('Failed to export SVG');
      }

      // Convert SVG to PNG blob
      const blob = await svgToBlob(svg.svg, 2); // 2x scale for quality

      // Create data URL for Vision AI
      const dataUrl = await blobToDataUrl(blob);

      console.log('✅ Selection captured successfully');
      return { blob, dataUrl };
    } catch (error) {
      console.error('Failed to export selection:', error);
      return null;
    }
  }, [editor]);

  /**
   * Convert SVG string to PNG Blob
   */
  const svgToBlob = async (svgString: string, scale: number = 2): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        ctx.scale(scale, scale);
        ctx.drawImage(img, 0, 0);

        canvas.toBlob((blob) => {
          URL.revokeObjectURL(url);
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to convert to blob'));
          }
        }, 'image/png');
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to load SVG'));
      };

      img.src = url;
    });
  };

  /**
   * Convert Blob to data URL
   */
  const blobToDataUrl = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  /**
   * Place image asset on canvas (next to selected objects)
   */
  const placeImageOnCanvas = useCallback(async (imageUrl: string, selectedBounds?: any) => {
    if (!editor) return;

    try {
      console.log('📍 Placing image on canvas:', imageUrl);

      // Calculate position: right side of selected area
      let x: number;
      let y: number;

      if (selectedBounds) {
        // Place image to the right of selected area with 50px gap
        x = selectedBounds.maxX + 50;
        y = selectedBounds.y;
      } else {
        // Fallback: center of viewport
        const viewportBounds = editor.getViewportPageBounds();
        x = viewportBounds.center.x - 256;
        y = viewportBounds.center.y - 256;
      }

      // Create asset ID using tldraw 4.0 API
      const assetId = AssetRecordType.createId();

      // Create asset
      editor.createAssets([
        {
          id: assetId,
          type: 'image',
          typeName: 'asset',
          props: {
            name: 'Generated Image',
            src: imageUrl,
            w: 512,
            h: 512,
            mimeType: 'image/png',
            isAnimated: false,
          },
          meta: {},
        },
      ]);

      // Create image shape on canvas
      const shapeId = createShapeId();
      editor.createShapes([
        {
          id: shapeId,
          type: 'image',
          x,
          y,
          props: {
            assetId,
            w: 512,
            h: 512,
          },
        },
      ]);

      console.log('✅ Image placed on canvas at', { x, y }, ':', shapeId);

      // Select the newly created image
      editor.setSelectedShapes([shapeId]);
    } catch (error) {
      console.error('Failed to place image on canvas:', error);
      throw error;
    }
  }, [editor]);

  /**
   * Generate image from canvas sketch using BytePlus t2i via proxy
   */
  const generateImageFromSketch = useCallback(async (prompt: string) => {
    if (!editor) {
      console.error('Editor not configured');
      return;
    }

    setIsGenerating(true);
    setGeneratedImageUrl(null);

    try {
      const client = new ProxyClient();

      // Generate enhanced version based on sketch description
      const result = await client.generateImage({
        model: 'seedream-4-0-250828',
        prompt: `${prompt}, professional digital art, high quality, detailed, vibrant colors, sharp focus`,
        size: '2K',
        response_format: 'url',
        watermark: false,
      });

      const imageUrl = result.data[0].url;
      setGeneratedImageUrl(imageUrl);

      // Add to history
      addToHistory({
        type: 'image',
        url: imageUrl,
        prompt,
      });

      // Place generated image on canvas
      await placeImageOnCanvas(imageUrl);

      if (onImageGenerated) {
        onImageGenerated(imageUrl);
      }

      console.log('Generated image:', imageUrl);
    } catch (error) {
      console.error('Failed to generate image:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  }, [editor, onImageGenerated, placeImageOnCanvas]);

  /**
   * Generate video from the generated image using BytePlus i2v via proxy
   */
  const generateVideoFromImage = useCallback(async (prompt: string) => {
    if (!generatedImageUrl) {
      alert('Please generate an image first!');
      return;
    }

    setIsGenerating(true);
    setGeneratedVideoUrl(null);

    try {
      const client = new ProxyClient();

      console.log('Generating video from image:', generatedImageUrl);

      // Generate video using i2v with polling
      const result = await client.generateVideo({
        model: 'seedance-1-0-pro-250528',
        image: generatedImageUrl,
        prompt: prompt || 'smooth camera movement, cinematic style, dynamic motion',
        resolution: '1080p',
        duration: 5,
        camerafixed: false,
      });

      const videoUrl = result.data[0].url;
      const thumbnailUrl = result.data[0].thumbnail_url;
      setGeneratedVideoUrl(videoUrl);

      // Add to history
      addToHistory({
        type: 'video',
        url: videoUrl,
        prompt,
        thumbnailUrl,
      });

      console.log('Generated video:', videoUrl);
    } catch (error) {
      console.error('Failed to generate video:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  }, [generatedImageUrl]);

  /**
   * Edit existing image using Gemini AI suggestions + BytePlus i2i via proxy
   */
  const editImageWithGemini = useCallback(async (editRequest: string) => {
    if (!generatedImageUrl) {
      alert('Please generate an image first!');
      return;
    }

    setIsGenerating(true);
    setGeminiSuggestion(null);

    try {
      const client = new ProxyClient();

      // Step 1: Get AI-powered edit instructions from Gemini via proxy
      console.log('🤖 Asking Gemini for edit instructions...');
      const editPrompt = await client.getGeminiEditInstructions(generatedImageUrl, editRequest);

      console.log('✅ Gemini suggestion:', editPrompt);
      setGeminiSuggestion(editPrompt);

      // Step 2: Apply edits using BytePlus i2i via proxy
      console.log('🎨 Applying edits with BytePlus i2i...');
      const result = await client.generateImage({
        model: 'Bytedance-SeedEdit-3.0-i2i',
        prompt: editPrompt,
        image: [generatedImageUrl],
        size: '2K',
        response_format: 'url',
        watermark: false,
      });

      const editedImageUrl = result.data[0].url;
      setGeneratedImageUrl(editedImageUrl);

      // Place edited image on canvas
      await placeImageOnCanvas(editedImageUrl);

      if (onImageGenerated) {
        onImageGenerated(editedImageUrl);
      }

      console.log('✅ Image edited successfully:', editedImageUrl);
    } catch (error) {
      console.error('Failed to edit image:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  }, [generatedImageUrl, onImageGenerated, placeImageOnCanvas]);

  /**
   * Analyze canvas selection with Gemini Vision and generate smart content
   */
  const generateFromSelection = useCallback(async () => {
    if (!editor) {
      alert('Editor not ready');
      return;
    }

    setIsGenerating(true);

    try {
      // Step 1: Get selection bounds before capture
      const selectedShapes = editor.getSelectedShapes();
      if (selectedShapes.length === 0) {
        alert('⚠️ Please select elements on the canvas first!');
        setIsGenerating(false);
        return;
      }

      const selectionBounds = editor.getSelectionPageBounds();
      console.log('📐 Selection bounds:', selectionBounds);

      // Step 2: Capture selection
      console.log('📸 Capturing canvas selection...');
      const captured = await exportSelectionAsImage();

      if (!captured) {
        setIsGenerating(false);
        return;
      }

      const { dataUrl } = captured;

      // Step 3: Analyze with Gemini Vision
      console.log('🤖 Analyzing content with Gemini Vision...');
      const client = new ProxyClient();
      const analysis = await client.analyzeCanvasSelection(dataUrl);

      console.log('✅ Vision analysis:', analysis);

      // Step 4: Smart mode detection and generation
      let imageUrl: string;

      // Note: BytePlus i2i doesn't support data URLs, so we use t2i for all image generation
      if (analysis.mode === 'text-to-image' || analysis.mode === 'image-to-image') {
        // Text/sketch/image → generate new image
        console.log('🎨 Mode:', analysis.mode, '(using t2i)');
        const result = await client.generateImage({
          model: 'seedream-4-0-250828',
          prompt: analysis.suggestedPrompt,
          size: '2K',
          response_format: 'url',
          watermark: false,
        });
        imageUrl = result.data[0].url;

      } else if (analysis.mode === 'image-to-video') {
        // Completed image → generate video
        console.log('🎬 Mode: Image-to-Video');
        const result = await client.generateVideo({
          model: 'seedance-1-0-pro-250528',
          image: analysis.detectedImageUrl!,
          prompt: analysis.suggestedPrompt,
          resolution: '1080p',
          duration: 5,
          camerafixed: false,
        });

        // For video, we'll store the URL but won't place it on canvas
        setGeneratedVideoUrl(result.data[0].url);
        console.log('✅ Video generated:', result.data[0].url);
        alert('🎥 Video generated! Check the results panel.');
        setIsGenerating(false);
        return;

      } else {
        throw new Error(`Unknown mode: ${analysis.mode}`);
      }

      // Step 5: Place generated image next to selected area
      setGeneratedImageUrl(imageUrl);
      await placeImageOnCanvas(imageUrl, selectionBounds);

      console.log('✅ Smart generation complete!');
      alert(`✨ Generated using ${analysis.mode} mode!`);

    } catch (error) {
      console.error('Failed to generate from selection:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  }, [editor, exportSelectionAsImage, placeImageOnCanvas]);

  /**
   * Handle editor mount
   */
  const handleMount = useCallback((editor: Editor) => {
    setEditor(editor);
    console.log('Tldraw editor mounted');

    // Initialize agents
    if (!agentRef.current) {
      agentRef.current = new ImageGenAgent();
    }
    if (!videoAgentRef.current) {
      videoAgentRef.current = new VideoGenAgent();
    }
  }, []);

  // Handle image agent enable/disable
  useEffect(() => {
    if (!editor || !agentRef.current) return;

    if (agentEnabled) {
      agentRef.current.connect(editor);
    } else {
      agentRef.current.disconnect();
    }
  }, [editor, agentEnabled]);

  // Handle video agent enable/disable
  useEffect(() => {
    if (!editor || !videoAgentRef.current) return;

    if (videoAgentEnabled) {
      videoAgentRef.current.connect(editor);
    } else {
      videoAgentRef.current.disconnect();
    }
  }, [editor, videoAgentEnabled]);

  const handleRoomChange = useCallback((newRoomId: string) => {
    setRoomId(newRoomId);
    console.log('Room changed:', newRoomId);
    // TODO: Integrate full sync with @tldraw/sync once the client-side hook is properly configured
  }, []);

  /**
   * Handle agent chat message
   */
  const handleAgentChatMessage = useCallback(async (message: string, type: 'image' | 'video') => {
    if (!editor) return;

    setIsGenerating(true);

    try {
      if (type === 'image') {
        // Generate image using the message as prompt
        await generateImageFromSketch(message);
        addAgentResponse(`✅ Image generated successfully!`, 'image');
      } else {
        // Generate video using the message as prompt
        await generateVideoFromImage(message);
        addAgentResponse(`✅ Video generated successfully!`, 'video');
      }
    } catch (error) {
      console.error('Agent chat generation failed:', error);
      addAgentResponse(`❌ Generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`, type);
    } finally {
      setIsGenerating(false);
    }
  }, [editor, generateImageFromSketch, generateVideoFromImage]);

  // Keyboard shortcuts (defined after all callbacks)
  useKeyboardShortcuts({
    onGenerateFromSelection: generateFromSelection,
    onToggleImageAgent: () => setAgentEnabled((prev) => !prev),
    onToggleVideoAgent: () => setVideoAgentEnabled((prev) => !prev),
    onExport: () => setShowExport(true),
    onSettings: () => setShowSettings(true),
  });

  return (
    <div className="w-full h-screen relative overflow-hidden">
      {/* Collaboration Panel */}
      <CollaborationPanel onRoomChange={handleRoomChange} />

      {/* Settings Panel */}
      {showSettings && <SettingsPanel onClose={() => setShowSettings(false)} />}

      {/* Export Panel */}
      {showExport && <ExportPanel editor={editor} onClose={() => setShowExport(false)} />}

      {/* Generation History */}
      {showHistory && <GenerationHistory onClose={() => setShowHistory(false)} />}

      {/* Agent Chat UI */}
      {showAgentChat && (
        <AgentChatUI
          onSendMessage={handleAgentChatMessage}
          isProcessing={isGenerating}
          onClose={() => setShowAgentChat(false)}
        />
      )}

      {/* Compact Top Toolbar - Responsive */}
      <div className="absolute top-2 md:top-3 right-2 md:right-3 flex gap-1 md:gap-1.5 z-[1000] flex-wrap justify-end max-w-[calc(100vw-1rem)]">
        <button
          onClick={() => setShowSettings(true)}
          title="Settings (Ctrl+,)"
          aria-label="Open settings"
          className="px-2 md:px-3 py-1.5 md:py-2 bg-white dark:bg-gray-800 border-0 rounded-md cursor-pointer text-sm md:text-base shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 active:scale-95"
        >
          ⚙️
        </button>
        <button
          onClick={() => setShowExport(true)}
          title="Export (Ctrl+E)"
          aria-label="Export canvas"
          className="px-2 md:px-3 py-1.5 md:py-2 bg-white dark:bg-gray-800 border-0 rounded-md cursor-pointer text-sm md:text-base shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 active:scale-95"
        >
          💾
        </button>
        <button
          onClick={() => setVideoAgentEnabled(!videoAgentEnabled)}
          title="Video Agent (Ctrl+Shift+V)"
          aria-label={`Video agent ${videoAgentEnabled ? 'enabled' : 'disabled'}`}
          aria-pressed={videoAgentEnabled}
          className={`px-2 md:px-3 py-1.5 md:py-2 border-0 rounded-md cursor-pointer text-sm md:text-base shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 active:scale-95 ${
            videoAgentEnabled
              ? 'bg-red-500 text-white'
              : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-white'
          }`}
        >
          🎬
        </button>
        <button
          onClick={() => setShowHistory(true)}
          title="History"
          aria-label="View generation history"
          className="px-2 md:px-3 py-1.5 md:py-2 bg-white dark:bg-gray-800 border-0 rounded-md cursor-pointer text-sm md:text-base shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 active:scale-95"
        >
          📜
        </button>
        <button
          onClick={() => setShowAgentChat(!showAgentChat)}
          title="Agent Chat"
          aria-label={`${showAgentChat ? 'Close' : 'Open'} agent chat`}
          aria-pressed={showAgentChat}
          className={`px-2 md:px-3 py-1.5 md:py-2 border-0 rounded-md cursor-pointer text-sm md:text-base shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 active:scale-95 ${
            showAgentChat
              ? 'bg-blue-600 text-white'
              : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-white'
          }`}
        >
          💬
        </button>
      </div>

      {/* Tldraw Canvas - Force to background layer */}
      <div className="absolute inset-0 z-0">
        <Tldraw onMount={handleMount} />
      </div>

      {/* Compact Control Panel - Responsive */}
      <div className="absolute bottom-2 md:bottom-3 right-2 md:right-3 left-2 md:left-auto bg-white dark:bg-gray-800 p-3 md:p-4 rounded-xl shadow-lg z-[1000] md:w-80 max-h-[calc(100vh-120px)] overflow-auto border border-gray-200 dark:border-gray-700 transition-all duration-300">
        <div className="mb-3 flex justify-between items-center">
          <strong className="text-sm font-bold text-gray-900 dark:text-white">🎨 AI Studio</strong>
          <button
            onClick={() => setAgentEnabled(!agentEnabled)}
            title="Image Agent (Ctrl+Shift+I)"
            aria-label={`Image agent ${agentEnabled ? 'enabled' : 'disabled'}`}
            aria-pressed={agentEnabled}
            className={`px-2.5 py-1 border-0 rounded-md cursor-pointer text-xs font-bold transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              agentEnabled
                ? 'bg-green-500 text-white focus:ring-green-500'
                : 'bg-gray-500 text-white focus:ring-gray-500'
            }`}
          >
            {agentEnabled ? '🤖 ON' : '🤖 OFF'}
          </button>
        </div>

        {(agentEnabled || videoAgentEnabled) && (
          <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-md mb-2.5 text-xs text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            {agentEnabled && <div className="mb-1">💡 @generate [prompt]</div>}
            {videoAgentEnabled && <div>🎬 @video [motion]</div>}
          </div>
        )}

        {/* Smart Selection Generation Button */}
        <button
          onClick={generateFromSelection}
          disabled={isGenerating || !editor}
          title="Smart Generate (Ctrl+G)"
          aria-label="Smart generate from selection"
          className={`w-full px-3 py-2.5 mb-2.5 border-0 rounded-lg font-bold text-sm shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            isGenerating || !editor
              ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              : 'bg-purple-600 hover:bg-purple-700 text-white cursor-pointer hover:shadow-lg hover:scale-105 focus:ring-purple-500'
          }`}
        >
          <span className="flex items-center justify-center gap-2">
            {isGenerating ? '⏳' : '✨'} Smart Generate
          </span>
        </button>

        <div className="border-t border-gray-200 dark:border-gray-700 py-2 px-0 mb-2 text-center text-[9px] text-gray-500 dark:text-gray-400 font-bold tracking-wider">
          MANUAL MODES
        </div>

        {/* Generation Type Selector */}
        <div className="mb-2.5">
          <div className="flex gap-1 mb-2" role="group" aria-label="Generation type selector">
            <button
              onClick={() => setGenerationType('image')}
              aria-label="Image generation mode"
              aria-pressed={generationType === 'image'}
              className={`flex-1 px-1.5 py-1.5 border-0 rounded-md cursor-pointer font-bold text-xs transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                generationType === 'image'
                  ? 'bg-blue-600 text-white shadow-md focus:ring-blue-500'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 focus:ring-gray-400'
              }`}
            >
              🖼️
            </button>
            <button
              onClick={() => setGenerationType('edit')}
              aria-label="Image editing mode"
              aria-pressed={generationType === 'edit'}
              className={`flex-1 px-1.5 py-1.5 border-0 rounded-md cursor-pointer font-bold text-xs transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                generationType === 'edit'
                  ? 'bg-green-500 text-white shadow-md focus:ring-green-500'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 focus:ring-gray-400'
              }`}
            >
              ✏️
            </button>
            <button
              onClick={() => setGenerationType('video')}
              aria-label="Video generation mode"
              aria-pressed={generationType === 'video'}
              className={`flex-1 px-1.5 py-1.5 border-0 rounded-md cursor-pointer font-bold text-xs transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                generationType === 'video'
                  ? 'bg-red-500 text-white shadow-md focus:ring-red-500'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 focus:ring-gray-400'
              }`}
            >
              🎬
            </button>
          </div>
        </div>

        {/* Prompt Input */}
        <textarea
          placeholder={
            generationType === 'image'
              ? 'Describe image...'
              : generationType === 'edit'
              ? 'Describe edits...'
              : 'Describe motion...'
          }
          id="ai-prompt"
          aria-label={`${generationType} generation prompt`}
          className="w-full p-2 mb-2.5 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-xs min-h-[60px] resize-y font-sans focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        />

        {/* Generate Button */}
        {generationType === 'image' ? (
          <button
            onClick={() => {
              const promptInput = document.getElementById('ai-prompt') as HTMLTextAreaElement;
              const prompt = promptInput?.value || 'professional digital art';
              generateImageFromSketch(prompt);
            }}
            disabled={isGenerating || !editor}
            aria-label="Generate image"
            className={`w-full px-3 py-2.5 border-0 rounded-md font-bold text-xs transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              isGenerating || !editor
                ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer hover:shadow-lg hover:scale-105 focus:ring-blue-500'
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              {isGenerating ? '⏳' : '✨'} Create
            </span>
          </button>
        ) : generationType === 'edit' ? (
          <button
            onClick={() => {
              const promptInput = document.getElementById('ai-prompt') as HTMLTextAreaElement;
              const editRequest = promptInput?.value || 'enhance the image';
              editImageWithGemini(editRequest);
            }}
            disabled={isGenerating || !generatedImageUrl}
            aria-label="Edit image"
            className={`w-full px-3 py-2.5 border-0 rounded-md font-bold text-xs transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              isGenerating || !generatedImageUrl
                ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed'
                : 'bg-green-500 hover:bg-green-600 text-white cursor-pointer hover:shadow-lg hover:scale-105 focus:ring-green-500'
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              {isGenerating ? '⏳' : !generatedImageUrl ? '⚠️' : '✨'}{' '}
              {isGenerating ? 'Editing...' : !generatedImageUrl ? 'Need Image' : 'Edit'}
            </span>
          </button>
        ) : (
          <button
            onClick={() => {
              const promptInput = document.getElementById('ai-prompt') as HTMLTextAreaElement;
              const prompt = promptInput?.value || 'smooth camera movement';
              generateVideoFromImage(prompt);
            }}
            disabled={isGenerating || !generatedImageUrl}
            aria-label="Generate video"
            className={`w-full px-3 py-2.5 border-0 rounded-md font-bold text-xs transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              isGenerating || !generatedImageUrl
                ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed'
                : 'bg-red-500 hover:bg-red-600 text-white cursor-pointer hover:shadow-lg hover:scale-105 focus:ring-red-500'
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              {isGenerating ? '⏳' : !generatedImageUrl ? '⚠️' : '🎬'}{' '}
              {isGenerating ? 'Video...' : !generatedImageUrl ? 'Need Image' : 'Video'}
            </span>
          </button>
        )}

        {/* Results Display */}
        {(generatedImageUrl || generatedVideoUrl) && (
          <div className="mt-3 border-t border-gray-200 dark:border-gray-700 pt-2.5">
            {generatedImageUrl && (
              <div className="mb-2.5">
                <div className="text-[10px] font-bold mb-1 text-gray-600 dark:text-gray-400">
                  📸 Result
                </div>
                <img
                  src={generatedImageUrl}
                  alt="Generated image result"
                  loading="lazy"
                  className="w-full rounded-md mb-1 shadow-sm hover:shadow-md transition-shadow duration-200"
                />
                <a
                  href={generatedImageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 text-[10px] block no-underline hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                  aria-label="View full image in new tab"
                >
                  View Full ↗
                </a>
              </div>
            )}

            {generatedVideoUrl && (
              <div>
                <div className="text-[10px] font-bold mb-1 text-gray-600 dark:text-gray-400">
                  🎥 Video
                </div>
                <video
                  src={generatedVideoUrl}
                  controls
                  className="w-full rounded-md mb-1 shadow-sm hover:shadow-md transition-shadow duration-200"
                  aria-label="Generated video result"
                />
                <a
                  href={generatedVideoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-600 dark:text-red-400 text-[10px] block no-underline hover:underline focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
                  aria-label="Download video"
                >
                  Download ↗
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
