"use client"

import * as React from "react"
import { Dice5, Info } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

export interface GenerationParameters {
  size: string
  ratio?: string
  seed?: number
  watermark: boolean
  quantity?: number
  duration?: number
  fixedLens?: boolean
}

interface ParameterControlsProps {
  value: GenerationParameters
  onChange: (value: GenerationParameters) => void
  modelType: "t2i" | "i2i" | "i2v"
  className?: string
  disabled?: boolean
}

const IMAGE_SIZES = ["1K", "2K", "4K"]
const ASPECT_RATIOS = ["1:1", "16:9", "9:16", "4:3", "3:4"]
const VIDEO_RESOLUTIONS = ["720P", "1080P", "2K"]
const VIDEO_DURATIONS = [5, 10, 15, 20]

export function ParameterControls({
  value,
  onChange,
  modelType,
  className,
  disabled = false
}: ParameterControlsProps) {
  const [showAdvanced, setShowAdvanced] = React.useState(false)

  const updateParameter = <K extends keyof GenerationParameters>(
    key: K,
    val: GenerationParameters[K]
  ) => {
    onChange({ ...value, [key]: val })
  }

  const randomizeSeed = () => {
    updateParameter("seed", Math.floor(Math.random() * 1000000))
  }

  const isVideo = modelType === "i2v"

  return (
    <Card className={cn("p-6 space-y-6", className)}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Generation Parameters</h3>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="h-8 text-xs"
          >
            {showAdvanced ? "Hide" : "Show"} Advanced
          </Button>
        </div>

        {/* Size/Resolution */}
        <div className="space-y-2">
          <Label htmlFor="size">
            {isVideo ? "Resolution" : "Size"}
          </Label>
          <Select
            value={value.size}
            onValueChange={(val) => updateParameter("size", val)}
            disabled={disabled}
          >
            <SelectTrigger id="size">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(isVideo ? VIDEO_RESOLUTIONS : IMAGE_SIZES).map((size) => (
                <SelectItem key={size} value={size}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Aspect Ratio (for images) */}
        {!isVideo && (
          <div className="space-y-2">
            <Label htmlFor="ratio">Aspect Ratio</Label>
            <Select
              value={value.ratio || "1:1"}
              onValueChange={(val) => updateParameter("ratio", val)}
              disabled={disabled}
            >
              <SelectTrigger id="ratio">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ASPECT_RATIOS.map((ratio) => (
                  <SelectItem key={ratio} value={ratio}>
                    {ratio}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Duration (for videos) */}
        {isVideo && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="duration">Duration (seconds)</Label>
              <span className="text-sm font-medium text-muted-foreground">
                {value.duration || 5}s
              </span>
            </div>
            <Slider
              id="duration"
              min={5}
              max={20}
              step={5}
              value={[value.duration || 5]}
              onValueChange={(vals) => updateParameter("duration", vals[0])}
              disabled={disabled}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>5s</span>
              <span>20s</span>
            </div>
          </div>
        )}

        {/* Watermark Toggle */}
        <div className="flex items-center justify-between space-x-2 rounded-lg border p-3">
          <div className="space-y-0.5">
            <Label htmlFor="watermark" className="text-sm font-medium cursor-pointer">
              Watermark
            </Label>
            <p className="text-xs text-muted-foreground">
              Add BytePlus watermark to output
            </p>
          </div>
          <Switch
            id="watermark"
            checked={value.watermark}
            onCheckedChange={(checked) => updateParameter("watermark", checked)}
            disabled={disabled}
          />
        </div>

        {/* Advanced Options */}
        {showAdvanced && (
          <>
            <Separator />

            {/* Seed */}
            <div className="space-y-2">
              <Label htmlFor="seed">Seed (for reproducibility)</Label>
              <div className="flex gap-2">
                <Input
                  id="seed"
                  type="number"
                  value={value.seed || ""}
                  onChange={(e) => {
                    const val = e.target.value === "" ? undefined : parseInt(e.target.value)
                    updateParameter("seed", val)
                  }}
                  placeholder="Random"
                  disabled={disabled}
                  min={0}
                  max={999999}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={randomizeSeed}
                  disabled={disabled}
                  title="Randomize seed"
                >
                  <Dice5 className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground flex items-start gap-1">
                <Info className="h-3 w-3 shrink-0 mt-0.5" />
                <span>
                  Use the same seed with identical parameters to reproduce results
                </span>
              </p>
            </div>

            {/* Quantity (number of images) */}
            {!isVideo && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="quantity">Quantity</Label>
                  <span className="text-sm font-medium text-muted-foreground">
                    {value.quantity || 1}
                  </span>
                </div>
                <Slider
                  id="quantity"
                  min={1}
                  max={4}
                  step={1}
                  value={[value.quantity || 1]}
                  onValueChange={(vals) => updateParameter("quantity", vals[0])}
                  disabled={disabled}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1 image</span>
                  <span>4 images</span>
                </div>
              </div>
            )}

            {/* Fixed Lens (for videos) */}
            {isVideo && (
              <div className="flex items-center justify-between space-x-2 rounded-lg border p-3">
                <div className="space-y-0.5">
                  <Label htmlFor="fixedLens" className="text-sm font-medium cursor-pointer">
                    Fixed Camera
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Lock camera position (no movement)
                  </p>
                </div>
                <Switch
                  id="fixedLens"
                  checked={value.fixedLens || false}
                  onCheckedChange={(checked) => updateParameter("fixedLens", checked)}
                  disabled={disabled}
                />
              </div>
            )}
          </>
        )}
      </div>
    </Card>
  )
}
