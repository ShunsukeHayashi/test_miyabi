/**
 * Text-to-Image Generation Page
 *
 * Main page for generating images from text prompts using SEEDREAM models.
 * Integrates TextToImageForm with real-time progress tracking and image preview.
 */

'use client';

import { useState } from 'react';
// import { TextToImageForm } from '@/components/forms'; // TODO: Implement TextToImageForm
import { GenerationProgress, type GenerationStatus } from '@/components/custom/generation-progress';
import { ImagePreview } from '@/components/custom/image-preview';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Download, RefreshCw, Heart, Clock, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useGenerationStore } from '@/lib/store';
import { apiClient } from '@/lib/api-client';
import type { TextToImageFormData } from '@/lib/schemas';

interface GeneratedImage {
  url: string;
  revisedPrompt?: string;
  metadata: {
    prompt: string;
    model: string;
    size: string;
    seed?: number;
    generatedAt: number;
  };
}

export default function GeneratePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [generationStatus, setGenerationStatus] = useState<GenerationStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [generatedImage, setGeneratedImage] = useState<GeneratedImage | null>(null);
  const [lastFormData, setLastFormData] = useState<TextToImageFormData | null>(null);

  const { toast } = useToast();
  const { addGeneration, toggleFavorite, favorites } = useGenerationStore();

  const isFavorite = generatedImage && favorites.some(fav => fav === generatedImage.metadata.prompt);

  const handleGenerate = async (data: TextToImageFormData) => {
    setIsLoading(true);
    setGenerationStatus('preparing');
    setProgress(0);
    setLastFormData(data);

    try {
      // Simulate progress for better UX
      setProgress(10);
      await new Promise(resolve => setTimeout(resolve, 300));

      setGenerationStatus('generating');
      setProgress(30);

      // Call API
      const result = await apiClient.generateImage({
        model: data.model,
        prompt: data.prompt,
        size: data.size,
        watermark: data.watermark,
        seed: data.seed as number | undefined,
      });

      setProgress(90);

      if (result.data && result.data.length > 0) {
        const imageData: GeneratedImage = {
          url: result.data[0].url,
          revisedPrompt: result.data[0].revised_prompt,
          metadata: {
            prompt: data.prompt,
            model: data.model,
            size: data.size,
            seed: data.seed as number | undefined,
            generatedAt: Date.now(),
          },
        };

        setGeneratedImage(imageData);
        setProgress(100);
        setGenerationStatus('completed');

        // Add to history
        addGeneration({
          type: 'image',
          prompt: data.prompt,
          model: data.model as any,
          url: imageData.url,
          revisedPrompt: imageData.revisedPrompt,
        });

        toast({
          title: 'Image generated successfully!',
          description: 'Your image is ready to download.',
        });
      }
    } catch (error) {
      console.error('Generation failed:', error);
      setGenerationStatus('error');
      toast({
        title: 'Generation failed',
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = () => {
    if (lastFormData) {
      handleGenerate(lastFormData);
    }
  };

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage.url;
      link.download = `byteflow-${generatedImage.metadata.model}-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleToggleFavorite = () => {
    if (generatedImage) {
      const historyItem = { id: generatedImage.metadata.prompt, ...generatedImage };
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
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
          <div className="rounded-full bg-primary/10 p-3">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          Text-to-Image Generation
        </h1>
        <p className="text-muted-foreground text-lg">
          Create stunning AI-generated images from text prompts using SEEDREAM models
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-blue-100 dark:bg-blue-950 p-2">
                <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Model</p>
                <p className="text-lg font-semibold">SEEDREAM 4.0</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-green-100 dark:bg-green-950 p-2">
                <Clock className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg. Time</p>
                <p className="text-lg font-semibold">~8 seconds</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-purple-100 dark:bg-purple-950 p-2">
                <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Max Resolution</p>
                <p className="text-lg font-semibold">4K (4096px)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Form */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Generate Image</CardTitle>
              <CardDescription>Create images from text prompts</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Form component coming soon</p>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Output */}
        <div className="space-y-6">
          {/* Generation Progress */}
          {isLoading && (
            <GenerationProgress
              status={generationStatus}
              progress={progress}
              estimatedTime={generationStatus === 'generating' ? 8 : 5}
              message={
                generationStatus === 'preparing'
                  ? 'Preparing your request...'
                  : 'Creating your image...'
              }
            />
          )}

          {/* Generated Image */}
          {generatedImage && !isLoading && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Generated Image</CardTitle>
                  <CardDescription>
                    Created with {generatedImage.metadata.model}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ImagePreview
                    src={generatedImage.url}
                    alt={generatedImage.metadata.prompt}
                    onDownload={handleDownload}
                  />
                </CardContent>
              </Card>

              {/* Action Buttons */}
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
                  onClick={handleToggleFavorite}
                  variant="outline"
                  size="icon"
                  className={isFavorite ? 'text-red-500 border-red-500' : ''}
                >
                  <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
                </Button>
              </div>

              {/* AI-Enhanced Prompt */}
              {generatedImage.revisedPrompt && generatedImage.revisedPrompt !== generatedImage.metadata.prompt && (
                <Card className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20">
                  <CardHeader>
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      AI-Enhanced Prompt
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-blue-900 dark:text-blue-100">
                      {generatedImage.revisedPrompt}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Metadata */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Generation Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Model:</span>
                    <span className="font-medium">{generatedImage.metadata.model}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Size:</span>
                    <span className="font-medium">{generatedImage.metadata.size}</span>
                  </div>
                  {generatedImage.metadata.seed && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Seed:</span>
                      <span className="font-medium font-mono">{generatedImage.metadata.seed}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Generated:</span>
                    <span className="font-medium">
                      {new Date(generatedImage.metadata.generatedAt).toLocaleTimeString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Empty State */}
          {!generatedImage && !isLoading && (
            <Card className="border-dashed">
              <CardContent className="py-16 flex flex-col items-center justify-center text-center">
                <div className="rounded-full bg-muted p-6 mb-4">
                  <Sparkles className="h-12 w-12 text-muted-foreground/50" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Ready to Create</h3>
                <p className="text-muted-foreground max-w-sm">
                  Enter your prompt and click "Generate Image" to create stunning AI-generated artwork
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
