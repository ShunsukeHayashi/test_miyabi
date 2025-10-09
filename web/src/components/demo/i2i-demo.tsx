"use client"

import { useState, useRef } from "react"
import { Wand2, Upload, X, Download, Copy, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useEditImage } from "@/hooks/use-edit-image"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"

export function I2IDemo() {
  const [prompt, setPrompt] = useState("")
  const [size, setSize] = useState<"1K" | "2K" | "4K">("2K")
  const [watermark, setWatermark] = useState(false)
  const [sourceImage, setSourceImage] = useState<string>("")
  const [sourceImagePreview, setSourceImagePreview] = useState<string>("")
  const [generatedImages, setGeneratedImages] = useState<any[]>([])
  const [generationTime, setGenerationTime] = useState<number>(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { editImage, isLoading } = useEditImage()
  const { toast } = useToast()

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Please upload an image file",
        variant: "destructive"
      })
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "Image size must be less than 10MB",
        variant: "destructive"
      })
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string
      setSourceImagePreview(dataUrl)
      setSourceImage(dataUrl)
    }
    reader.readAsDataURL(file)
  }

  const handleUrlInput = () => {
    const url = prompt.match(/https?:\/\/[^\s]+/)?.[0]
    if (url) {
      setSourceImage(url)
      setSourceImagePreview(url)
      setPrompt(prompt.replace(url, '').trim())
      toast({
        title: "Image URL detected",
        description: "Image URL has been set as source"
      })
    }
  }

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter editing instructions",
        variant: "destructive"
      })
      return
    }

    if (!sourceImage) {
      toast({
        title: "Error",
        description: "Please upload a source image",
        variant: "destructive"
      })
      return
    }

    const startTime = Date.now()
    try {
      const result = await editImage({
        image: sourceImage,
        prompt,
        size,
        watermark,
      })

      if (result.data) {
        setGeneratedImages(result.data)
        setGenerationTime((Date.now() - startTime) / 1000)
      }
    } catch (error) {
      console.error("Image editing failed:", error)
    }
  }

  const clearSourceImage = () => {
    setSourceImage("")
    setSourceImagePreview("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const exampleEdits = [
    "Transform into watercolor painting style",
    "Add dramatic sunset lighting and warm colors",
    "Convert to black and white with high contrast",
    "Make it look like a vintage photograph from the 1970s"
  ]

  return (
    <div className="space-y-6">
      {/* Source Image Upload */}
      <div className="space-y-2">
        <Label>Source Image</Label>
        {!sourceImagePreview ? (
          <div className="border-2 border-dashed rounded-lg p-8 text-center">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground mb-2">
              Upload an image to edit
            </p>
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              Choose Image
            </Button>
            <p className="text-xs text-muted-foreground mt-4">
              Supports JPG, PNG, WebP (max 10MB)
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="relative aspect-video rounded-lg overflow-hidden border bg-muted">
              <Image
                src={sourceImagePreview}
                alt="Source image"
                fill
                className="object-contain"
              />
              <Button
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={clearSourceImage}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="mr-2 h-3 w-3" />
              Change Image
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        )}
      </div>

      {/* Editing Instructions */}
      <div className="space-y-2">
        <Label htmlFor="edit-prompt">Editing Instructions</Label>
        <Textarea
          id="edit-prompt"
          placeholder="Describe how you want to edit the image..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={3}
          className="resize-none"
        />
        <p className="text-xs text-muted-foreground">
          {prompt.length} / 2000 characters
        </p>
      </div>

      {/* Example Edits */}
      <div className="space-y-2">
        <Label className="text-xs">Example Edits</Label>
        <div className="flex flex-wrap gap-2">
          {exampleEdits.map((example, idx) => (
            <Button
              key={idx}
              variant="outline"
              size="sm"
              onClick={() => setPrompt(example)}
              className="text-xs h-auto py-2"
            >
              {example}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Size Selection */}
        <div className="space-y-2">
          <Label htmlFor="size">Output Resolution</Label>
          <Select value={size} onValueChange={(v: any) => setSize(v)}>
            <SelectTrigger id="size">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1K">1K (1024×1024)</SelectItem>
              <SelectItem value="2K">2K (2048×2048)</SelectItem>
              <SelectItem value="4K">4K (4096×4096)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Watermark Toggle */}
        <div className="flex items-center justify-between pt-6">
          <div className="space-y-0.5">
            <Label htmlFor="watermark">Watermark</Label>
            <p className="text-xs text-muted-foreground">
              Add watermark
            </p>
          </div>
          <Switch
            id="watermark"
            checked={watermark}
            onCheckedChange={setWatermark}
          />
        </div>
      </div>

      {/* Generate Button */}
      <Button
        onClick={handleGenerate}
        disabled={isLoading || !prompt.trim() || !sourceImage}
        className="w-full"
        size="lg"
      >
        {isLoading ? (
          <>
            <Wand2 className="mr-2 h-4 w-4 animate-spin" />
            Editing Image...
          </>
        ) : (
          <>
            <Wand2 className="mr-2 h-4 w-4" />
            Edit Image
          </>
        )}
      </Button>

      {/* Generated Images */}
      {generatedImages.length > 0 && (
        <div className="space-y-4 pt-4 border-t">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Edited Images</h3>
            <Badge variant="secondary">
              {generationTime.toFixed(2)}s
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {generatedImages.map((img, idx) => (
              <div key={idx} className="space-y-2">
                <div className="relative aspect-square rounded-lg overflow-hidden border bg-muted">
                  <Image
                    src={img.url}
                    alt={`Edited image ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => window.open(img.url, '_blank')}
                  >
                    <Download className="mr-2 h-3 w-3" />
                    Download
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(img.url)
                      toast({ title: "URL copied!" })
                    }}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
