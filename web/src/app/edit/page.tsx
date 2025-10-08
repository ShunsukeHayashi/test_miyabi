"use client"

import { useState } from "react"
import { ImagePlus, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useGenerate } from "@/hooks/use-generate"
import Image from "next/image"

export default function EditPage() {
  const [prompt, setPrompt] = useState("")
  const [model, setModel] = useState("Bytedance-SeedEdit-3.0-i2i")
  const [size, setSize] = useState<"1K" | "2K" | "4K">("2K")
  const [sourceImage, setSourceImage] = useState<string>("")
  const [editedImages, setEditedImages] = useState<any[]>([])

  const { generateImage, isLoading } = useGenerate()

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setSourceImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleEdit = async () => {
    if (!prompt.trim() || !sourceImage) {
      return
    }

    try {
      const result = await generateImage({
        model,
        prompt,
        size,
        image: [sourceImage],
      })

      if (result.data) {
        setEditedImages(result.data)
      }
    } catch (error) {
      console.error("Edit failed:", error)
    }
  }

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <ImagePlus className="h-8 w-8" />
            <h1 className="text-3xl font-bold">Image-to-Image Editing</h1>
          </div>
          <p className="text-muted-foreground">
            Upload an image and describe the changes you want to make
          </p>
        </div>

        {/* Edit Form */}
        <Card>
          <CardHeader>
            <CardTitle>Edit Image</CardTitle>
            <CardDescription>
              Upload a source image and provide editing instructions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Image Upload */}
            <div className="space-y-2">
              <Label htmlFor="image">Source Image</Label>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => document.getElementById('image-upload')?.click()}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Image
                </Button>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>
              {sourceImage && (
                <div className="relative aspect-square rounded-lg overflow-hidden border mt-4">
                  <Image
                    src={sourceImage}
                    alt="Source image"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>

            {/* Prompt Input */}
            <div className="space-y-2">
              <Label htmlFor="prompt">Editing Instructions</Label>
              <Textarea
                id="prompt"
                placeholder="Add vibrant sunset lighting, enhance colors, add soft glow effect..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </div>

            {/* Model Selection */}
            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Select value={model} onValueChange={setModel}>
                <SelectTrigger id="model">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bytedance-SeedEdit-3.0-i2i">
                    SeedEdit 3.0 (Recommended)
                  </SelectItem>
                  <SelectItem value="seedream-4-0-250828">
                    SEEDREAM 4.0
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Size Selection */}
            <div className="space-y-2">
              <Label htmlFor="size">Output Size</Label>
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

            {/* Edit Button */}
            <Button
              onClick={handleEdit}
              disabled={isLoading || !sourceImage}
              className="w-full"
              size="lg"
            >
              {isLoading ? (
                <>
                  <ImagePlus className="mr-2 h-4 w-4 animate-spin" />
                  Editing...
                </>
              ) : (
                <>
                  <ImagePlus className="mr-2 h-4 w-4" />
                  Edit Image
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Edited Images */}
        {editedImages.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Edited Images</CardTitle>
              <CardDescription>
                Your edited images are ready
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {editedImages.map((img, idx) => (
                  <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border">
                    <Image
                      src={img.url}
                      alt={`Edited image ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
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
