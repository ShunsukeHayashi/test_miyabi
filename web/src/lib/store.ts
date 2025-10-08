import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface GenerationHistoryItem {
  id: string;
  type: 'image' | 'video';
  prompt: string;
  optimizedPrompt?: string;
  model: string;
  result: {
    url: string;
    thumbnail_url?: string;
  };
  params: Record<string, any>;
  createdAt: number;
}

export interface UserSettings {
  defaultModel: string;
  defaultSize: '1K' | '2K' | '4K';
  defaultWatermark: boolean;
  enablePromptOptimization: boolean;
  theme: 'light' | 'dark' | 'system';
}

interface AppState {
  // Generation History
  history: GenerationHistoryItem[];
  addToHistory: (item: Omit<GenerationHistoryItem, 'id' | 'createdAt'>) => void;
  clearHistory: () => void;
  removeFromHistory: (id: string) => void;

  // User Settings
  settings: UserSettings;
  updateSettings: (settings: Partial<UserSettings>) => void;

  // Current Generation State
  isGenerating: boolean;
  setIsGenerating: (value: boolean) => void;
  currentPrompt: string;
  setCurrentPrompt: (prompt: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // History
      history: [],
      addToHistory: (item) =>
        set((state) => ({
          history: [
            {
              ...item,
              id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              createdAt: Date.now(),
            },
            ...state.history,
          ].slice(0, 100), // Keep only last 100 items
        })),
      clearHistory: () => set({ history: [] }),
      removeFromHistory: (id) =>
        set((state) => ({
          history: state.history.filter((item) => item.id !== id),
        })),

      // Settings
      settings: {
        defaultModel: 'seedream-4-0-250828',
        defaultSize: '2K',
        defaultWatermark: true,
        enablePromptOptimization: true,
        theme: 'system',
      },
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),

      // Current State
      isGenerating: false,
      setIsGenerating: (value) => set({ isGenerating: value }),
      currentPrompt: '',
      setCurrentPrompt: (prompt) => set({ currentPrompt: prompt }),
    }),
    {
      name: 'byteflow-storage',
      partialize: (state) => ({
        history: state.history,
        settings: state.settings,
      }),
    }
  )
);
