"use client"

import { useState } from "react"
import { Layers, Plus, X, Download, CheckCircle2, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useBatchGenerate } from "@/hooks/use-batch-generate"
import Image from "next/image"
import JSZip from 'jszip'
import { saveAs } from 'file-saver'

export default function BatchPage() {
  const [prompts, setPrompts] = useState<string[]>([""])
  const [model, setModel] = useState("seedream-4-0-250828")
  const [size, setSize] = useState<"1K" | "2K" | "4K">("2K")
  const [watermark, setWatermark] = useState(true)
  const [maxConcurrency, setMaxConcurrency] = useState(3)
  const [generatedImages, setGeneratedImages] = useState<any[]>([])

  const { batchGenerate, isLoading, error, progress } = useBatchGenerate()

  const addPrompt = () => {
    setPrompts([...prompts, ""])
  }

  const removePrompt = (index: number) => {
    setPrompts(prompts.filter((_, i) => i !== index))
  }

  const updatePrompt = (index: number, value: string) => {
    const newPrompts = [...prompts]
    newPrompts[index] = value
    setPrompts(newPrompts)
  }

  const handleBatchGenerate = async () => {
    const validPrompts = prompts.filter(p => p.trim())
    if (validPrompts.length === 0) return

    setGeneratedImages([])

    try {
      const result = await batchGenerate({
        prompts: validPrompts,
        sharedParams: {
          model: model as any,
          size,
          watermark,
        },
        maxConcurrency,
      })

      // Flatten all successful results
      const images = result.successful.flatMap((item: any) =>
        item.data.map((img: any) => ({
          ...img,
          prompt: item.metadata?.prompt || 'Batch generation',
        }))
      )

      setGeneratedImages(images)
    } catch (err) {
      console.error('Batch generation failed:', err)
    }
  }

  const handleBulkDownload = async () => {
    if (generatedImages.length === 0) return

    const zip = new JSZip()

    // Fetch each image and add to zip
    for (let i = 0; i < generatedImages.length; i++) {
      const img = generatedImages[i]
      try {
        const response = await fetch(img.url)
        const blob = await response.blob()
        zip.file(`image-${i + 1}.png`, blob)
      } catch (err) {
        console.error(`Failed to download image ${i + 1}:`, err)
      }
    }

    // Generate and download zip file
    const content = await zip.generateAsync({ type: 'blob' })
    saveAs(content, `batch-images-${Date.now()}.zip`)
  }

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Layers className="h-8 w-8" />
            <h1 className="text-3xl font-bold">Batch Generation</h1>
          </div>
          <p className="text-muted-foreground">
            Generate multiple images from different prompts in one go
          </p>
        </div>

        {/* Batch Form */}
        <Card>
          <CardHeader>
            <CardTitle>Prompts</CardTitle>
            <CardDescription>
              Add multiple prompts to generate images in batch
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Prompts List */}
            <div className="space-y-4">
              {prompts.map((prompt, index) => (
                <div key={index} className="flex gap-2">
                  <Textarea
                    placeholder={`Prompt ${index + 1}...`}
                    value={prompt}
                    onChange={(e) => updatePrompt(index, e.target.value)}
                    rows={2}
                    className="resize-none flex-1"
                  />
                  {prompts.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removePrompt(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {/* Add Prompt Button */}
            <Button
              variant="outline"
              onClick={addPrompt}
              className="w-full"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Prompt
            </Button>

            {/* Model Selection */}
            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Select value={model} onValueChange={setModel}>
                <SelectTrigger id="model">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="seedream-4-0-250828">
                    SEEDREAM 4.0 (Highest Quality)
                  </SelectItem>
                  <SelectItem value="seedream-3-5">
                    SEEDREAM 3.5
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Size Selection */}
            <div className="space-y-2">
              <Label htmlFor="size">Image Size</Label>
              <Select value={size} onValueChange={(v: any) => setSize(v)}>
                <SelectTrigger id="size">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1K">1K (1024x1024)</SelectItem>
                  <SelectItem value="2K">2K (2048x2048)</SelectItem>
                  <SelectItem value="4K">4K (4096x4096)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Watermark Toggle */}
            <div className="flex items-center justify-between">
              <Label>Watermark</Label>
              <Switch checked={watermark} onCheckedChange={setWatermark} />
            </div>

            {/* Concurrency Setting */}
            <div className="space-y-2">
              <Label htmlFor="concurrency">
                Parallel Jobs: {maxConcurrency}
              </Label>
              <Select value={maxConcurrency.toString()} onValueChange={(v) => setMaxConcurrency(parseInt(v))}>
                <SelectTrigger id="concurrency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 (Sequential)</SelectItem>
                  <SelectItem value="3">3 (Recommended)</SelectItem>
                  <SelectItem value="5">5 (Fast)</SelectItem>
                  <SelectItem value="10">10 (Maximum)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Higher values = faster but may hit rate limits
              </p>
            </div>

            {/* Progress */}
            {isLoading && progress && (
              <Card className="p-4 bg-primary/5">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress: {progress.completed} / {progress.total}</span>
                    <span>{Math.round((progress.completed / progress.total) * 100)}%</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-300"
                      style={{ width: `${(progress.completed / progress.total) * 100}%` }}
                    />
                  </div>
                  {progress.successRate > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Success Rate: {Math.round(progress.successRate * 100)}%
                    </p>
                  )}
                </div>
              </Card>
            )}

            {error && (
              <div className="p-4 bg-destructive/10 text-destructive rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Generate Button */}
            <Button
              onClick={handleBatchGenerate}
              disabled={isLoading || prompts.every(p => !p.trim())}
              className="w-full"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Layers className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Layers className="mr-2 h-4 w-4" />
                  Generate All ({prompts.filter(p => p.trim()).length} prompts)
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Generated Images with Masonry Grid */}
        {generatedImages.length > 0 && (
          <div className="mt-8 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Generated Images</h2>
                <p className="text-sm text-muted-foreground">
                  {generatedImages.length} images generated
                </p>
              </div>
              <Button onClick={handleBulkDownload} variant="default">
                <Download className="mr-2 h-4 w-4" />
                Download All ({generatedImages.length})
              </Button>
            </div>

            {/* Masonry Grid Layout */}
            <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
              {generatedImages.map((img, idx) => (
                <div key={idx} className="break-inside-avoid">
                  <Card className="overflow-hidden">
                    <div className="relative w-full">
                      <Image
                        src={img.url}
                        alt={`Generated image ${idx + 1}`}
                        width={500}
                        height={500}
                        className="w-full h-auto object-cover"
                      />
                    </div>
                    <CardContent className="p-3">
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {img.prompt}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
