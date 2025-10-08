import { useState } from 'react';
import { apiClient, type EditImageRequest } from '@/lib/api-client';
import { useAppStore } from '@/lib/store';
import { useToast } from './use-toast';

/**
 * Custom hook for image-to-image editing
 *
 * Handles image editing with loading states, error handling,
 * and automatic history tracking. Uses the BytePlus SeedEdit i2i model.
 *
 * @example
 * ```tsx
 * const { editImage, isLoading, error } = useEditImage();
 *
 * const handleEdit = async () => {
 *   try {
 *     const result = await editImage({
 *       image: 'https://example.com/original.jpg',
 *       prompt: 'Add a rainbow in the sky, enhance colors',
 *       size: '2K',
 *       watermark: false
 *     });
 *     console.log('Edited:', result.data[0].url);
 *   } catch (err) {
 *     console.error('Edit failed:', err);
 *   }
 * };
 * ```
 */
export function useEditImage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { addGeneration } = useAppStore();

  const editImage = async (params: EditImageRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      // Edit image using i2i model
      const result = await apiClient.editImage(params);

      // Add to history
      if (result.data && result.data.length > 0) {
        result.data.forEach((item: any) => {
          addGeneration({
            type: 'image',
            prompt: params.prompt,
            model: 'Bytedance-SeedEdit-3.0-i2i' as any,
            url: item.url,
            revisedPrompt: item.revised_prompt,
            metadata: {
              originalImage: Array.isArray(params.image) ? params.image[0] : params.image,
              size: params.size,
              watermark: params.watermark,
              seed: params.seed,
            },
          });
        });
      }

      toast({
        title: 'Success',
        description: `Edited ${result.data.length} image(s)`,
      });

      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to edit image';
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
    editImage,
    isLoading,
    error,
  };
}
