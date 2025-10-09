"use client"

import { useState } from "react"
import { Sparkles, Download, Copy, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { useGenerate } from "@/hooks/use-generate"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"

export function T2IDemo() {
  const [prompt, setPrompt] = useState("")
  const [model, setModel] = useState("seedream-4-0-250828")
  const [size, setSize] = useState<"1K" | "2K" | "4K">("2K")
  const [watermark, setWatermark] = useState(false)
  const [seed, setSeed] = useState([42])
  const [generatedImages, setGeneratedImages] = useState<any[]>([])
  const [generationTime, setGenerationTime] = useState<number>(0)

  const { generateImage, isLoading } = useGenerate()
  const { toast } = useToast()

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt",
        variant: "destructive"
      })
      return
    }

    const startTime = Date.now()
    try {
      const result = await generateImage({
        model,
        prompt,
        size,
        watermark,
        seed: seed[0],
      })

      if (result.data) {
        setGeneratedImages(result.data)
        setGenerationTime((Date.now() - startTime) / 1000)
      }
    } catch (error) {
      console.error("Generation failed:", error)
    }
  }

  const copyPrompt = () => {
    navigator.clipboard.writeText(prompt)
    toast({
      title: "Copied",
      description: "Prompt copied to clipboard"
    })
  }

  const randomSeed = () => {
    setSeed([Math.floor(Math.random() * 1000)])
  }

  const examplePrompts = [
    "A futuristic cityscape at sunset, cyberpunk style, neon lights, high detail, 8K",
    "A serene mountain lake with crystal clear water, pine trees, golden hour lighting",
    "Abstract geometric patterns in vibrant colors, modern art style, symmetrical",
    "A cozy coffee shop interior, warm lighting, plants, bokeh background"
  ]

  return (
    <div className="space-y-6">
      {/* Prompt Input */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="prompt">Prompt</Label>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={copyPrompt}
              disabled={!prompt}
            >
              <Copy className="h-3 w-3 mr-1" />
              Copy
            </Button>
          </div>
        </div>
        <Textarea
          id="prompt"
          placeholder="Describe the image you want to create..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={4}
          className="resize-none"
        />
        <p className="text-xs text-muted-foreground">
          {prompt.length} / 2000 characters
        </p>
      </div>

      {/* Example Prompts */}
      <div className="space-y-2">
        <Label className="text-xs">Example Prompts</Label>
        <div className="flex flex-wrap gap-2">
          {examplePrompts.map((example, idx) => (
            <Button
              key={idx}
              variant="outline"
              size="sm"
              onClick={() => setPrompt(example)}
              className="text-xs h-auto py-2"
            >
              {example.slice(0, 40)}...
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <SelectItem value="seedream-3-0">
                SEEDREAM 3.0
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Size Selection */}
        <div className="space-y-2">
          <Label htmlFor="size">Resolution</Label>
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
      </div>

      {/* Advanced Settings */}
      <div className="space-y-4">
        {/* Watermark Toggle */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="watermark">Watermark</Label>
            <p className="text-xs text-muted-foreground">
              Add BytePlus watermark to image
            </p>
          </div>
          <Switch
            id="watermark"
            checked={watermark}
            onCheckedChange={setWatermark}
          />
        </div>

        {/* Seed Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="seed">Seed</Label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{seed[0]}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={randomSeed}
              >
                <RefreshCw className="h-3 w-3" />
              </Button>
            </div>
          </div>
          <Slider
            id="seed"
            min={0}
            max={1000}
            step={1}
            value={seed}
            onValueChange={setSeed}
          />
          <p className="text-xs text-muted-foreground">
            Use the same seed to reproduce results
          </p>
        </div>
      </div>

      {/* Generate Button */}
      <Button
        onClick={handleGenerate}
        disabled={isLoading || !prompt.trim()}
        className="w-full"
        size="lg"
      >
        {isLoading ? (
          <>
            <Sparkles className="mr-2 h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-4 w-4" />
            Generate Image
          </>
        )}
      </Button>

      {/* Generated Images */}
      {generatedImages.length > 0 && (
        <div className="space-y-4 pt-4 border-t">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Generated Images</h3>
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
                    alt={`Generated image ${idx + 1}`}
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
