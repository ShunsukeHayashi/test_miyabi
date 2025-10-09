/**
 * Loading Spinner Component
 *
 * Unified loading indicator with multiple variants and sizes
 */

import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl"
  variant?: "spinner" | "dots" | "pulse" | "bars"
  className?: string
  label?: string
}

export function LoadingSpinner({
  size = "md",
  variant = "spinner",
  className,
  label
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16"
  }

  const dotSizeClasses = {
    sm: "w-1.5 h-1.5",
    md: "w-2.5 h-2.5",
    lg: "w-4 h-4",
    xl: "w-6 h-6"
  }

  if (variant === "spinner") {
    return (
      <div className={cn("flex flex-col items-center gap-2", className)} role="status" aria-live="polite">
        <div className={cn(
          sizeClasses[size],
          "border-4 border-gray-200 dark:border-gray-700 border-t-blue-600 dark:border-t-blue-500 rounded-full animate-spin"
        )} />
        {label && (
          <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
            {label}
          </span>
        )}
        <span className="sr-only">Loading...</span>
      </div>
    )
  }

  if (variant === "dots") {
    return (
      <div className={cn("flex items-center gap-2", className)} role="status" aria-live="polite">
        <div className="flex gap-1.5">
          <div className={cn(dotSizeClasses[size], "bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]")} />
          <div className={cn(dotSizeClasses[size], "bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]")} />
          <div className={cn(dotSizeClasses[size], "bg-blue-600 rounded-full animate-bounce")} />
        </div>
        {label && (
          <span className="text-sm text-gray-600 dark:text-gray-400 font-medium ml-2">
            {label}
          </span>
        )}
        <span className="sr-only">Loading...</span>
      </div>
    )
  }

  if (variant === "pulse") {
    return (
      <div className={cn("flex flex-col items-center gap-2", className)} role="status" aria-live="polite">
        <div className={cn(
          sizeClasses[size],
          "bg-blue-600 dark:bg-blue-500 rounded-full animate-pulse"
        )} />
        {label && (
          <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
            {label}
          </span>
        )}
        <span className="sr-only">Loading...</span>
      </div>
    )
  }

  if (variant === "bars") {
    const barHeightClasses = {
      sm: "h-6",
      md: "h-10",
      lg: "h-14",
      xl: "h-20"
    }

    return (
      <div className={cn("flex items-end gap-1.5", className)} role="status" aria-live="polite">
        <div className="flex items-end gap-1">
          <div className={cn("w-1.5 bg-blue-600 rounded-full animate-pulse [animation-delay:-0.4s]", barHeightClasses[size])} />
          <div className={cn("w-1.5 bg-blue-600 rounded-full animate-pulse [animation-delay:-0.3s]", barHeightClasses[size])} />
          <div className={cn("w-1.5 bg-blue-600 rounded-full animate-pulse [animation-delay:-0.2s]", barHeightClasses[size])} />
          <div className={cn("w-1.5 bg-blue-600 rounded-full animate-pulse [animation-delay:-0.1s]", barHeightClasses[size])} />
          <div className={cn("w-1.5 bg-blue-600 rounded-full animate-pulse", barHeightClasses[size])} />
        </div>
        {label && (
          <span className="text-sm text-gray-600 dark:text-gray-400 font-medium ml-2">
            {label}
          </span>
        )}
        <span className="sr-only">Loading...</span>
      </div>
    )
  }

  return null
}

/**
 * Inline Spinner for buttons and small spaces
 */
export function InlineSpinner({ className }: { className?: string }) {
  return (
    <div
      className={cn("inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin", className)}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}

/**
 * Full-page loading overlay
 */
export function LoadingOverlay({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl flex flex-col items-center gap-4 max-w-sm mx-4">
        <LoadingSpinner size="lg" variant="spinner" />
        <p className="text-lg font-semibold text-gray-900 dark:text-white text-center">
          {message}
        </p>
      </div>
    </div>
  )
}
