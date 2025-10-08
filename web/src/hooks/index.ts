/**
 * Hooks Index
 *
 * Central export for all custom React hooks.
 * Provides convenient single-import access to all hooks.
 *
 * @module hooks
 *
 * @example
 * ```tsx
 * // Import multiple hooks at once
 * import {
 *   useGenerateImage,
 *   useEditImage,
 *   useBatchGenerate,
 *   useGenerationHistory
 * } from '@/hooks';
 * ```
 */

// Generation hooks
export { useGenerateImage, useGenerate } from './use-generate';
export { useEditImage } from './use-edit-image';
export { useBatchGenerate } from './use-batch-generate';

// History management
export { useGenerationHistory } from './use-generation-history';

// UI hooks
export { useToast } from './use-toast';
