/**
 * Store Type Definitions
 *
 * TypeScript types for Zustand state management.
 * Defines generation history, favorites, and user settings.
 *
 * @module types/store
 */

import type {
  ImageGenerationResponse,
  VideoGenerationResponse,
  ImageGenerationModel,
  VideoGenerationModel,
  ImageSize,
} from '@/lib/types/byteplus';

/**
 * Generation type discriminator
 */
export type GenerationType = 'image' | 'video';

/**
 * Generation history item
 */
export interface GenerationHistory {
  /** Unique identifier */
  id: string;

  /** Generation type */
  type: GenerationType;

  /** Model used */
  model: ImageGenerationModel | VideoGenerationModel;

  /** Original prompt */
  prompt: string;

  /** Generated image/video URL */
  url: string;

  /** Thumbnail URL (for videos) */
  thumbnailUrl?: string;

  /** Revised/optimized prompt (if applicable) */
  revisedPrompt?: string;

  /** Generation timestamp */
  createdAt: number;

  /** Generation metadata */
  metadata?: {
    size?: ImageSize;
    seed?: number;
    generationTime?: number;
    [key: string]: any;
  };

  /** Whether this generation is favorited */
  isFavorite?: boolean;
}

/**
 * User settings for default generation parameters
 */
export interface UserSettings {
  /** Default image generation model */
  defaultImageModel: ImageGenerationModel;

  /** Default video generation model */
  defaultVideoModel: VideoGenerationModel;

  /** Default image size */
  defaultImageSize: ImageSize;

  /** Default watermark setting */
  defaultWatermark: boolean;

  /** Enable prompt optimization by default */
  autoOptimizePrompts: boolean;

  /** Maximum history items to keep (0 = unlimited) */
  maxHistoryItems: number;

  /** API configuration status */
  apiConfigured: boolean;

  /** Theme preference */
  theme: 'light' | 'dark' | 'system';
}

/**
 * Main Zustand store interface
 */
export interface GenerationStore {
  /** Generation history */
  history: GenerationHistory[];

  /** Favorite generation IDs */
  favorites: string[];

  /** User settings */
  settings: UserSettings;

  /** Add a new generation to history */
  addGeneration: (item: Omit<GenerationHistory, 'id' | 'createdAt'>) => void;

  /** Remove a generation from history */
  removeGeneration: (id: string) => void;

  /** Clear all history */
  clearHistory: () => void;

  /** Toggle favorite status */
  toggleFavorite: (id: string) => void;

  /** Get all favorite generations */
  getFavorites: () => GenerationHistory[];

  /** Update user settings (partial update) */
  updateSettings: (settings: Partial<UserSettings>) => void;

  /** Reset settings to defaults */
  resetSettings: () => void;

  /** Get generation by ID */
  getGenerationById: (id: string) => GenerationHistory | undefined;

  /** Filter history by type */
  filterByType: (type: GenerationType) => GenerationHistory[];

  /** Search history by prompt */
  searchHistory: (query: string) => GenerationHistory[];
}

/**
 * Default user settings
 */
export const defaultSettings: UserSettings = {
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
 * Store persistence configuration
 */
export interface StorageConfig {
  /** Storage key name */
  name: string;

  /** Storage version (for migrations) */
  version: number;

  /** Fields to persist */
  partialize?: (state: GenerationStore) => Partial<GenerationStore>;
}
