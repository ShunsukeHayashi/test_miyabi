'use client'

import { useEffect } from 'react'
import { useGenerationStore } from '@/lib/store'

/**
 * Hydration Boundary
 *
 * Hydrates Zustand persist store on client-side only
 * Prevents hydration mismatch errors with localStorage
 */
export function HydrationBoundary({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Rehydrate store from localStorage on client
    useGenerationStore.persist.rehydrate()
  }, [])

  return <>{children}</>
}
