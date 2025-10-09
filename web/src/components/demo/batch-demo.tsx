"use client"

import { useState } from "react"
import { Zap, Plus, X, Download, Copy, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useBatchGenerate } from "@/hooks/use-batch-generate"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export function BatchDemo() {
  const [prompts, setPrompts] = useState<string[]>([""])
  const [model, setModel] = useState("seedream-4-0-250828")
  const [size, setSize] = useState<"1K" | "2K" | "4K">("1K")
  const [watermark, setWatermark] = useState(false)
  const [maxConcurrency, setMaxConcurrency] = useState(3)
  const [results, setResults] = useState<any>(null)
  const [generationTime, setGenerationTime] = useState<number>(0)

  const { batchGenerate, isLoading, progress } = useBatchGenerate()
  const { toast } = useToast()

  const addPrompt = () => {
    setPrompts([...prompts, ""])
  }

  const removePrompt = (index: number) => {
    if (prompts.length === 1) return
    const newPrompts = prompts.filter((_, i) => i !== index)
    setPrompts(newPrompts)
  }

  const updatePrompt = (index: number, value: string) => {
    const newPrompts = [...prompts]
    newPrompts[index] = value
    setPrompts(newPrompts)
  }

  const handleGenerate = async () => {
    const validPrompts = prompts.filter(p => p.trim())

    if (validPrompts.length === 0) {
      toast({
        title: "Error",
        description: "Please enter at least one prompt",
        variant: "destructive"
      })
      return
    }

    const startTime = Date.now()
    try {
      const result = await batchGenerate({
        prompts: validPrompts,
        sharedParams: {
          model,
          size,
          watermark
        },
        maxConcurrency
      })

      setResults(result)
      setGenerationTime((Date.now() - startTime) / 1000)
    } catch (error) {
      console.error("Batch generation failed:", error)
    }
  }

  const clearResults = () => {
    setResults(null)
    setGenerationTime(0)
  }

  const exampleBatch = [
    "A modern minimalist living room, Scandinavian design, natural light",
    "A cozy bedroom with warm lighting, bohemian style, plants",
    "A sleek kitchen with marble countertops, contemporary design",
    "A home office with wooden desk, large windows, inspirational"
  ]

  const loadExamples = () => {
    setPrompts(exampleBatch)
  }

  return (
    <div className="space-y-6">
      {/* Batch Prompts */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Prompts ({prompts.length})</Label>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={loadExamples}
            >
              Load Examples
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={addPrompt}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Prompt
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          {prompts.map((prompt, idx) => (
            <div key={idx} className="flex gap-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="secondary" className="text-xs">
                    #{idx + 1}
                  </Badge>
                </div>
                <Textarea
                  placeholder={`Prompt ${idx + 1}...`}
                  value={prompt}
                  onChange={(e) => updatePrompt(idx, e.target.value)}
                  rows={2}
                  className="resize-none"
                />
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removePrompt(idx)}
                disabled={prompts.length === 1}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Shared Settings */}
      <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
        <Label className="text-sm font-semibold">Shared Settings</Label>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Model */}
          <div className="space-y-2">
            <Label htmlFor="model" className="text-xs">Model</Label>
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger id="model">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="seedream-4-0-250828">
                  SEEDREAM 4.0
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

          {/* Size */}
          <div className="space-y-2">
            <Label htmlFor="size" className="text-xs">Size</Label>
            <Select value={size} onValueChange={(v: any) => setSize(v)}>
              <SelectTrigger id="size">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1K">1K</SelectItem>
                <SelectItem value="2K">2K</SelectItem>
                <SelectItem value="4K">4K</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Concurrency */}
          <div className="space-y-2">
            <Label htmlFor="concurrency" className="text-xs">
              Concurrency ({maxConcurrency})
            </Label>
            <Select value={maxConcurrency.toString()} onValueChange={(v) => setMaxConcurrency(Number(v))}>
              <SelectTrigger id="concurrency">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 (Sequential)</SelectItem>
                <SelectItem value="3">3 (Balanced)</SelectItem>
                <SelectItem value="5">5 (Fast)</SelectItem>
                <SelectItem value="10">10 (Maximum)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Watermark */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="watermark" className="text-xs">Watermark</Label>
            <p className="text-xs text-muted-foreground">
              Apply to all images
            </p>
          </div>
          <Switch
            id="watermark"
            checked={watermark}
            onCheckedChange={setWatermark}
          />
        </div>
      </div>

      {/* Progress Bar */}
      {isLoading && progress && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Generating...</span>
            <span>{progress.completed} / {progress.total}</span>
          </div>
          <Progress value={(progress.completed / progress.total) * 100} />
        </div>
      )}

      {/* Generate Button */}
      <div className="flex gap-2">
        <Button
          onClick={handleGenerate}
          disabled={isLoading}
          className="flex-1"
          size="lg"
        >
          {isLoading ? (
            <>
              <Zap className="mr-2 h-4 w-4 animate-spin" />
              Generating {prompts.filter(p => p.trim()).length} Images...
            </>
          ) : (
            <>
              <Zap className="mr-2 h-4 w-4" />
              Generate {prompts.filter(p => p.trim()).length} Images
            </>
          )}
        </Button>
        {results && (
          <Button
            variant="outline"
            onClick={clearResults}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Results */}
      {results && (
        <div className="space-y-4 pt-4 border-t">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Results</h3>
            <div className="flex gap-2">
              <Badge variant="secondary">
                {generationTime.toFixed(2)}s
              </Badge>
              <Badge variant={results.successRate === 1 ? "default" : "destructive"}>
                {(results.successRate * 100).toFixed(0)}% Success
              </Badge>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 p-4 border rounded-lg">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {results.successful.length}
              </p>
              <p className="text-xs text-muted-foreground">Successful</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">
                {results.failed.length}
              </p>
              <p className="text-xs text-muted-foreground">Failed</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">
                {(generationTime / results.successful.length).toFixed(1)}s
              </p>
              <p className="text-xs text-muted-foreground">Avg. Time</p>
            </div>
          </div>

          {/* Generated Images */}
          {results.successful.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold">Generated Images</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {results.successful.map((result: any, idx: number) => (
                  <div key={idx} className="space-y-2">
                    <div className="relative aspect-square rounded-lg overflow-hidden border bg-muted">
                      <Image
                        src={result.data[0].url}
                        alt={`Generated image ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-xs"
                        onClick={() => window.open(result.data[0].url, '_blank')}
                      >
                        <Download className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(result.data[0].url)
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

          {/* Failed Items */}
          {results.failed.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold text-red-600">Failed Generations</h4>
              <div className="space-y-2">
                {results.failed.map((failed: any, idx: number) => (
                  <div key={idx} className="p-3 border border-red-200 rounded-lg bg-red-50">
                    <p className="text-sm font-medium text-red-900">
                      {failed.prompt.slice(0, 60)}...
                    </p>
                    <p className="text-xs text-red-600 mt-1">
                      {failed.error}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
