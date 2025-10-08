'use client'

import { useReportWebVitals } from 'next/web-vitals'

/**
 * Web Vitals Monitoring Component
 *
 * Tracks Core Web Vitals and sends to analytics
 * @see https://nextjs.org/docs/app/api-reference/functions/use-report-web-vitals
 */
export function WebVitals() {
  useReportWebVitals((metric) => {
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Web Vitals]', metric)
    }

    // Send to analytics in production
    if (process.env.NODE_ENV === 'production') {
      // Example: Send to Google Analytics
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', metric.name, {
          value: Math.round(
            metric.name === 'CLS' ? metric.value * 1000 : metric.value
          ),
          event_label: metric.id,
          non_interaction: true,
        })
      }

      // Example: Send to custom analytics endpoint
      fetch('/api/analytics/web-vitals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: metric.name,
          value: metric.value,
          id: metric.id,
          rating: metric.rating,
        }),
      }).catch((error) => {
        // Silently fail analytics
        console.error('Failed to send web vitals:', error)
      })
    }
  })

  return null
}
