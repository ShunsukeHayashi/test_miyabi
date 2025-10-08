"use client"

import * as React from "react"
import { Download, Maximize2, X } from "lucide-react"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface ImagePreviewProps {
  src: string
  alt?: string
  className?: string
  aspectRatio?: "square" | "video" | "portrait"
  onDownload?: () => void
  loading?: boolean
}

export function ImagePreview({
  src,
  alt = "Generated image",
  className,
  aspectRatio = "square",
  onDownload,
  loading = false
}: ImagePreviewProps) {
  const [isZoomed, setIsZoomed] = React.useState(false)
  const [imageError, setImageError] = React.useState(false)
  const [scale, setScale] = React.useState(1)

  const aspectRatioClasses = {
    square: "aspect-square",
    video: "aspect-video",
    portrait: "aspect-[3/4]"
  }

  const handleDownload = async () => {
    if (onDownload) {
      onDownload()
      return
    }

    try {
      const response = await fetch(src)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `byteflow-${Date.now()}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Failed to download image:", error)
    }
  }

  const handleWheel = (e: React.WheelEvent) => {
    if (isZoomed) {
      e.preventDefault()
      const delta = e.deltaY * -0.001
      const newScale = Math.min(Math.max(1, scale + delta), 3)
      setScale(newScale)
    }
  }

  if (loading) {
    return (
      <Card className={cn("overflow-hidden", aspectRatioClasses[aspectRatio], className)}>
        <div className="flex h-full items-center justify-center bg-muted">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground">Loading image...</p>
          </div>
        </div>
      </Card>
    )
  }

  if (imageError) {
    return (
      <Card className={cn("overflow-hidden", aspectRatioClasses[aspectRatio], className)}>
        <div className="flex h-full items-center justify-center bg-muted">
          <div className="flex flex-col items-center gap-2 text-center p-4">
            <X className="h-8 w-8 text-destructive" />
            <p className="text-sm text-muted-foreground">Failed to load image</p>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Dialog open={isZoomed} onOpenChange={setIsZoomed}>
      <Card className={cn("group relative overflow-hidden", aspectRatioClasses[aspectRatio], className)}>
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover transition-transform duration-200"
          onError={() => setImageError(true)}
        />

        {/* Hover overlay with controls */}
        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
          <DialogTrigger asChild>
            <Button
              size="icon"
              variant="secondary"
              className="h-10 w-10"
              aria-label="Zoom image"
            >
              <Maximize2 className="h-5 w-5" />
            </Button>
          </DialogTrigger>

          <Button
            size="icon"
            variant="secondary"
            className="h-10 w-10"
            onClick={handleDownload}
            aria-label="Download image"
          >
            <Download className="h-5 w-5" />
          </Button>
        </div>
      </Card>

      <DialogContent
        className="max-w-[95vw] max-h-[95vh] p-0"
        onWheel={handleWheel}
      >
        <div className="relative flex items-center justify-center overflow-auto">
          <img
            src={src}
            alt={alt}
            className="max-h-[90vh] w-auto object-contain transition-transform duration-200"
            style={{ transform: `scale(${scale})` }}
          />
        </div>

        {/* Zoom controls */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full bg-black/80 px-4 py-2">
          <Button
            size="sm"
            variant="ghost"
            className="h-8 text-white hover:text-white hover:bg-white/20"
            onClick={() => setScale(Math.max(1, scale - 0.25))}
            disabled={scale <= 1}
          >
            -
          </Button>
          <span className="text-sm text-white min-w-[3rem] text-center">
            {Math.round(scale * 100)}%
          </span>
          <Button
            size="sm"
            variant="ghost"
            className="h-8 text-white hover:text-white hover:bg-white/20"
            onClick={() => setScale(Math.min(3, scale + 0.25))}
            disabled={scale >= 3}
          >
            +
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
