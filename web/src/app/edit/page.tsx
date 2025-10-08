/**
 * Image-to-Image Editing Page
 *
 * Features:
 * - Drag-and-drop image upload
 * - Before/after comparison slider
 * - useEditImage hook integration
 */
'use client';

import { useState, useCallback } from 'react';
import { useEditImage } from '@/hooks/use-edit-image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { ImagePlus, Upload, Download, ArrowLeftRight, X } from 'lucide-react';
import Image from 'next/image';

export default function EditPage() {
  const [prompt, setPrompt] = useState('');
  const [size, setSize] = useState<'1K' | '2K' | '4K'>('2K');
  const [watermark, setWatermark] = useState(false);
  const [sourceImage, setSourceImage] = useState<string>('');
  const [sourceImageName, setSourceImageName] = useState<string>('');
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [comparisonPosition, setComparisonPosition] = useState([50]);

  const { editImage, isLoading, error } = useEditImage();

  const handleFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setSourceImage(reader.result as string);
      setSourceImageName(file.name);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handleFile(file);
    }
  };

  const handleEdit = async () => {
    if (!prompt.trim() || !sourceImage) {
      return;
    }

    try {
      const result = await editImage({
        image: sourceImage,
        prompt,
        size,
        watermark,
      });

      if (result.data && result.data.length > 0) {
        setEditedImage(result.data[0].url);
      }
    } catch (err) {
      console.error('Edit failed:', err);
    }
  };

  const handleDownload = () => {
    if (editedImage) {
      const link = document.createElement('a');
      link.href = editedImage;
      link.download = `edited-${Date.now()}.png`;
      link.click();
    }
  };

  const clearSource = () => {
    setSourceImage('');
    setSourceImageName('');
    setEditedImage(null);
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-2">
          <ImagePlus className="h-8 w-8 text-primary" />
          Image-to-Image Editing
        </h1>
        <p className="text-muted-foreground">
          Upload an image and describe the changes you want to make
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Controls */}
        <div className="space-y-6">
          {/* Image Upload with Drag & Drop */}
          <Card>
            <CardHeader>
              <CardTitle>Source Image</CardTitle>
              <CardDescription>Upload or drag & drop an image</CardDescription>
            </CardHeader>
            <CardContent>
              {!sourceImage ? (
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                    isDragging
                      ? 'border-primary bg-primary/10'
                      : 'border-muted-foreground/25 hover:border-primary/50'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('image-upload')?.click()}
                >
                  <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm font-medium mb-2">
                    Drop your image here, or click to browse
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Supports: JPG, PNG, WebP (Max 10MB)
                  </p>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </div>
              ) : (
                <div className="relative">
                  <div className="relative aspect-square rounded-lg overflow-hidden border">
                    <Image src={sourceImage} alt="Source" fill className="object-cover" />
                  </div>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={clearSource}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2 truncate">
                    {sourceImageName}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Editing Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>Editing Instructions</CardTitle>
              <CardDescription>Describe the changes you want to make</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Textarea
                  placeholder="Add vibrant sunset lighting, enhance colors, add soft glow effect..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground">{prompt.length} / 2000 characters</p>
              </div>

              <div className="space-y-2">
                <Label>Output Size</Label>
                <Select value={size} onValueChange={(v: any) => setSize(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1K">1K (1024x1024)</SelectItem>
                    <SelectItem value="2K">2K (2048x2048)</SelectItem>
                    <SelectItem value="4K">4K (4096x4096)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <Label>Watermark</Label>
                <Switch checked={watermark} onCheckedChange={setWatermark} />
              </div>

              <Button
                onClick={handleEdit}
                disabled={isLoading || !sourceImage || !prompt.trim()}
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

              {error && (
                <div className="p-4 bg-destructive/10 text-destructive rounded-lg text-sm">
                  {error}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Preview with Before/After Comparison */}
        <div className="space-y-6">
          {editedImage && sourceImage ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ArrowLeftRight className="h-5 w-5" />
                    Before & After Comparison
                  </CardTitle>
                  <CardDescription>Drag the slider to compare</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative aspect-square rounded-lg overflow-hidden border">
                    {/* Before Image (Full) */}
                    <Image
                      src={sourceImage}
                      alt="Before"
                      fill
                      className="object-cover"
                    />

                    {/* After Image (Clipped) */}
                    <div
                      className="absolute inset-0 overflow-hidden"
                      style={{ clipPath: `inset(0 ${100 - comparisonPosition[0]}% 0 0)` }}
                    >
                      <Image
                        src={editedImage}
                        alt="After"
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Slider Line */}
                    <div
                      className="absolute top-0 bottom-0 w-1 bg-white shadow-lg"
                      style={{ left: `${comparisonPosition[0]}%` }}
                    >
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
                        <ArrowLeftRight className="h-4 w-4 text-gray-700" />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <Slider
                      value={comparisonPosition}
                      onValueChange={setComparisonPosition}
                      min={0}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                  </div>
                </CardContent>
              </Card>

              <Button onClick={handleDownload} className="w-full" size="lg">
                <Download className="mr-2 h-4 w-4" />
                Download Edited Image
              </Button>
            </>
          ) : (
            <Card className="p-12 flex flex-col items-center justify-center text-center border-dashed min-h-[400px]">
              <ImagePlus className="h-16 w-16 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">
                {!sourceImage
                  ? 'Upload an image to get started'
                  : 'Your edited image will appear here'}
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
