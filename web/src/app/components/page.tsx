"use client"

import * as React from "react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { ImagePreview } from "@/components/custom/image-preview"
import { GenerationProgress, GenerationStatus } from "@/components/custom/generation-progress"
import { PromptEditor } from "@/components/custom/prompt-editor"
import { ModelSelector } from "@/components/custom/model-selector"
import { ParameterControls, GenerationParameters } from "@/components/custom/parameter-controls"
import { ThemeToggle } from "@/components/custom/theme-toggle"
import { Button } from "@/components/ui/button"

export default function ComponentsPage() {
  const [prompt, setPrompt] = React.useState("")
  const [selectedModel, setSelectedModel] = React.useState("seedream-4-0-250828")
  const [progress, setProgress] = React.useState(0)
  const [status, setStatus] = React.useState<GenerationStatus>("idle")
  const [parameters, setParameters] = React.useState<GenerationParameters>({
    size: "2K",
    ratio: "1:1",
    watermark: true,
    quantity: 1
  })

  const simulateGeneration = () => {
    setStatus("preparing")
    setProgress(0)

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 30) {
          return prev + 10
        } else if (prev >= 30 && prev < 100) {
          setStatus("generating")
          return prev + 5
        } else {
          clearInterval(interval)
          setStatus("completed")
          return 100
        }
      })
    }, 500)
  }

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Component Showcase</h1>
              <p className="text-muted-foreground">
                Interactive demo of Byteflow custom components
              </p>
            </div>
            <ThemeToggle variant="select" />
          </div>
        </div>

        <Separator />

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="editor">Editor</TabsTrigger>
            <TabsTrigger value="selector">Selector</TabsTrigger>
            <TabsTrigger value="parameters">Parameters</TabsTrigger>
          </TabsList>

          {/* All Components */}
          <TabsContent value="all" className="space-y-8">
            <ComponentSection title="Image Preview" description="Display images with zoom and download functionality">
              <div className="grid gap-4 md:grid-cols-3">
                <ImagePreview
                  src="https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=800"
                  alt="Mountain landscape"
                  aspectRatio="square"
                />
                <ImagePreview
                  src="https://images.unsplash.com/photo-1682687221038-404670f09439?w=800"
                  alt="Ocean sunset"
                  aspectRatio="video"
                />
                <ImagePreview
                  loading={true}
                  src=""
                  aspectRatio="portrait"
                />
              </div>
            </ComponentSection>

            <ComponentSection title="Generation Progress" description="Real-time progress tracking with multiple states">
              <div className="space-y-4">
                <GenerationProgress status="idle" />
                <GenerationProgress status="preparing" progress={25} estimatedTime={15} />
                <GenerationProgress status="generating" progress={75} estimatedTime={8} />
                <GenerationProgress status="completed" progress={100} />
                <GenerationProgress
                  status="error"
                  message="API rate limit exceeded. Please try again in a few moments."
                />
              </div>
            </ComponentSection>

            <ComponentSection title="Prompt Editor" description="Advanced text editor with character counting and AI optimization">
              <div className="space-y-4">
                <PromptEditor
                  value={prompt}
                  onChange={setPrompt}
                  showOptimize={true}
                  onOptimize={() => alert("AI optimization triggered!")}
                />
              </div>
            </ComponentSection>

            <ComponentSection title="Model Selector" description="Select AI models with detailed information">
              <ModelSelector
                value={selectedModel}
                onChange={setSelectedModel}
                showDetails={true}
              />
            </ComponentSection>

            <ComponentSection title="Parameter Controls" description="Fine-tune generation parameters">
              <ParameterControls
                value={parameters}
                onChange={setParameters}
                modelType="t2i"
              />
            </ComponentSection>

            <ComponentSection title="Theme Toggle" description="Switch between light and dark modes">
              <div className="flex items-center gap-4">
                <ThemeToggle variant="button" />
                <ThemeToggle variant="select" />
              </div>
            </ComponentSection>
          </TabsContent>

          {/* Individual Component Tabs */}
          <TabsContent value="preview" className="space-y-4">
            <ComponentSection title="Image Preview States">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Normal</p>
                  <ImagePreview
                    src="https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=800"
                    alt="Normal state"
                  />
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Loading</p>
                  <ImagePreview loading={true} src="" />
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Error</p>
                  <ImagePreview src="invalid-url" alt="Error state" />
                </div>
              </div>
            </ComponentSection>
          </TabsContent>

          <TabsContent value="progress" className="space-y-4">
            <ComponentSection title="Progress Simulator">
              <div className="space-y-4">
                <GenerationProgress
                  status={status}
                  progress={progress}
                  estimatedTime={20 - (progress / 5)}
                />
                <div className="flex gap-2">
                  <Button onClick={simulateGeneration} disabled={status !== "idle" && status !== "completed"}>
                    Start Generation
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setStatus("idle")
                      setProgress(0)
                    }}
                  >
                    Reset
                  </Button>
                </div>
              </div>
            </ComponentSection>
          </TabsContent>

          <TabsContent value="editor" className="space-y-4">
            <ComponentSection title="Prompt Editor">
              <PromptEditor
                value={prompt}
                onChange={setPrompt}
                showOptimize={true}
                maxLength={500}
                minLength={10}
              />
            </ComponentSection>
          </TabsContent>

          <TabsContent value="selector" className="space-y-4">
            <ComponentSection title="Model Selector">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <p className="text-sm font-medium">With Details</p>
                  <ModelSelector
                    value={selectedModel}
                    onChange={setSelectedModel}
                    showDetails={true}
                  />
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Compact</p>
                  <ModelSelector
                    value={selectedModel}
                    onChange={setSelectedModel}
                    showDetails={false}
                  />
                </div>
              </div>
            </ComponentSection>
          </TabsContent>

          <TabsContent value="parameters" className="space-y-4">
            <ComponentSection title="Parameter Controls by Model Type">
              <div className="grid gap-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Text-to-Image (T2I)</p>
                  <ParameterControls
                    value={parameters}
                    onChange={setParameters}
                    modelType="t2i"
                  />
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Image-to-Video (I2V)</p>
                  <ParameterControls
                    value={{
                      size: "1080P",
                      watermark: false,
                      duration: 10,
                      fixedLens: false
                    }}
                    onChange={setParameters}
                    modelType="i2v"
                  />
                </div>
              </div>
            </ComponentSection>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function ComponentSection({
  title,
  description,
  children
}: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <Card className="p-6">{children}</Card>
    </div>
  )
}
