"use client"

import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"

interface ParameterPanelProps {
  size: string
  onSizeChange: (value: string) => void
  watermark: boolean
  onWatermarkChange: (value: boolean) => void
  seed?: number | string
  onSeedChange?: (value: number | string) => void
  showAdvanced?: boolean
}

export function ParameterPanel({
  size,
  onSizeChange,
  watermark,
  onWatermarkChange,
  seed,
  onSeedChange,
  showAdvanced = true,
}: ParameterPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Parameters</CardTitle>
        <CardDescription>
          Configure generation settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Image Size */}
        <div className="space-y-2">
          <Label htmlFor="size">Image Size</Label>
          <Select value={size} onValueChange={onSizeChange}>
            <SelectTrigger id="size">
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1K">1K (1024x1024)</SelectItem>
              <SelectItem value="2K">2K (2048x2048)</SelectItem>
              <SelectItem value="4K">4K (4096x4096)</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Higher resolution means better quality but longer generation time
          </p>
        </div>

        {/* Watermark */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="watermark">Watermark</Label>
            <p className="text-xs text-muted-foreground">
              Add BytePlus watermark to generated images
            </p>
          </div>
          <Switch
            id="watermark"
            checked={watermark}
            onCheckedChange={onWatermarkChange}
          />
        </div>

        {/* Advanced Settings */}
        {showAdvanced && onSeedChange && (
          <>
            <div className="border-t pt-6">
              <h4 className="text-sm font-medium mb-4">Advanced Settings</h4>

              {/* Seed */}
              <div className="space-y-2">
                <Label htmlFor="seed">Seed (Optional)</Label>
                <Input
                  id="seed"
                  type="number"
                  placeholder="-1 for random"
                  value={seed ?? ""}
                  onChange={(e) => {
                    const value = e.target.value
                    onSeedChange(value === "" ? "" : parseInt(value, 10))
                  }}
                  min={-1}
                />
                <p className="text-xs text-muted-foreground">
                  Use the same seed for reproducible results. -1 or empty for random.
                </p>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
