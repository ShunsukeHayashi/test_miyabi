import { useState } from 'react';
import { apiClient, type GenerateImageRequest } from '@/lib/api-client';
import { useAppStore } from '@/lib/store';
import { useToast } from './use-toast';

export function useGenerate() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { addToHistory, settings } = useAppStore();

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
            model: params.model,
            result: {
              url: item.url,
            },
            params: {
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
