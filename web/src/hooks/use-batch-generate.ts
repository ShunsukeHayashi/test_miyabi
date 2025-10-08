import { useState } from 'react';
import { apiClient, type BatchGenerateRequest } from '@/lib/api-client';
import { useAppStore } from '@/lib/store';
import { useToast } from './use-toast';

/**
 * Custom hook for batch image generation
 *
 * Handles batch generation of multiple images in parallel with loading states,
 * error handling, and automatic history tracking.
 *
 * @example
 * ```tsx
 * const { batchGenerate, isLoading, error, progress } = useBatchGenerate();
 *
 * const handleBatch = async () => {
 *   try {
 *     const result = await batchGenerate({
 *       prompts: [
 *         'A sunset over mountains',
 *         'A city at night',
 *         'A forest in autumn'
 *       ],
 *       sharedParams: {
 *         model: 'seedream-4-0-250828',
 *         size: '2K',
 *         watermark: true
 *       },
 *       maxConcurrency: 3
 *     });
 *     console.log(`Success rate: ${result.successRate * 100}%`);
 *   } catch (err) {
 *     console.error('Batch generation failed:', err);
 *   }
 * };
 * ```
 */
export function useBatchGenerate() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<{
    completed: number;
    total: number;
    successRate: number;
  } | null>(null);
  const { toast } = useToast();
  const { addGeneration } = useAppStore();

  const batchGenerate = async (params: BatchGenerateRequest) => {
    setIsLoading(true);
    setError(null);
    setProgress({
      completed: 0,
      total: params.prompts.length,
      successRate: 0,
    });

    try {
      // Generate images in batch
      const result = await apiClient.batchGenerate(params);

      // Add successful generations to history
      if (result.successful && result.successful.length > 0) {
        result.successful.forEach((item: any) => {
          if (item.data && item.data.length > 0) {
            item.data.forEach((imgData: any) => {
              addGeneration({
                type: 'image',
                prompt: item.metadata?.prompt || 'Batch generation',
                model: (params.sharedParams.model || 'seedream-4-0-250828') as any,
                url: imgData.url,
                revisedPrompt: imgData.revised_prompt,
                metadata: {
                  size: params.sharedParams.size,
                  watermark: params.sharedParams.watermark,
                  seed: params.sharedParams.seed,
                  batchGeneration: true,
                },
              });
            });
          }
        });
      }

      // Update progress
      setProgress({
        completed: params.prompts.length,
        total: params.prompts.length,
        successRate: result.successRate || 0,
      });

      // Show summary toast
      const successCount = result.successful?.length || 0;
      const failCount = result.failed?.length || 0;

      toast({
        title: 'Batch Generation Complete',
        description: `✅ ${successCount} succeeded, ❌ ${failCount} failed (${Math.round((result.successRate || 0) * 100)}% success rate)`,
      });

      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to generate images in batch';
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

  const resetProgress = () => {
    setProgress(null);
  };

  return {
    batchGenerate,
    isLoading,
    error,
    progress,
    resetProgress,
  };
}
