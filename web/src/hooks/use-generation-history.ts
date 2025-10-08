import { useMemo } from 'react';
import { useGenerationStore, useAppStore } from '@/lib/store';
import type { GenerationHistory } from '@/types/store';

/**
 * Custom hook for managing generation history
 *
 * Provides convenient access to generation history with filtering,
 * sorting, favorites management, and utility functions.
 *
 * @example
 * ```tsx
 * const {
 *   history,
 *   imageHistory,
 *   videoHistory,
 *   favorites,
 *   clearHistory,
 *   removeItem,
 *   getItemById,
 *   toggleFavorite
 * } = useGenerationHistory();
 *
 * // Display all history
 * history.forEach(item => {
 *   console.log(item.prompt, item.url);
 * });
 *
 * // Filter by type
 * const images = imageHistory;
 * const videos = videoHistory;
 *
 * // Toggle favorite
 * toggleFavorite('item-id');
 *
 * // Remove specific item
 * removeItem('item-id');
 *
 * // Clear all history
 * clearHistory();
 * ```
 */
export function useGenerationHistory() {
  const {
    history,
    favorites,
    clearHistory,
    removeGeneration,
    toggleFavorite,
    getFavorites,
    getGenerationById,
    filterByType,
    searchHistory,
  } = useGenerationStore();

  // Filter history by type
  const imageHistory = useMemo(
    () => filterByType('image'),
    [filterByType, history]
  );

  const videoHistory = useMemo(
    () => filterByType('video'),
    [filterByType, history]
  );

  // Get favorite generations
  const favoriteItems = useMemo(() => getFavorites(), [getFavorites, favorites, history]);

  // Get recent items (last N items)
  const getRecentItems = (count: number): GenerationHistory[] => {
    return history.slice(0, count);
  };

  // Get item by ID (wrapper for store method)
  const getItemById = (id: string): GenerationHistory | undefined => {
    return getGenerationById(id);
  };

  // Search history by prompt text (wrapper for store method)
  const searchByPrompt = (query: string): GenerationHistory[] => {
    return searchHistory(query);
  };

  // Filter by model
  const filterByModel = (model: string): GenerationHistory[] => {
    return history.filter((item) => item.model === model);
  };

  // Get items within date range
  const getItemsByDateRange = (
    startDate: Date,
    endDate: Date
  ): GenerationHistory[] => {
    const startTime = startDate.getTime();
    const endTime = endDate.getTime();

    return history.filter(
      (item) => item.createdAt >= startTime && item.createdAt <= endTime
    );
  };

  // Get today's history
  const getTodayHistory = (): GenerationHistory[] => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return getItemsByDateRange(today, tomorrow);
  };

  // Get this week's history
  const getThisWeekHistory = (): GenerationHistory[] => {
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    weekStart.setHours(0, 0, 0, 0);

    return history.filter((item) => item.createdAt >= weekStart.getTime());
  };

  // Export history as JSON
  const exportHistory = (): string => {
    return JSON.stringify(history, null, 2);
  };

  // Import history from JSON
  const importHistory = (jsonString: string): void => {
    try {
      const importedHistory = JSON.parse(jsonString);
      if (Array.isArray(importedHistory)) {
        // Note: This would require a new store action to set history directly
        console.warn('Import functionality requires store update');
      }
    } catch (err) {
      console.error('Failed to import history:', err);
      throw new Error('Invalid history JSON format');
    }
  };

  // Statistics
  const stats = useMemo(() => {
    const modelsUsed = Array.from(new Set(history.map((item) => item.model)));

    return {
      total: history.length,
      images: imageHistory.length,
      videos: videoHistory.length,
      favorites: favorites.length,
      modelsUsed: modelsUsed.length,
      models: modelsUsed,
      oldestDate: history.length > 0 ? history[history.length - 1].createdAt : null,
      newestDate: history.length > 0 ? history[0].createdAt : null,
    };
  }, [history, imageHistory, videoHistory, favorites]);

  return {
    // Core data
    history,
    imageHistory,
    videoHistory,
    favorites: favoriteItems,

    // Management functions
    clearHistory,
    removeItem: removeGeneration,
    toggleFavorite,

    // Query functions
    getRecentItems,
    getItemById,
    searchByPrompt,
    filterByModel,
    getItemsByDateRange,
    getTodayHistory,
    getThisWeekHistory,

    // Export/Import
    exportHistory,
    importHistory,

    // Statistics
    stats,
  };
}
