/**
 * Zustand Store for Byteflow Application
 *
 * Global state management with localStorage persistence.
 * Manages generation history, favorites, and user settings.
 *
 * @module lib/store
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type {
  GenerationStore,
  GenerationHistory,
  UserSettings,
  GenerationType,
  defaultSettings,
} from '@/types/store';

// Import default settings
const DEFAULT_SETTINGS: UserSettings = {
  defaultImageModel: 'seedream-4-0-250828',
  defaultVideoModel: 'Bytedance-Seedance-1.0-pro',
  defaultImageSize: '2K',
  defaultWatermark: true,
  autoOptimizePrompts: false,
  maxHistoryItems: 100,
  apiConfigured: false,
  theme: 'system',
};

/**
 * Generate unique ID for history items
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

/**
 * Main Zustand store with persistence
 *
 * @example
 * ```typescript
 * import { useGenerationStore } from '@/lib/store';
 *
 * function MyComponent() {
 *   const { history, addGeneration, toggleFavorite } = useGenerationStore();
 *
 *   const handleGenerate = (result) => {
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
export const useGenerationStore = create<GenerationStore>()(
  persist(
    (set, get) => ({
      // State
      history: [],
      favorites: [],
      settings: DEFAULT_SETTINGS,

      // Actions
      addGeneration: (item) => {
        const newItem: GenerationHistory = {
          ...item,
          id: generateId(),
          createdAt: Date.now(),
          isFavorite: false,
        };

        set((state) => {
          const maxItems = state.settings.maxHistoryItems;
          const newHistory = [newItem, ...state.history];

          // Trim history if exceeds max items (0 = unlimited)
          const trimmedHistory =
            maxItems > 0 ? newHistory.slice(0, maxItems) : newHistory;

          return { history: trimmedHistory };
        });
      },

      removeGeneration: (id) => {
        set((state) => ({
          history: state.history.filter((item) => item.id !== id),
          favorites: state.favorites.filter((favId) => favId !== id),
        }));
      },

      clearHistory: () => {
        set({ history: [], favorites: [] });
      },

      toggleFavorite: (id) => {
        set((state) => {
          const isFavorite = state.favorites.includes(id);
          const newFavorites = isFavorite
            ? state.favorites.filter((favId) => favId !== id)
            : [...state.favorites, id];

          const newHistory = state.history.map((item) =>
            item.id === id ? { ...item, isFavorite: !isFavorite } : item
          );

          return {
            favorites: newFavorites,
            history: newHistory,
          };
        });
      },

      getFavorites: () => {
        const state = get();
        return state.history.filter((item) => state.favorites.includes(item.id));
      },

      updateSettings: (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        }));
      },

      resetSettings: () => {
        set({ settings: DEFAULT_SETTINGS });
      },

      getGenerationById: (id) => {
        return get().history.find((item) => item.id === id);
      },

      filterByType: (type: GenerationType) => {
        return get().history.filter((item) => item.type === type);
      },

      searchHistory: (query: string) => {
        const lowerQuery = query.toLowerCase();
        return get().history.filter(
          (item) =>
            item.prompt.toLowerCase().includes(lowerQuery) ||
            item.revisedPrompt?.toLowerCase().includes(lowerQuery) ||
            item.model.toLowerCase().includes(lowerQuery)
        );
      },
    }),
    {
      name: 'byteflow-storage',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      skipHydration: true, // Fix hydration mismatch - hydrate on client only
      partialize: (state) => ({
        history: state.history,
        favorites: state.favorites,
        settings: state.settings,
      }),
    }
  )
);

/**
 * Legacy export for backwards compatibility
 * @deprecated Use useGenerationStore instead
 */
export const useAppStore = useGenerationStore;
