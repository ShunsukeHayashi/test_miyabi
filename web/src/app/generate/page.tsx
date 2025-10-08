/**
 * Text-to-Image Generation Page
 *
 * Main page for generating images from text prompts using SEEDREAM4.
 */

'use client';

import { useState } from 'react';
import { useGenerateImage } from '@/hooks/use-generate';
import { useGenerationHistory } from '@/hooks/use-generation-history';
import { PromptEditor } from '@/components/custom/prompt-editor';
import { ModelSelector } from '@/components/custom/model-selector';
import { ParameterControls } from '@/components/custom/parameter-controls';
import { GenerationProgress } from '@/components/custom/generation-progress';
import { ImagePreview } from '@/components/custom/image-preview';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Sparkles, Download, RefreshCw, Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { GenerationParameters } from '@/components/custom/parameter-controls';

export default function GeneratePage() {
  const [prompt, setPrompt] = useState('');
  const [model, setModel] = useState('seedream-4-0-250828');
  const [parameters, setParameters] = useState<GenerationParameters>({
    size: '2K',
    watermark: true,
    seed: undefined,
  });
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<any>(null);

  const { generateImage, isLoading, error } = useGenerateImage();
  const { toggleFavorite, favorites } = useGenerationHistory();

  const isFavorite = metadata && favorites.some((fav) => fav.url === generatedImage);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      return;
    }

    try {
      const result = await generateImage({
        model: model as any,
        prompt,
        size: parameters.size as any,
        watermark: parameters.watermark,
        seed: parameters.seed,
      });

      if (result.data && result.data.length > 0) {
        setGeneratedImage(result.data[0].url);
        setMetadata({
          prompt,
          revisedPrompt: result.data[0].revised_prompt,
          model,
          size: parameters.size,
          seed: parameters.seed,
        });
      }
    } catch (err) {
      console.error('Generation failed:', err);
    }
  };

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = `byteflow-${Date.now()}.png`;
      link.click();
    }
  };

  const handleRegenerate = () => {
    handleGenerate();
  };

  const { toast } = useToast();

  const handleSaveToFavorites = () => {
    if (!metadata) return;

    const historyItem = favorites.find((item) => item.url === generatedImage);
    if (historyItem) {
      toggleFavorite(historyItem.id);
      toast({
        title: isFavorite ? 'Removed from favorites' : 'Added to favorites',
        description: isFavorite
          ? 'Image removed from your favorites'
          : 'Image saved to your favorites',
      });
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-2">
          <Sparkles className="h-8 w-8 text-primary" />
          Text-to-Image Generation
        </h1>
        <p className="text-muted-foreground">
          Generate stunning images from text prompts using SEEDREAM4
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Input Controls */}
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Prompt</h2>
            <PromptEditor
              value={prompt}
              onChange={setPrompt}
              placeholder="Describe the image you want to generate..."
              maxLength={2000}
            />
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Model</h2>
            <ModelSelector
              value={model}
              onChange={setModel}
              filterByType="t2i"
            />
          </Card>

          <ParameterControls
            value={parameters}
            onChange={setParameters}
            modelType="t2i"
          />

          <Button
            onClick={handleGenerate}
            disabled={!prompt.trim() || isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Image
              </>
            )}
          </Button>

          {error && (
            <div className="p-4 bg-destructive/10 text-destructive rounded-lg">
              {error}
            </div>
          )}
        </div>

        {/* Right Column - Output */}
        <div className="space-y-6">
          {isLoading && (
            <Card className="p-6">
              <GenerationProgress
                status="generating"
                progress={50}
                estimatedTime={5000}
              />
            </Card>
          )}

          {generatedImage && !isLoading && (
            <>
              <Card className="p-6">
                <ImagePreview
                  src={generatedImage}
                  alt={metadata?.prompt || 'Generated image'}
                />
              </Card>

              <div className="flex gap-2">
                <Button onClick={handleDownload} variant="default" className="flex-1">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
                <Button onClick={handleRegenerate} variant="outline" className="flex-1">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Regenerate
                </Button>
                <Button
                  onClick={handleSaveToFavorites}
                  variant="outline"
                  className={isFavorite ? 'text-red-500' : ''}
                >
                  <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
                </Button>
              </div>

              {metadata?.revisedPrompt && metadata.revisedPrompt !== metadata.prompt && (
                <Card className="p-4">
                  <h3 className="text-sm font-semibold mb-2">AI-Enhanced Prompt</h3>
                  <p className="text-sm text-muted-foreground">
                    {metadata.revisedPrompt}
                  </p>
                </Card>
              )}
            </>
          )}

          {!generatedImage && !isLoading && (
            <Card className="p-12 flex flex-col items-center justify-center text-center border-dashed">
              <Sparkles className="h-16 w-16 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">
                Your generated image will appear here
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
