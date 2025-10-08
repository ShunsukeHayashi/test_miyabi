/**
 * Custom Hooks for Generation Store
 *
 * Convenient React hooks for accessing Zustand store.
 * Provides optimized selectors to prevent unnecessary re-renders.
 *
 * @module hooks/useGeneration
 */

import { useGenerationStore } from '@/lib/store';
import type { GenerationHistory, UserSettings, GenerationType } from '@/types/store';

/**
 * Get generation history
 *
 * @returns Array of generation history items
 *
 * @example
 * ```typescript
 * function HistoryList() {
 *   const history = useHistory();
 *   return <div>{history.map(item => <HistoryCard key={item.id} {...item} />)}</div>;
 * }
 * ```
 */
export function useHistory(): GenerationHistory[] {
  return useGenerationStore((state) => state.history);
}

/**
 * Get favorite generations
 *
 * @returns Array of favorited generation history items
 *
 * @example
 * ```typescript
 * function FavoritesList() {
 *   const favorites = useFavorites();
 *   return <div>{favorites.map(item => <Card key={item.id} {...item} />)}</div>;
 * }
 * ```
 */
export function useFavorites(): GenerationHistory[] {
  return useGenerationStore((state) => state.getFavorites());
}

/**
 * Get user settings
 *
 * @returns Current user settings
 *
 * @example
 * ```typescript
 * function SettingsForm() {
 *   const settings = useSettings();
 *   return <div>Default model: {settings.defaultImageModel}</div>;
 * }
 * ```
 */
export function useSettings(): UserSettings {
  return useGenerationStore((state) => state.settings);
}

/**
 * Hook for adding generations to history
 *
 * @returns Function to add generation to history
 *
 * @example
 * ```typescript
 * function GenerateButton() {
 *   const addGeneration = useAddGeneration();
 *
 *   const handleGenerate = async () => {
 *     const result = await apiClient.generateImage({...});
 *     addGeneration({
 *       type: 'image',
 *       model: 'seedream-4-0-250828',
 *       prompt: 'A sunset',
 *       url: result.data[0].url
 *     });
 *   };
 * }
 * ```
 */
export function useAddGeneration() {
  return useGenerationStore((state) => state.addGeneration);
}

/**
 * Hook for removing generations
 *
 * @returns Function to remove generation by ID
 *
 * @example
 * ```typescript
 * function DeleteButton({ id }) {
 *   const removeGeneration = useRemoveGeneration();
 *   return <button onClick={() => removeGeneration(id)}>Delete</button>;
 * }
 * ```
 */
export function useRemoveGeneration() {
  return useGenerationStore((state) => state.removeGeneration);
}

/**
 * Hook for clearing all history
 *
 * @returns Function to clear all generation history
 *
 * @example
 * ```typescript
 * function ClearAllButton() {
 *   const clearHistory = useClearHistory();
 *   return <button onClick={clearHistory}>Clear All</button>;
 * }
 * ```
 */
export function useClearHistory() {
  return useGenerationStore((state) => state.clearHistory);
}

/**
 * Hook for toggling favorites
 *
 * @returns Function to toggle favorite status by ID
 *
 * @example
 * ```typescript
 * function FavoriteButton({ id }) {
 *   const toggleFavorite = useToggleFavorite();
 *   return <button onClick={() => toggleFavorite(id)}>⭐</button>;
 * }
 * ```
 */
export function useToggleFavorite() {
  return useGenerationStore((state) => state.toggleFavorite);
}

/**
 * Hook for updating settings
 *
 * @returns Function to update user settings
 *
 * @example
 * ```typescript
 * function SettingsForm() {
 *   const updateSettings = useUpdateSettings();
 *
 *   const handleSubmit = (values) => {
 *     updateSettings({ defaultImageModel: values.model });
 *   };
 * }
 * ```
 */
export function useUpdateSettings() {
  return useGenerationStore((state) => state.updateSettings);
}

/**
 * Hook for resetting settings to defaults
 *
 * @returns Function to reset settings
 *
 * @example
 * ```typescript
 * function ResetButton() {
 *   const resetSettings = useResetSettings();
 *   return <button onClick={resetSettings}>Reset to Defaults</button>;
 * }
 * ```
 */
export function useResetSettings() {
  return useGenerationStore((state) => state.resetSettings);
}

/**
 * Hook to get a specific generation by ID
 *
 * @param id - Generation ID
 * @returns Generation history item or undefined
 *
 * @example
 * ```typescript
 * function GenerationDetail({ id }) {
 *   const generation = useGenerationById(id);
 *   if (!generation) return <div>Not found</div>;
 *   return <div>{generation.prompt}</div>;
 * }
 * ```
 */
export function useGenerationById(id: string): GenerationHistory | undefined {
  return useGenerationStore((state) => state.getGenerationById(id));
}

/**
 * Hook to filter history by generation type
 *
 * @param type - Generation type ('image' or 'video')
 * @returns Filtered generation history
 *
 * @example
 * ```typescript
 * function ImageHistory() {
 *   const images = useHistoryByType('image');
 *   return <div>{images.map(img => <ImageCard key={img.id} {...img} />)}</div>;
 * }
 * ```
 */
export function useHistoryByType(type: GenerationType): GenerationHistory[] {
  return useGenerationStore((state) => state.filterByType(type));
}

/**
 * Hook to search history by query string
 *
 * @param query - Search query
 * @returns Matching generation history items
 *
 * @example
 * ```typescript
 * function SearchResults({ query }) {
 *   const results = useSearchHistory(query);
 *   return <div>{results.map(item => <Card key={item.id} {...item} />)}</div>;
 * }
 * ```
 */
export function useSearchHistory(query: string): GenerationHistory[] {
  return useGenerationStore((state) => state.searchHistory(query));
}

/**
 * Hook for all store actions (for advanced usage)
 *
 * @returns Object containing all store actions
 *
 * @example
 * ```typescript
 * function ComplexComponent() {
 *   const actions = useGenerationActions();
 *
 *   const handleOperation = () => {
 *     actions.addGeneration({...});
 *     actions.toggleFavorite('some-id');
 *     actions.updateSettings({...});
 *   };
 * }
 * ```
 */
export function useGenerationActions() {
  return useGenerationStore((state) => ({
    addGeneration: state.addGeneration,
    removeGeneration: state.removeGeneration,
    clearHistory: state.clearHistory,
    toggleFavorite: state.toggleFavorite,
    updateSettings: state.updateSettings,
    resetSettings: state.resetSettings,
  }));
}
