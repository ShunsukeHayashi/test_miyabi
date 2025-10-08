"use client"

import { useState } from "react"
import { Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { useToast } from "@/hooks/use-toast"

export default function Home() {
  const [prompt, setPrompt] = useState("")
  const [model, setModel] = useState("seedream-4-0-250828")
  const [size, setSize] = useState("2K")
  const [watermark, setWatermark] = useState(true)
  const [seed, setSeed] = useState([42])
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleGenerate = () => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    // TODO: Integrate with BytePlusClient
    setTimeout(() => {
      toast({
        title: "Success",
        description: "Image generation started!",
      })
      setLoading(false)
    }, 2000)
  }

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            Byteflow
          </h1>
          <p className="text-xl text-muted-foreground">
            AI-Powered Image Generation Platform
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Create stunning images with BytePlus SEEDREAM, SEEDDREAM4, and SEEDDANCE models
          </p>
        </div>

        {/* Generation Form */}
        <Card>
          <CardHeader>
            <CardTitle>Generate Image</CardTitle>
            <CardDescription>
              Describe what you want to create, and our AI will bring it to life
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Prompt Input */}
            <div className="space-y-2">
              <Label htmlFor="prompt">Prompt</Label>
              <Textarea
                id="prompt"
                placeholder="A beautiful sunset over mountains, photorealistic style, golden hour lighting..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                {prompt.length} / 2000 characters
              </p>
            </div>

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
                  <SelectItem value="Bytedance-SeedEdit-3.0-i2i">
                    SeedEdit 3.0 (Image-to-Image)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Size Selection */}
            <div className="space-y-2">
              <Label htmlFor="size">Image Size</Label>
              <Select value={size} onValueChange={setSize}>
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
              <div className="space-y-0.5">
                <Label htmlFor="watermark">Watermark</Label>
                <p className="text-xs text-muted-foreground">
                  Add watermark to generated images
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
                <span className="text-sm text-muted-foreground">{seed[0]}</span>
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

            {/* Generate Button */}
            <Button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full"
              size="lg"
            >
              {loading ? (
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
          </CardContent>
        </Card>

        {/* Info Section */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            Powered by <span className="font-semibold">BytePlus AI</span>
          </p>
          <p className="mt-1">
            Using Miyabi Framework for autonomous development
          </p>
        </div>
      </div>
    </div>
  )
}
