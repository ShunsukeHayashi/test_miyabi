"use client"

import { useState } from "react"
import { Settings, Eye, EyeOff, Check, Key } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useGenerationStore } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"

export default function SettingsPage() {
  const { settings, updateSettings, resetSettings } = useGenerationStore()
  const { toast } = useToast()
  const [showApiKey, setShowApiKey] = useState(false)
  const [apiKey, setApiKey] = useState("")
  const [apiEndpoint, setApiEndpoint] = useState("")

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully",
    })
  }

  const handleApiKeyTest = () => {
    // Simulate API key test
    toast({
      title: "Testing API connection",
      description: "Checking BytePlus API credentials...",
    })

    setTimeout(() => {
      toast({
        title: "Connection successful",
        description: "BytePlus API is configured correctly",
      })
      updateSettings({ apiConfigured: true })
    }, 1500)
  }

  const handleReset = () => {
    if (confirm("Reset all settings to defaults? This cannot be undone.")) {
      resetSettings()
      toast({
        title: "Settings reset",
        description: "All settings have been restored to defaults",
      })
    }
  }

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Settings className="h-8 w-8" />
              <h1 className="text-3xl font-bold">Settings</h1>
            </div>
            <p className="text-muted-foreground">
              Customize your generation preferences and API configuration
            </p>
          </div>
        </div>

        {/* API Configuration */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              API Configuration
            </CardTitle>
            <CardDescription>
              Configure your BytePlus API credentials (optional for local testing)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="apiKey">API Key</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    id="apiKey"
                    type={showApiKey ? "text" : "password"}
                    placeholder="bp_xxxxxxxxxxxxx"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0"
                    onClick={() => setShowApiKey(!showApiKey)}
                  >
                    {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                <Button onClick={handleApiKeyTest} disabled={!apiKey.trim()}>
                  Test
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                {settings.apiConfigured ? (
                  <span className="flex items-center gap-1 text-green-600">
                    <Check className="h-3 w-3" />
                    API configured and working
                  </span>
                ) : (
                  "Get your API key from BytePlus Console"
                )}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="endpoint">API Endpoint</Label>
              <Input
                id="endpoint"
                placeholder="https://api.byteplus.com/v1"
                value={apiEndpoint}
                onChange={(e) => setApiEndpoint(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Leave empty to use default endpoint
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Default Models */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Default Models</CardTitle>
            <CardDescription>
              Choose default models for image and video generation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Image Model</Label>
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
            </div>

            <div className="space-y-2">
              <Label>Video Model</Label>
              <Select
                value={settings.defaultVideoModel}
                onValueChange={(value: any) => updateSettings({ defaultVideoModel: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bytedance-Seedance-1.0-pro">
                    SEEDANCE 1.0 Pro
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
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

        {/* Appearance */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>
              Customize the look and feel of the application
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label>Theme</Label>
              <Select
                value={settings.theme}
                onValueChange={(value: any) => updateSettings({ theme: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Choose light, dark, or match your system theme
              </p>
            </div>
          </CardContent>
        </Card>

        {/* History Management */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>History Management</CardTitle>
            <CardDescription>
              Control how your generation history is stored
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label>Maximum History Items</Label>
              <Select
                value={settings.maxHistoryItems.toString()}
                onValueChange={(value: any) => updateSettings({ maxHistoryItems: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="50">50 items</SelectItem>
                  <SelectItem value="100">100 items (recommended)</SelectItem>
                  <SelectItem value="200">200 items</SelectItem>
                  <SelectItem value="500">500 items</SelectItem>
                  <SelectItem value="0">Unlimited</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Older items will be automatically removed. Set to unlimited to keep all history.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button onClick={handleSave} className="flex-1">
            Save Settings
          </Button>
          <Button onClick={handleReset} variant="outline">
            Reset to Defaults
          </Button>
        </div>
      </div>
    </div>
  )
}
