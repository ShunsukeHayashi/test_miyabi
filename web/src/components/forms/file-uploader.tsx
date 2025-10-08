"use client"

import { useState, useCallback, useRef } from "react"
import { Upload, X, Image as ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface FileUploaderProps {
  onFileSelect: (file: File, dataUrl: string) => void
  onClear?: () => void
  accept?: string
  maxSize?: number // in MB
  preview?: string
  className?: string
}

export function FileUploader({
  onFileSelect,
  onClear,
  accept = "image/*",
  maxSize = 10,
  preview,
  className,
}: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File): boolean => {
    // Check file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file")
      return false
    }

    // Check file size
    const sizeMB = file.size / (1024 * 1024)
    if (sizeMB > maxSize) {
      setError(`File size must be less than ${maxSize}MB`)
      return false
    }

    setError(null)
    return true
  }

  const handleFile = useCallback(
    (file: File) => {
      if (!validateFile(file)) return

      const reader = new FileReader()
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string
        onFileSelect(file, dataUrl)
      }
      reader.readAsDataURL(file)
    },
    [onFileSelect, maxSize]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)

      const files = Array.from(e.dataTransfer.files)
      if (files.length > 0) {
        handleFile(files[0])
      }
    },
    [handleFile]
  )

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (files && files.length > 0) {
        handleFile(files[0])
      }
    },
    [handleFile]
  )

  const handleClear = useCallback(() => {
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    onClear?.()
  }, [onClear])

  return (
    <div className={cn("space-y-4", className)}>
      {preview ? (
        <div className="relative aspect-square rounded-lg overflow-hidden border bg-muted">
          <Image
            src={preview}
            alt="Preview"
            fill
            className="object-cover"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={handleClear}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
            isDragging
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-primary/50",
            error && "border-destructive"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileInput}
            className="hidden"
          />

          <div className="flex flex-col items-center gap-2">
            <div className="rounded-full bg-primary/10 p-3">
              {isDragging ? (
                <Upload className="h-6 w-6 text-primary" />
              ) : (
                <ImageIcon className="h-6 w-6 text-primary" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium">
                {isDragging ? "Drop image here" : "Click to upload or drag and drop"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                PNG, JPG up to {maxSize}MB
              </p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  )
}
