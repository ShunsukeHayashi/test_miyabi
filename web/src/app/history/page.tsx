"use client"

import { useState } from "react"
import { History, Trash2, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAppStore } from "@/lib/store"
import Image from "next/image"

export default function HistoryPage() {
  const { history, clearHistory, removeGeneration } = useAppStore()
  const [filter, setFilter] = useState<"all" | "image" | "video">("all")

  const filteredHistory = history.filter(item =>
    filter === "all" ? true : item.type === filter
  )

  const handleDownload = async (url: string, id: string) => {
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      const downloadUrl = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = downloadUrl
      a.download = `byteflow-${id}.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(downloadUrl)
    } catch (error) {
      console.error('Download failed:', error)
    }
  }

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <History className="h-8 w-8" />
              <h1 className="text-3xl font-bold">Generation History</h1>
            </div>
            <p className="text-muted-foreground">
              View and manage your generated images and videos
            </p>
          </div>
          {history.length > 0 && (
            <Button
              variant="destructive"
              onClick={() => {
                if (confirm("Clear all history? This cannot be undone.")) {
                  clearHistory()
                }
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Clear All
            </Button>
          )}
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
          >
            All ({history.length})
          </Button>
          <Button
            variant={filter === "image" ? "default" : "outline"}
            onClick={() => setFilter("image")}
          >
            Images ({history.filter(h => h.type === "image").length})
          </Button>
          <Button
            variant={filter === "video" ? "default" : "outline"}
            onClick={() => setFilter("video")}
          >
            Videos ({history.filter(h => h.type === "video").length})
          </Button>
        </div>

        {/* History Grid */}
        {filteredHistory.length === 0 ? (
          <Card>
            <CardContent className="py-20 text-center">
              <History className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg text-muted-foreground">No history yet</p>
              <p className="text-sm text-muted-foreground mt-2">
                Generated images and videos will appear here
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHistory.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <div className="relative aspect-square">
                  <Image
                    src={item.url}
                    alt={item.prompt}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-sm truncate">
                    {item.prompt}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {item.model} • {new Date(item.createdAt).toLocaleString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {item.revisedPrompt && (
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                      Optimized: {item.revisedPrompt}
                    </p>
                  )}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleDownload(item.url, item.id)}
                    >
                      <Download className="mr-2 h-3 w-3" />
                      Download
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeGeneration(item.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
