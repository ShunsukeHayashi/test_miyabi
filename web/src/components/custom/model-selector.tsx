"use client"

import * as React from "react"
import { Check, Sparkles, Image, Video, Wand2 } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export type ModelType = "t2i" | "i2i" | "i2v"

export interface ModelInfo {
  id: string
  name: string
  type: ModelType
  description: string
  icon: React.ReactNode
  badge?: string
  maxSize?: string
  features: string[]
}

const MODELS: ModelInfo[] = [
  {
    id: "seedream-4-0-250828",
    name: "SEEDDREAM 4.0",
    type: "t2i",
    description: "High-quality text-to-image generation",
    icon: <Sparkles className="h-4 w-4" />,
    badge: "Recommended",
    maxSize: "4K",
    features: ["Text to Image", "High Quality", "Fast Generation"]
  },
  {
    id: "Bytedance-SeedEdit-3.0-i2i",
    name: "SEEDEDIT 3.0",
    type: "i2i",
    description: "Image editing and transformation",
    icon: <Wand2 className="h-4 w-4" />,
    maxSize: "2K",
    features: ["Image Editing", "Style Transfer", "Enhancement"]
  },
  {
    id: "Bytedance-Seedance-1.0-pro",
    name: "SEEDANCE 1.0 Pro",
    type: "i2v",
    description: "Image-to-video animation",
    icon: <Video className="h-4 w-4" />,
    maxSize: "1080P",
    features: ["Image to Video", "Dynamic Camera", "Cinematic"]
  }
]

interface ModelSelectorProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  className?: string
  showDetails?: boolean
  filterByType?: ModelType
}

export function ModelSelector({
  value,
  onChange,
  disabled = false,
  className,
  showDetails = true,
  filterByType
}: ModelSelectorProps) {
  const filteredModels = filterByType
    ? MODELS.filter((model) => model.type === filterByType)
    : MODELS

  const selectedModel = MODELS.find((model) => model.id === value)

  const getTypeLabel = (type: ModelType) => {
    switch (type) {
      case "t2i":
        return "Text to Image"
      case "i2i":
        return "Image to Image"
      case "i2v":
        return "Image to Video"
    }
  }

  const groupedModels = React.useMemo(() => {
    const groups: Record<ModelType, ModelInfo[]> = {
      t2i: [],
      i2i: [],
      i2v: []
    }

    filteredModels.forEach((model) => {
      groups[model.type].push(model)
    })

    return groups
  }, [filteredModels])

  return (
    <div className={cn("space-y-3", className)}>
      <div className="space-y-2">
        <Label htmlFor="model-selector">Model</Label>
        <Select value={value} onValueChange={onChange} disabled={disabled}>
          <SelectTrigger id="model-selector" className="w-full">
            <SelectValue placeholder="Select a model">
              {selectedModel && (
                <div className="flex items-center gap-2">
                  {selectedModel.icon}
                  <span>{selectedModel.name}</span>
                  {selectedModel.badge && (
                    <span className="ml-auto text-xs font-medium text-primary">
                      {selectedModel.badge}
                    </span>
                  )}
                </div>
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {Object.entries(groupedModels).map(([type, models]) => {
              if (models.length === 0) return null

              return (
                <SelectGroup key={type}>
                  <SelectLabel>{getTypeLabel(type as ModelType)}</SelectLabel>
                  {models.map((model) => (
                    <SelectItem key={model.id} value={model.id}>
                      <div className="flex items-center gap-2">
                        {model.icon}
                        <div className="flex flex-col">
                          <span className="font-medium">{model.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {model.description}
                          </span>
                        </div>
                        {model.badge && (
                          <span className="ml-auto text-xs font-medium text-primary">
                            {model.badge}
                          </span>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectGroup>
              )
            })}
          </SelectContent>
        </Select>
      </div>

      {/* Model details card */}
      {showDetails && selectedModel && (
        <Card className="p-4 space-y-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                {selectedModel.icon}
                <h4 className="text-sm font-semibold">{selectedModel.name}</h4>
              </div>
              <p className="text-xs text-muted-foreground">
                {selectedModel.description}
              </p>
            </div>
            {selectedModel.badge && (
              <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                {selectedModel.badge}
              </span>
            )}
          </div>

          {/* Features */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Features</p>
            <ul className="space-y-1.5">
              {selectedModel.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-xs">
                  <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Max size */}
          {selectedModel.maxSize && (
            <div className="pt-2 border-t">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Max Resolution</span>
                <span className="font-medium">{selectedModel.maxSize}</span>
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  )
}

// Export models for use in other components
export { MODELS }
