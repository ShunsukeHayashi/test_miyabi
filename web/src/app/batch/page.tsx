"use client"

import { useState } from "react"
import { Layers, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useGenerate } from "@/hooks/use-generate"
import Image from "next/image"

export default function BatchPage() {
  const [prompts, setPrompts] = useState<string[]>([""])
  const [model, setModel] = useState("seedream-4-0-250828")
  const [size, setSize] = useState<"1K" | "2K" | "4K">("2K")
  const [generatedImages, setGeneratedImages] = useState<any[]>([])
  const [progress, setProgress] = useState(0)

  const { generateImage, isLoading } = useGenerate()

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
    setProgress(0)

    const results: any[] = []

    for (let i = 0; i < validPrompts.length; i++) {
      try {
        const result = await generateImage({
          model,
          prompt: validPrompts[i],
          size,
        })

        if (result.data) {
          results.push(...result.data.map((img: any) => ({
            ...img,
            prompt: validPrompts[i]
          })))
        }

        setProgress(((i + 1) / validPrompts.length) * 100)
      } catch (error) {
        console.error(`Failed to generate for prompt ${i}:`, error)
      }
    }

    setGeneratedImages(results)
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

            {/* Progress */}
            {isLoading && progress > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
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

        {/* Generated Images */}
        {generatedImages.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Generated Images</CardTitle>
              <CardDescription>
                {generatedImages.length} images generated
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {generatedImages.map((img, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="relative aspect-square rounded-lg overflow-hidden border">
                      <Image
                        src={img.url}
                        alt={`Generated image ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {img.prompt}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
