"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Sparkles, Layers, Clock, AlertTriangle } from "lucide-react"
import { batchGenerationSchema, type BatchGenerationFormData, parsePromptsFromText } from "@/lib/schemas"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"

interface BatchGenerationFormProps {
  onSubmit: (data: BatchGenerationFormData) => void
  isLoading?: boolean
  defaultValues?: Partial<BatchGenerationFormData>
}

export function BatchGenerationForm({
  onSubmit,
  isLoading = false,
  defaultValues,
}: BatchGenerationFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(batchGenerationSchema),
    defaultValues: {
      prompts: "",
      model: "seedream-4-0-250828",
      size: "2K",
      watermark: true,
      maxConcurrency: 10,
      ...defaultValues,
    },
  })

  const prompts = watch("prompts")
  const model = watch("model")
  const size = watch("size")
  const watermark = watch("watermark")
  const maxConcurrency = watch("maxConcurrency")

  // Calculate prompt count and estimated time
  const promptList = parsePromptsFromText(prompts)
  const promptCount = promptList.length
  const avgTimePerImage = 8 // seconds
  const concurrency = maxConcurrency ?? 10
  const estimatedTimeSeconds = Math.ceil((promptCount * avgTimePerImage) / concurrency)
  const estimatedMinutes = Math.floor(estimatedTimeSeconds / 60)
  const estimatedSecondsRemainder = estimatedTimeSeconds % 60

  const isOverLimit = promptCount > 100
  const isValid = promptCount >= 1 && promptCount <= 100

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Header */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5" />
                Batch Generation
              </CardTitle>
              <CardDescription>
                Generate multiple images in parallel from a list of prompts
              </CardDescription>
            </div>
            {promptCount > 0 && (
              <Badge variant={isValid ? "default" : "destructive"} className="text-lg px-3 py-1">
                {promptCount} {promptCount === 1 ? "prompt" : "prompts"}
              </Badge>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Prompts Input */}
      <Card>
        <CardHeader>
          <CardTitle>Prompts</CardTitle>
          <CardDescription>
            Enter one prompt per line (1-100 prompts maximum)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            {...register("prompts")}
            placeholder={`A beautiful sunset over mountains\nA futuristic city at night\nA serene forest landscape\n...`}
            rows={10}
            className="font-mono text-sm"
            disabled={isLoading}
          />
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {promptCount} / 100 prompts
            </span>
            {isOverLimit && (
              <span className="text-destructive flex items-center gap-1">
                <AlertTriangle className="h-4 w-4" />
                Too many prompts
              </span>
            )}
          </div>
          {errors.prompts && (
            <p className="text-sm text-destructive">{errors.prompts.message}</p>
          )}
        </CardContent>
      </Card>

      {/* Model & Size */}
      <Card>
        <CardHeader>
          <CardTitle>Generation Settings</CardTitle>
          <CardDescription>Configure model and output size</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Model */}
          <div className="space-y-2">
            <Label htmlFor="model">Model</Label>
            <Select value={model} onValueChange={(value) => setValue("model", value as any)}>
              <SelectTrigger id="model">
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="seedream-4-0-250828">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    SEEDREAM 4.0 (Highest Quality)
                  </div>
                </SelectItem>
                <SelectItem value="seedream-3-5">SEEDREAM 3.5 (Balanced)</SelectItem>
                <SelectItem value="seedream-3-0">SEEDREAM 3.0 (Fast)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Size */}
          <div className="space-y-2">
            <Label htmlFor="size">Image Size</Label>
            <Select value={size} onValueChange={(value) => setValue("size", value as any)}>
              <SelectTrigger id="size">
                <SelectValue placeholder="Select size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1K">1K (1024x1024)</SelectItem>
                <SelectItem value="2K">2K (2048x2048)</SelectItem>
                <SelectItem value="4K">4K (4096x4096)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Watermark */}
          <div className="flex items-center justify-between">
            <Label htmlFor="watermark" className="cursor-pointer">
              Add Watermark
            </Label>
            <Switch
              id="watermark"
              checked={watermark ?? true}
              onCheckedChange={(checked) => setValue("watermark", checked)}
              disabled={isLoading}
            />
          </div>
        </CardContent>
      </Card>

      {/* Concurrency Control */}
      <Card>
        <CardHeader>
          <CardTitle>Parallel Processing</CardTitle>
          <CardDescription>
            Control how many images are generated simultaneously
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Max Concurrency</Label>
              <Badge variant="outline">{concurrency} parallel</Badge>
            </div>
            <Slider
              value={[concurrency]}
              onValueChange={(value) => setValue("maxConcurrency", value[0])}
              min={1}
              max={20}
              step={1}
              disabled={isLoading}
            />
            <p className="text-sm text-muted-foreground">
              Higher values = faster batch completion, but more resource intensive
            </p>
          </div>

          {/* Estimated Time */}
          {promptCount > 0 && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Estimated Time</span>
              </div>
              <div className="text-2xl font-bold">
                {estimatedMinutes > 0 && `${estimatedMinutes}m `}
                {estimatedSecondsRemainder}s
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                ~{avgTimePerImage}s per image × {promptCount} prompts ÷ {concurrency} parallel
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Submit Button */}
      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={isLoading || !isValid}
      >
        {isLoading ? (
          <>
            <Sparkles className="mr-2 h-5 w-5 animate-spin" />
            Generating {promptCount} Images...
          </>
        ) : (
          <>
            <Layers className="mr-2 h-5 w-5" />
            Generate {promptCount} {promptCount === 1 ? "Image" : "Images"}
          </>
        )}
      </Button>

      {/* Error Summary */}
      {Object.keys(errors).length > 0 && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-sm text-destructive font-medium mb-2">
              Please fix the following errors:
            </p>
            <ul className="text-sm text-destructive space-y-1 list-disc list-inside">
              {errors.prompts && <li>{errors.prompts.message}</li>}
              {errors.model && <li>{errors.model.message}</li>}
              {errors.size && <li>{errors.size.message}</li>}
              {errors.maxConcurrency && <li>{errors.maxConcurrency.message}</li>}
            </ul>
          </CardContent>
        </Card>
      )}
    </form>
  )
}
