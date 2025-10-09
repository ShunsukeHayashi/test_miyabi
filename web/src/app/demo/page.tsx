"use client"

import { useState } from "react"
import { Sparkles, Image as ImageIcon, Video, Wand2, Zap } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { T2IDemo } from "@/components/demo/t2i-demo"
import { I2IDemo } from "@/components/demo/i2i-demo"
import { I2VDemo } from "@/components/demo/i2v-demo"
import { BatchDemo } from "@/components/demo/batch-demo"

export default function DemoPage() {
  return (
    <div className="container py-10">
      <div className="mx-auto max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="h-16 w-16 text-primary animate-pulse" />
          </div>
          <h1 className="text-5xl font-bold tracking-tight mb-3 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            BytePlus AI Demo
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience the power of BytePlus SEEDREAM, SEEDEDIT, and SEEDANCE models
          </p>
          <div className="flex items-center justify-center gap-6 mt-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              <span>Text-to-Image</span>
            </div>
            <div className="flex items-center gap-2">
              <Wand2 className="h-4 w-4" />
              <span>Image-to-Image</span>
            </div>
            <div className="flex items-center gap-2">
              <Video className="h-4 w-4" />
              <span>Image-to-Video</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              <span>Batch Generation</span>
            </div>
          </div>
        </div>

        {/* Demo Tabs */}
        <Tabs defaultValue="t2i" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="t2i" className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Text-to-Image</span>
              <span className="sm:hidden">T2I</span>
            </TabsTrigger>
            <TabsTrigger value="i2i" className="flex items-center gap-2">
              <Wand2 className="h-4 w-4" />
              <span className="hidden sm:inline">Image-to-Image</span>
              <span className="sm:hidden">I2I</span>
            </TabsTrigger>
            <TabsTrigger value="i2v" className="flex items-center gap-2">
              <Video className="h-4 w-4" />
              <span className="hidden sm:inline">Image-to-Video</span>
              <span className="sm:hidden">I2V</span>
            </TabsTrigger>
            <TabsTrigger value="batch" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              <span className="hidden sm:inline">Batch</span>
              <span className="sm:hidden">Batch</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="t2i" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  Text-to-Image Generation
                </CardTitle>
                <CardDescription>
                  Create stunning images from text descriptions using SEEDREAM 4.0
                </CardDescription>
              </CardHeader>
              <CardContent>
                <T2IDemo />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="i2i" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wand2 className="h-5 w-5" />
                  Image-to-Image Editing
                </CardTitle>
                <CardDescription>
                  Edit and transform existing images with SeedEdit 3.0
                </CardDescription>
              </CardHeader>
              <CardContent>
                <I2IDemo />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="i2v" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5" />
                  Image-to-Video Animation
                </CardTitle>
                <CardDescription>
                  Bring your images to life with Seedance 1.0 Pro
                </CardDescription>
              </CardHeader>
              <CardContent>
                <I2VDemo />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="batch" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Batch Generation
                </CardTitle>
                <CardDescription>
                  Generate multiple images in parallel for maximum efficiency
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BatchDemo />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="text-sm">Highest Quality</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                SEEDREAM 4.0 delivers photorealistic 4K images
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="text-sm">Sequential Generation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Create consistent image series automatically
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="text-sm">Dynamic Video</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Animate images with cinematic camera movements
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="text-sm">Batch Processing</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Generate up to 10 images concurrently
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Info Footer */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-sm">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="font-medium">Powered by BytePlus AI</span>
            <span className="text-muted-foreground">|</span>
            <span className="text-muted-foreground">Built with Miyabi Framework</span>
          </div>
        </div>
      </div>
    </div>
  )
}
