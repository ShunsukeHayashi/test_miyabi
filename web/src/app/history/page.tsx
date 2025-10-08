"use client"

import { useState } from "react"
import { History, Trash2, Download, Heart, Filter, X, Search, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useGenerationHistory } from "@/hooks/use-generation-history"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import Image from "next/image"
import type { GenerationHistory } from "@/types/store"

export default function HistoryPage() {
  const {
    history,
    imageHistory,
    videoHistory,
    favorites,
    clearHistory,
    removeItem,
    toggleFavorite,
    searchByPrompt,
    filterByModel,
    getItemsByDateRange,
  } = useGenerationHistory()

  const [typeFilter, setTypeFilter] = useState<"all" | "image" | "video">("all")
  const [favoritesOnly, setFavoritesOnly] = useState(false)
  const [modelFilter, setModelFilter] = useState<string>("all")
  const [dateFilter, setDateFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedItem, setSelectedItem] = useState<GenerationHistory | null>(null)

  // Get unique models for filter
  const models = Array.from(new Set(history.map(item => item.model)))

  // Apply filters
  let filteredHistory = history

  // Type filter
  if (typeFilter === "image") filteredHistory = imageHistory
  if (typeFilter === "video") filteredHistory = videoHistory

  // Favorites filter
  if (favoritesOnly) {
    filteredHistory = filteredHistory.filter(item => item.isFavorite)
  }

  // Model filter
  if (modelFilter !== "all") {
    filteredHistory = filteredHistory.filter(item => item.model === modelFilter)
  }

  // Date filter
  if (dateFilter !== "all") {
    const now = new Date()
    let startDate = new Date()

    if (dateFilter === "today") {
      startDate.setHours(0, 0, 0, 0)
    } else if (dateFilter === "week") {
      startDate.setDate(now.getDate() - 7)
    } else if (dateFilter === "month") {
      startDate.setMonth(now.getMonth() - 1)
    }

    filteredHistory = filteredHistory.filter(item => item.createdAt >= startDate.getTime())
  }

  // Search filter
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase()
    filteredHistory = filteredHistory.filter(
      item =>
        item.prompt.toLowerCase().includes(query) ||
        item.revisedPrompt?.toLowerCase().includes(query)
    )
  }

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

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by prompt..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Filter Toolbar */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Type Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Type</label>
                <Select value={typeFilter} onValueChange={(v: any) => setTypeFilter(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All ({history.length})</SelectItem>
                    <SelectItem value="image">Images ({imageHistory.length})</SelectItem>
                    <SelectItem value="video">Videos ({videoHistory.length})</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Model Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Model</label>
                <Select value={modelFilter} onValueChange={setModelFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Models</SelectItem>
                    {models.map(model => (
                      <SelectItem key={model} value={model}>
                        {model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Date Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Date</label>
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">Past Week</SelectItem>
                    <SelectItem value="month">Past Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Favorites Toggle */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Show</label>
                <Button
                  variant={favoritesOnly ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => setFavoritesOnly(!favoritesOnly)}
                >
                  <Heart className={`mr-2 h-4 w-4 ${favoritesOnly ? 'fill-current' : ''}`} />
                  {favoritesOnly ? 'Favorites Only' : 'All Items'}
                </Button>
              </div>
            </div>

            {/* Active Filters */}
            {(typeFilter !== "all" || modelFilter !== "all" || dateFilter !== "all" || favoritesOnly || searchQuery) && (
              <div className="mt-4 flex items-center gap-2 flex-wrap">
                <span className="text-sm text-muted-foreground">Active filters:</span>
                {typeFilter !== "all" && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setTypeFilter("all")}
                  >
                    Type: {typeFilter}
                    <X className="ml-2 h-3 w-3" />
                  </Button>
                )}
                {modelFilter !== "all" && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setModelFilter("all")}
                  >
                    Model: {modelFilter}
                    <X className="ml-2 h-3 w-3" />
                  </Button>
                )}
                {dateFilter !== "all" && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setDateFilter("all")}
                  >
                    Date: {dateFilter}
                    <X className="ml-2 h-3 w-3" />
                  </Button>
                )}
                {favoritesOnly && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setFavoritesOnly(false)}
                  >
                    Favorites Only
                    <X className="ml-2 h-3 w-3" />
                  </Button>
                )}
                {searchQuery && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setSearchQuery("")}
                  >
                    Search: "{searchQuery}"
                    <X className="ml-2 h-3 w-3" />
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="mb-4 text-sm text-muted-foreground">
          Showing {filteredHistory.length} of {history.length} items
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
              <Card key={item.id} className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
                <div
                  className="relative aspect-square"
                  onClick={() => setSelectedItem(item)}
                >
                  <Image
                    src={item.url}
                    alt={item.prompt}
                    fill
                    className="object-cover"
                  />
                  {item.isFavorite && (
                    <div className="absolute top-2 right-2 bg-black/50 rounded-full p-2">
                      <Heart className="h-4 w-4 text-red-500 fill-current" />
                    </div>
                  )}
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
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDownload(item.url, item.id)
                      }}
                    >
                      <Download className="mr-2 h-3 w-3" />
                      Download
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleFavorite(item.id)
                      }}
                    >
                      <Heart className={`h-3 w-3 ${item.isFavorite ? 'fill-current text-red-500' : ''}`} />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeItem(item.id)
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Detail Modal */}
        <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
          <DialogContent className="max-w-4xl">
            {selectedItem && (
              <>
                <DialogHeader>
                  <DialogTitle>Generation Details</DialogTitle>
                  <DialogDescription>
                    {new Date(selectedItem.createdAt).toLocaleString()}
                  </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Image Preview */}
                  <div className="relative aspect-square rounded-lg overflow-hidden border">
                    <Image
                      src={selectedItem.url}
                      alt={selectedItem.prompt}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Prompt</h3>
                      <p className="text-sm text-muted-foreground">{selectedItem.prompt}</p>
                    </div>

                    {selectedItem.revisedPrompt && (
                      <div>
                        <h3 className="font-semibold mb-2">Optimized Prompt</h3>
                        <p className="text-sm text-muted-foreground">{selectedItem.revisedPrompt}</p>
                      </div>
                    )}

                    <div>
                      <h3 className="font-semibold mb-2">Model</h3>
                      <p className="text-sm text-muted-foreground">{selectedItem.model}</p>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Type</h3>
                      <p className="text-sm text-muted-foreground capitalize">{selectedItem.type}</p>
                    </div>

                    {selectedItem.metadata && (
                      <div>
                        <h3 className="font-semibold mb-2">Metadata</h3>
                        <div className="text-sm text-muted-foreground space-y-1">
                          {selectedItem.metadata.size && <p>Size: {selectedItem.metadata.size}</p>}
                          {selectedItem.metadata.seed !== undefined && <p>Seed: {selectedItem.metadata.seed}</p>}
                          {selectedItem.metadata.generationTime && (
                            <p>Generation Time: {selectedItem.metadata.generationTime}ms</p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-4">
                      <Button
                        onClick={() => handleDownload(selectedItem.url, selectedItem.id)}
                        className="flex-1"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => toggleFavorite(selectedItem.id)}
                      >
                        <Heart className={`h-4 w-4 ${selectedItem.isFavorite ? 'fill-current text-red-500' : ''}`} />
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => {
                          removeItem(selectedItem.id)
                          setSelectedItem(null)
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
