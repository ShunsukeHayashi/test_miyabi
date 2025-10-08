/**
 * Zustand Store Tests
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { useGenerationStore } from '@/lib/store'
import { renderHook, act } from '@testing-library/react'

describe('Generation Store', () => {
  beforeEach(() => {
    // Reset store before each test
    const { clearHistory, resetSettings } = useGenerationStore.getState()
    clearHistory()
    resetSettings()
  })

  it('initializes with empty history', () => {
    const { result } = renderHook(() => useGenerationStore())
    expect(result.current.history).toEqual([])
    expect(result.current.favorites).toEqual([])
  })

  it('adds generation to history', () => {
    const { result } = renderHook(() => useGenerationStore())

    act(() => {
      result.current.addGeneration({
        type: 'image',
        model: 'seedream-4-0-250828',
        prompt: 'Test prompt',
        url: 'https://example.com/image.png',
      })
    })

    expect(result.current.history).toHaveLength(1)
    expect(result.current.history[0].prompt).toBe('Test prompt')
    expect(result.current.history[0].type).toBe('image')
  })

  it('removes generation from history', () => {
    const { result } = renderHook(() => useGenerationStore())

    let generationId: string

    act(() => {
      result.current.addGeneration({
        type: 'image',
        model: 'seedream-4-0-250828',
        prompt: 'Test prompt',
        url: 'https://example.com/image.png',
      })
      generationId = result.current.history[0].id
    })

    expect(result.current.history).toHaveLength(1)

    act(() => {
      result.current.removeGeneration(generationId)
    })

    expect(result.current.history).toHaveLength(0)
  })

  it('toggles favorite status', () => {
    const { result } = renderHook(() => useGenerationStore())

    let generationId: string

    act(() => {
      result.current.addGeneration({
        type: 'image',
        model: 'seedream-4-0-250828',
        prompt: 'Test prompt',
        url: 'https://example.com/image.png',
      })
      generationId = result.current.history[0].id
    })

    expect(result.current.favorites).toHaveLength(0)

    act(() => {
      result.current.toggleFavorite(generationId)
    })

    expect(result.current.favorites).toHaveLength(1)
    expect(result.current.favorites[0]).toBe(generationId)

    act(() => {
      result.current.toggleFavorite(generationId)
    })

    expect(result.current.favorites).toHaveLength(0)
  })

  it('updates settings', () => {
    const { result } = renderHook(() => useGenerationStore())

    expect(result.current.settings.defaultImageSize).toBe('2K')

    act(() => {
      result.current.updateSettings({ defaultImageSize: '4K' })
    })

    expect(result.current.settings.defaultImageSize).toBe('4K')
  })

  it('filters history by type', () => {
    const { result } = renderHook(() => useGenerationStore())

    act(() => {
      result.current.addGeneration({
        type: 'image',
        model: 'seedream-4-0-250828',
        prompt: 'Image test',
        url: 'https://example.com/image.png',
      })
      result.current.addGeneration({
        type: 'video',
        model: 'Bytedance-Seedance-1.0-pro',
        prompt: 'Video test',
        url: 'https://example.com/video.mp4',
      })
    })

    const images = result.current.filterByType('image')
    const videos = result.current.filterByType('video')

    expect(images).toHaveLength(1)
    expect(videos).toHaveLength(1)
    expect(images[0].type).toBe('image')
    expect(videos[0].type).toBe('video')
  })

  it('searches history by prompt', () => {
    const { result } = renderHook(() => useGenerationStore())

    act(() => {
      result.current.addGeneration({
        type: 'image',
        model: 'seedream-4-0-250828',
        prompt: 'A beautiful sunset',
        url: 'https://example.com/sunset.png',
      })
      result.current.addGeneration({
        type: 'image',
        model: 'seedream-4-0-250828',
        prompt: 'A city at night',
        url: 'https://example.com/city.png',
      })
    })

    const results = result.current.searchHistory('sunset')

    expect(results).toHaveLength(1)
    expect(results[0].prompt).toContain('sunset')
  })
})
