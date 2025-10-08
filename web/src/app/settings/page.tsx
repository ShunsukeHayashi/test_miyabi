"use client"

import { Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useAppStore } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"

export default function SettingsPage() {
  const { settings, updateSettings } = useAppStore()
  const { toast } = useToast()

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated",
    })
  }

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Settings className="h-8 w-8" />
            <h1 className="text-3xl font-bold">Settings</h1>
          </div>
          <p className="text-muted-foreground">
            Customize your generation preferences
          </p>
        </div>

        {/* Default Model */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Default Model</CardTitle>
            <CardDescription>
              Choose the default model for image generation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Select
              value={settings.defaultImageModel}
              onValueChange={(value: any) => updateSettings({ defaultImageModel: value })}
            >
              <SelectTrigger>
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
          </CardContent>
        </Card>

        {/* Default Size */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Default Image Size</CardTitle>
            <CardDescription>
              Choose the default resolution for generated images
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Select
              value={settings.defaultImageSize}
              onValueChange={(value: any) => updateSettings({ defaultImageSize: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1K">1K (1024x1024)</SelectItem>
                <SelectItem value="2K">2K (2048x2048)</SelectItem>
                <SelectItem value="4K">4K (4096x4096)</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Watermark */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Watermark</CardTitle>
            <CardDescription>
              Add watermark to generated images by default
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <Label htmlFor="watermark">Enable watermark</Label>
              <Switch
                id="watermark"
                checked={settings.defaultWatermark}
                onCheckedChange={(checked) => updateSettings({ defaultWatermark: checked })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Prompt Optimization */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Prompt Optimization</CardTitle>
            <CardDescription>
              Automatically enhance prompts using AI before generation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <Label htmlFor="optimize">Enable prompt optimization</Label>
              <Switch
                id="optimize"
                checked={settings.autoOptimizePrompts}
                onCheckedChange={(checked) => updateSettings({ autoOptimizePrompts: checked })}
              />
            </div>
            {settings.autoOptimizePrompts && (
              <p className="text-xs text-muted-foreground mt-3">
                Uses DeepSeek-R1 or Skylark-pro to enhance your prompts for better results
              </p>
            )}
          </CardContent>
        </Card>

        {/* Save Button */}
        <Button onClick={handleSave} className="w-full">
          Save Settings
        </Button>
      </div>
    </div>
  )
}
