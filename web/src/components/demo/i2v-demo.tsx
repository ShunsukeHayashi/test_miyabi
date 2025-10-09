"use client"

import { useState, useRef } from "react"
import { Video, Upload, X, Download, Copy, Image as ImageIcon, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { apiClient } from "@/lib/api-client"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"

export function I2VDemo() {
  const [prompt, setPrompt] = useState("")
  const [resolution, setResolution] = useState<"720P" | "1080P">("1080P")
  const [ratio, setRatio] = useState<"16:9" | "9:16" | "1:1">("16:9")
  const [duration, setDuration] = useState<5 | 10>(5)
  const [fixedLens, setFixedLens] = useState(false)
  const [watermark, setWatermark] = useState(false)
  const [sourceImage, setSourceImage] = useState<string>("")
  const [sourceImagePreview, setSourceImagePreview] = useState<string>("")
  const [generatedVideos, setGeneratedVideos] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [generationTime, setGenerationTime] = useState<number>(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { toast } = useToast()

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Please upload an image file",
        variant: "destructive"
      })
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "Image size must be less than 10MB",
        variant: "destructive"
      })
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string
      setSourceImagePreview(dataUrl)
      setSourceImage(dataUrl)
    }
    reader.readAsDataURL(file)
  }

  const handleGenerate = async () => {
    if (!sourceImage) {
      toast({
        title: "Error",
        description: "Please upload a source image",
        variant: "destructive"
      })
      return
    }

    const startTime = Date.now()
    setIsLoading(true)

    try {
      const result = await apiClient.generateVideo({
        model: 'Bytedance-Seedance-1.0-pro',
        image: sourceImage,
        prompt: prompt || undefined,
        resolution,
        ratio,
        duration,
        fixed_lens: fixedLens,
        watermark,
      })

      if (result.data) {
        setGeneratedVideos(result.data)
        setGenerationTime((Date.now() - startTime) / 1000)
        toast({
          title: "Success",
          description: `Generated ${result.data.length} video(s)`
        })
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Video generation failed",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const clearSourceImage = () => {
    setSourceImage("")
    setSourceImagePreview("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const examplePrompts = [
    "Dynamic camera movement, cinematic style, smooth motion",
    "Gentle zoom in, professional cinematography",
    "Pan from left to right, showcase the scene",
    "Slow motion effect, dramatic atmosphere"
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
              Upload an image to animate
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

      {/* Motion Prompt (Optional) */}
      <div className="space-y-2">
        <Label htmlFor="motion-prompt">Motion Prompt (Optional)</Label>
        <Textarea
          id="motion-prompt"
          placeholder="Describe the camera movement or animation style..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={2}
          className="resize-none"
        />
      </div>

      {/* Example Prompts */}
      <div className="space-y-2">
        <Label className="text-xs">Example Motion Prompts</Label>
        <div className="flex flex-wrap gap-2">
          {examplePrompts.map((example, idx) => (
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
        {/* Resolution */}
        <div className="space-y-2">
          <Label htmlFor="resolution">Resolution</Label>
          <Select value={resolution} onValueChange={(v: any) => setResolution(v)}>
            <SelectTrigger id="resolution">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="720P">720P (HD)</SelectItem>
              <SelectItem value="1080P">1080P (Full HD)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Aspect Ratio */}
        <div className="space-y-2">
          <Label htmlFor="ratio">Aspect Ratio</Label>
          <Select value={ratio} onValueChange={(v: any) => setRatio(v)}>
            <SelectTrigger id="ratio">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="16:9">16:9 (Landscape)</SelectItem>
              <SelectItem value="9:16">9:16 (Portrait)</SelectItem>
              <SelectItem value="1:1">1:1 (Square)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Duration */}
        <div className="space-y-2">
          <Label htmlFor="duration">Duration</Label>
          <Select value={duration.toString()} onValueChange={(v) => setDuration(Number(v) as 5 | 10)}>
            <SelectTrigger id="duration">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 seconds</SelectItem>
              <SelectItem value="10">10 seconds</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Fixed Lens */}
        <div className="flex items-center justify-between pt-6">
          <div className="space-y-0.5">
            <Label htmlFor="fixed-lens">Fixed Camera</Label>
            <p className="text-xs text-muted-foreground">
              Disable camera movement
            </p>
          </div>
          <Switch
            id="fixed-lens"
            checked={fixedLens}
            onCheckedChange={setFixedLens}
          />
        </div>
      </div>

      {/* Watermark Toggle */}
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="watermark">Watermark</Label>
          <p className="text-xs text-muted-foreground">
            Add BytePlus watermark to video
          </p>
        </div>
        <Switch
          id="watermark"
          checked={watermark}
          onCheckedChange={setWatermark}
        />
      </div>

      {/* Generate Button */}
      <Button
        onClick={handleGenerate}
        disabled={isLoading || !sourceImage}
        className="w-full"
        size="lg"
      >
        {isLoading ? (
          <>
            <Video className="mr-2 h-4 w-4 animate-spin" />
            Generating Video...
          </>
        ) : (
          <>
            <Video className="mr-2 h-4 w-4" />
            Generate Video
          </>
        )}
      </Button>

      {/* Generated Videos */}
      {generatedVideos.length > 0 && (
        <div className="space-y-4 pt-4 border-t">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Generated Videos</h3>
            <Badge variant="secondary">
              {generationTime.toFixed(2)}s
            </Badge>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {generatedVideos.map((video, idx) => (
              <div key={idx} className="space-y-2">
                <div className="relative aspect-video rounded-lg overflow-hidden border bg-black">
                  <video
                    src={video.url}
                    controls
                    className="w-full h-full"
                    poster={video.thumbnail_url}
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => window.open(video.url, '_blank')}
                  >
                    <Download className="mr-2 h-3 w-3" />
                    Download
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(video.url)
                      toast({ title: "URL copied!" })
                    }}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                  {video.thumbnail_url && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(video.thumbnail_url, '_blank')}
                    >
                      <ImageIcon className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
