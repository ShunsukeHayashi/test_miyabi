"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Pencil, Image as ImageIcon } from "lucide-react"
import { imageToImageSchema, type ImageToImageFormData } from "@/lib/schemas"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PromptEditor } from "@/components/custom/prompt-editor"
import { ParameterPanel } from "@/components/forms/parameter-panel"
import { FileUploader } from "@/components/forms/file-uploader"

interface ImageToImageFormProps {
  onSubmit: (data: ImageToImageFormData) => void
  isLoading?: boolean
  defaultValues?: Partial<ImageToImageFormData>
}

export function ImageToImageForm({
  onSubmit,
  isLoading = false,
  defaultValues,
}: ImageToImageFormProps) {
  const {
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(imageToImageSchema),
    defaultValues: {
      model: "Bytedance-SeedEdit-3.0-i2i",
      prompt: "",
      imageUrl: "",
      size: "2K",
      watermark: true,
      ...defaultValues,
    },
  })

  const prompt = watch("prompt")
  const imageUrl = watch("imageUrl")
  const size = watch("size")
  const watermark = watch("watermark")
  const seed = watch("seed")

  const handleFileUpload = (url: string) => {
    setValue("imageUrl", url)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Model Badge */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Image Editing</CardTitle>
              <CardDescription>Edit and transform existing images</CardDescription>
            </div>
            <Badge variant="secondary" className="text-sm">
              SEEDEDIT 3.0 i2i
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Source Image Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Source Image
          </CardTitle>
          <CardDescription>Upload the image you want to edit</CardDescription>
        </CardHeader>
        <CardContent>
          <FileUploader
            accept="image/*"
            maxSize={10 * 1024 * 1024} // 10MB
            onUpload={handleFileUpload}
            disabled={isLoading}
            preview={imageUrl}
          />
          {errors.imageUrl && (
            <p className="text-sm text-destructive mt-2">{errors.imageUrl.message}</p>
          )}
        </CardContent>
      </Card>

      {/* Edit Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Pencil className="h-5 w-5" />
            Edit Instructions
          </CardTitle>
          <CardDescription>
            Describe what changes you want to make to the image
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PromptEditor
            value={prompt}
            onChange={(value) => setValue("prompt", value)}
            placeholder="Add vibrant sunset lighting, enhance colors, add soft glow effect..."
            maxLength={2000}
            rows={5}
            error={errors.prompt?.message}
            disabled={isLoading}
          />
          <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-900 dark:text-blue-100">
              <strong>Tip:</strong> Be specific about the changes you want. Examples: "change
              sky to sunset", "add snow on ground", "make colors more vibrant"
            </p>
          </div>
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
        disabled={isLoading || !imageUrl || !!errors.prompt}
      >
        {isLoading ? (
          <>
            <Pencil className="mr-2 h-5 w-5 animate-pulse" />
            Editing Image...
          </>
        ) : (
          <>
            <Pencil className="mr-2 h-5 w-5" />
            Edit Image
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
              {errors.imageUrl && <li>{errors.imageUrl.message}</li>}
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
