"use client"

import * as React from "react"
import { Sparkles, AlertCircle } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface PromptEditorProps {
  value: string
  onChange: (value: string) => void
  label?: string
  placeholder?: string
  maxLength?: number
  minLength?: number
  rows?: number
  className?: string
  onOptimize?: () => void
  optimizing?: boolean
  showOptimize?: boolean
  error?: string
  disabled?: boolean
}

export function PromptEditor({
  value,
  onChange,
  label = "Prompt",
  placeholder = "Describe the image you want to generate...",
  maxLength = 2000,
  minLength = 0,
  rows = 4,
  className,
  onOptimize,
  optimizing = false,
  showOptimize = false,
  error,
  disabled = false
}: PromptEditorProps) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  const [isFocused, setIsFocused] = React.useState(false)

  const characterCount = value.length
  const isOverLimit = characterCount > maxLength
  const isUnderMinimum = characterCount < minLength && characterCount > 0
  const characterPercentage = (characterCount / maxLength) * 100

  const getCharacterCountColor = () => {
    if (isOverLimit) return "text-destructive"
    if (characterPercentage > 90) return "text-orange-500"
    if (characterPercentage > 75) return "text-yellow-500"
    return "text-muted-foreground"
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Allow Cmd/Ctrl + Enter to submit (can be handled by parent)
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.currentTarget.form?.requestSubmit()
    }
  }

  // Auto-resize textarea
  React.useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = "auto"
      textarea.style.height = `${textarea.scrollHeight}px`
    }
  }, [value])

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <Label htmlFor="prompt-editor" className="text-sm font-medium">
          {label}
        </Label>
        {showOptimize && onOptimize && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onOptimize}
            disabled={disabled || optimizing || !value.trim()}
            className="h-8 text-xs"
          >
            {optimizing ? (
              <>
                <Sparkles className="mr-1.5 h-3.5 w-3.5 animate-pulse" />
                Optimizing...
              </>
            ) : (
              <>
                <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                AI Optimize
              </>
            )}
          </Button>
        )}
      </div>

      <div className="relative">
        <textarea
          ref={textareaRef}
          id="prompt-editor"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={rows}
          disabled={disabled}
          className={cn(
            "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none transition-colors",
            isOverLimit && "border-destructive focus-visible:ring-destructive",
            isFocused && !isOverLimit && "border-primary"
          )}
          aria-invalid={isOverLimit || !!error}
          aria-describedby={
            error ? "prompt-error" : isOverLimit ? "prompt-limit" : "prompt-count"
          }
        />

        {/* Character count indicator */}
        <div className="absolute bottom-2 right-2 flex items-center gap-2">
          {isOverLimit && (
            <div className="flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5">
              <AlertCircle className="h-3 w-3 text-destructive" />
              <span className="text-xs font-medium text-destructive">Over limit</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer with character count and helper text */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          {error && (
            <p id="prompt-error" className="text-destructive flex items-center gap-1">
              <AlertCircle className="h-3.5 w-3.5" />
              {error}
            </p>
          )}
          {!error && isUnderMinimum && (
            <p className="text-muted-foreground">
              Minimum {minLength} characters required
            </p>
          )}
          {!error && !isUnderMinimum && !disabled && (
            <p className="text-muted-foreground">
              <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
                <span className="text-xs">⌘</span>↵
              </kbd>{" "}
              to submit
            </p>
          )}
        </div>

        <p
          id="prompt-count"
          className={cn("font-medium tabular-nums", getCharacterCountColor())}
        >
          {characterCount.toLocaleString()} / {maxLength.toLocaleString()}
        </p>
      </div>

      {/* Progress bar */}
      <div className="h-1 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className={cn(
            "h-full transition-all duration-200",
            isOverLimit ? "bg-destructive" : "bg-primary"
          )}
          style={{ width: `${Math.min(characterPercentage, 100)}%` }}
        />
      </div>
    </div>
  )
}
