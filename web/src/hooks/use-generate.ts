import { useState } from 'react';
import { apiClient, type GenerateImageRequest } from '@/lib/api-client';
import { useAppStore } from '@/lib/store';
import { useToast } from './use-toast';

/**
 * Custom hook for text-to-image generation
 *
 * Handles image generation with loading states, error handling,
 * and automatic history tracking.
 *
 * @example
 * ```tsx
 * const { generateImage, isLoading, error } = useGenerateImage();
 *
 * const handleGenerate = async () => {
 *   try {
 *     const result = await generateImage({
 *       model: 'seedream-4-0-250828',
 *       prompt: 'A beautiful sunset over mountains',
 *       size: '2K',
 *       watermark: true
 *     });
 *     console.log('Generated:', result.data[0].url);
 *   } catch (err) {
 *     console.error('Generation failed:', err);
 *   }
 * };
 * ```
 */
export function useGenerateImage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { addGeneration: addToHistory } = useAppStore();

  const generateImage = async (params: GenerateImageRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      // Generate image
      const result = await apiClient.generateImage(params);

      // Add to history
      if (result.data && result.data.length > 0) {
        result.data.forEach((item: any) => {
          addToHistory({
            type: 'image',
            prompt: params.prompt,
            model: params.model as any,
            url: item.url,
            revisedPrompt: item.revised_prompt,
            metadata: {
              size: params.size,
              watermark: params.watermark,
              seed: params.seed,
            },
          });
        });
      }

      toast({
        title: 'Success',
        description: `Generated ${result.data.length} image(s)`,
      });

      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to generate image';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    generateImage,
    isLoading,
    error,
  };
}

// Legacy export for backward compatibility
export const useGenerate = useGenerateImage;
