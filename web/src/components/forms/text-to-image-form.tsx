"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Sparkles, Wand2 } from "lucide-react"
import { textToImageSchema, type TextToImageFormData } from "@/lib/schemas"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PromptEditor } from "@/components/custom/prompt-editor"
import { ParameterPanel } from "@/components/forms/parameter-panel"

interface TextToImageFormProps {
  onSubmit: (data: TextToImageFormData) => void
  isLoading?: boolean
  defaultValues?: Partial<TextToImageFormData>
  onOptimizePrompt?: (prompt: string) => Promise<string>
}

export function TextToImageForm({
  onSubmit,
  isLoading = false,
  defaultValues,
  onOptimizePrompt,
}: TextToImageFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(textToImageSchema),
    defaultValues: {
      model: "seedream-4-0-250828",
      prompt: "",
      size: "2K",
      watermark: true,
      optimizePrompt: false,
      ...defaultValues,
    },
  })

  const prompt = watch("prompt")
  const model = watch("model")
  const size = watch("size")
  const watermark = watch("watermark")
  const seed = watch("seed")
  const optimizePrompt = watch("optimizePrompt")

  const handleOptimize = async () => {
    if (onOptimizePrompt && prompt) {
      const optimized = await onOptimizePrompt(prompt)
      setValue("prompt", optimized)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Model Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Model</CardTitle>
          <CardDescription>Select the SEEDREAM model for generation</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={model} onValueChange={(value) => setValue("model", value as any)}>
            <SelectTrigger>
              <SelectValue placeholder="Select model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="seedream-4-0-250828">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <div>
                    <p className="font-medium">SEEDREAM 4.0</p>
                    <p className="text-xs text-muted-foreground">Latest model, highest quality</p>
                  </div>
                </div>
              </SelectItem>
              <SelectItem value="seedream-3-5">
                <div>
                  <p className="font-medium">SEEDREAM 3.5</p>
                  <p className="text-xs text-muted-foreground">Balanced quality and speed</p>
                </div>
              </SelectItem>
              <SelectItem value="seedream-3-0">
                <div>
                  <p className="font-medium">SEEDREAM 3.0</p>
                  <p className="text-xs text-muted-foreground">Fast generation</p>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          {errors.model && (
            <p className="text-sm text-destructive mt-2">{errors.model.message}</p>
          )}
        </CardContent>
      </Card>

      {/* Prompt */}
      <Card>
        <CardHeader>
          <CardTitle>Prompt</CardTitle>
          <CardDescription>Describe the image you want to generate</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <PromptEditor
            value={prompt}
            onChange={(value) => setValue("prompt", value)}
            placeholder="A beautiful sunset over mountains, photorealistic style, 4K, detailed..."
            maxLength={2000}
            rows={6}
            error={errors.prompt?.message}
            disabled={isLoading}
            showOptimize={!!onOptimizePrompt}
            onOptimize={handleOptimize}
            optimizing={false}
          />

          {/* Auto-optimize toggle */}
          {onOptimizePrompt && (
            <div className="flex items-center space-x-2 pt-2 border-t">
              <Switch
                id="optimize-prompt"
                checked={optimizePrompt}
                onCheckedChange={(checked) => setValue("optimizePrompt", checked)}
                disabled={isLoading}
              />
              <Label htmlFor="optimize-prompt" className="text-sm cursor-pointer">
                <div className="flex items-center gap-2">
                  <Wand2 className="h-4 w-4 text-purple-500" />
                  <span>Automatically optimize prompt before generation</span>
                </div>
              </Label>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Parameters */}
      <ParameterPanel
        size={size}
        onSizeChange={(value) => setValue("size", value as any)}
        watermark={watermark ?? true}
        onWatermarkChange={(value) => setValue("watermark", value)}
        seed={seed}
        onSeedChange={(value) => setValue("seed", value === "" ? "" : Number(value))}
        showAdvanced={true}
      />

      {/* Submit Button */}
      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={isLoading || !!errors.prompt}
      >
        {isLoading ? (
          <>
            <Sparkles className="mr-2 h-5 w-5 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-5 w-5" />
            Generate Image
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
              {errors.model && <li>{errors.model.message}</li>}
              {errors.prompt && <li>{errors.prompt.message}</li>}
              {errors.size && <li>{errors.size.message}</li>}
              {errors.seed && <li>{errors.seed.message}</li>}
            </ul>
          </CardContent>
        </Card>
      )}
    </form>
  )
}
