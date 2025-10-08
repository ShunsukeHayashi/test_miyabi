"use client"

import * as React from "react"
import { CheckCircle2, Loader2, XCircle, Clock } from "lucide-react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type GenerationStatus = "idle" | "preparing" | "generating" | "completed" | "error"

interface GenerationProgressProps {
  status: GenerationStatus
  progress?: number // 0-100
  message?: string
  estimatedTime?: number // in seconds
  className?: string
}

export function GenerationProgress({
  status,
  progress = 0,
  message,
  estimatedTime,
  className
}: GenerationProgressProps) {
  const [displayProgress, setDisplayProgress] = React.useState(progress)

  React.useEffect(() => {
    // Smooth progress animation
    const interval = setInterval(() => {
      setDisplayProgress((prev) => {
        if (prev < progress) {
          return Math.min(prev + 1, progress)
        }
        return progress
      })
    }, 20)

    return () => clearInterval(interval)
  }, [progress])

  const statusConfig = {
    idle: {
      icon: null,
      color: "text-muted-foreground",
      bgColor: "bg-muted",
      message: "Ready to generate"
    },
    preparing: {
      icon: <Loader2 className="h-5 w-5 animate-spin" />,
      color: "text-blue-500",
      bgColor: "bg-blue-500",
      message: "Preparing generation..."
    },
    generating: {
      icon: <Loader2 className="h-5 w-5 animate-spin" />,
      color: "text-primary",
      bgColor: "bg-primary",
      message: "Generating image..."
    },
    completed: {
      icon: <CheckCircle2 className="h-5 w-5" />,
      color: "text-green-500",
      bgColor: "bg-green-500",
      message: "Generation completed!"
    },
    error: {
      icon: <XCircle className="h-5 w-5" />,
      color: "text-destructive",
      bgColor: "bg-destructive",
      message: "Generation failed"
    }
  }

  const config = statusConfig[status]
  const displayMessage = message || config.message

  const formatTime = (seconds: number) => {
    if (seconds < 60) {
      return `${Math.round(seconds)}s`
    }
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.round(seconds % 60)
    return `${minutes}m ${remainingSeconds}s`
  }

  return (
    <Card className={cn("p-6", className)}>
      <div className="space-y-4">
        {/* Header with icon and message */}
        <div className="flex items-center gap-3">
          {config.icon && (
            <div className={cn("shrink-0", config.color)}>
              {config.icon}
            </div>
          )}
          <div className="flex-1 space-y-1">
            <p className={cn("text-sm font-medium", config.color)}>
              {displayMessage}
            </p>
            {(status === "preparing" || status === "generating") && estimatedTime && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                <span>Est. {formatTime(estimatedTime)}</span>
              </div>
            )}
          </div>
          {(status === "preparing" || status === "generating") && (
            <div className={cn("text-sm font-semibold", config.color)}>
              {Math.round(displayProgress)}%
            </div>
          )}
        </div>

        {/* Progress bar */}
        {(status === "preparing" || status === "generating") && (
          <div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className={cn(
                "h-full transition-all duration-300 ease-out",
                config.bgColor
              )}
              style={{ width: `${displayProgress}%` }}
            />

            {/* Animated shimmer effect */}
            {displayProgress < 100 && (
              <div
                className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent"
              />
            )}
          </div>
        )}

        {/* Success/Error message for completed states */}
        {status === "completed" && (
          <div className="rounded-md bg-green-50 dark:bg-green-950/20 p-3">
            <p className="text-sm text-green-700 dark:text-green-400">
              Your image has been generated successfully!
            </p>
          </div>
        )}

        {status === "error" && (
          <div className="rounded-md bg-destructive/10 p-3">
            <p className="text-sm text-destructive">
              {message || "An error occurred during generation. Please try again."}
            </p>
          </div>
        )}
      </div>
    </Card>
  )
}

// Export status type for use in other components
export type { GenerationStatus }
