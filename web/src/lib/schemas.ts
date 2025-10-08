/**
 * Zod Validation Schemas
 *
 * Form validation schemas for image and video generation.
 * Used with React Hook Form for type-safe form validation.
 *
 * @module lib/schemas
 */

import { z } from "zod"

/**
 * Text-to-Image generation form schema
 */
export const textToImageSchema = z.object({
  model: z.enum(["seedream-4-0-250828", "seedream-3-5", "seedream-3-0"], {
    message: "Please select a model",
  }),
  prompt: z
    .string()
    .min(1, "Prompt is required")
    .max(2000, "Prompt must be less than 2000 characters"),
  size: z.enum(["1K", "2K", "4K"], {
    message: "Please select an image size",
  }),
  watermark: z.boolean().default(true),
  seed: z
    .number()
    .int()
    .min(-1, "Seed must be -1 or positive")
    .optional()
    .or(z.literal("")),
  optimizePrompt: z.boolean().default(false),
})

export type TextToImageFormData = z.infer<typeof textToImageSchema>

/**
 * Image-to-Image editing form schema
 */
export const imageToImageSchema = z.object({
  model: z.literal("Bytedance-SeedEdit-3.0-i2i"),
  prompt: z
    .string()
    .min(1, "Edit instructions are required")
    .max(2000, "Prompt must be less than 2000 characters"),
  imageUrl: z
    .string()
    .url("Please provide a valid image URL")
    .or(z.string().startsWith("data:", "Invalid image data")),
  size: z.enum(["1K", "2K", "4K"]),
  watermark: z.boolean().default(true),
  seed: z
    .number()
    .int()
    .min(-1)
    .optional()
    .or(z.literal("")),
})

export type ImageToImageFormData = z.infer<typeof imageToImageSchema>

/**
 * Batch generation form schema
 */
export const batchGenerationSchema = z.object({
  prompts: z
    .string()
    .min(1, "At least one prompt is required")
    .refine(
      (value) => {
        const lines = value.split("\n").filter((line) => line.trim().length > 0)
        return lines.length >= 1 && lines.length <= 100
      },
      {
        message: "Please provide 1-100 prompts (one per line)",
      }
    ),
  model: z.enum(["seedream-4-0-250828", "seedream-3-5", "seedream-3-0"]),
  size: z.enum(["1K", "2K", "4K"]),
  watermark: z.boolean().default(true),
  maxConcurrency: z
    .number()
    .int()
    .min(1, "Concurrency must be at least 1")
    .max(20, "Concurrency must be at most 20")
    .default(10),
})

export type BatchGenerationFormData = z.infer<typeof batchGenerationSchema>

/**
 * Video generation form schema
 */
export const videoGenerationSchema = z.object({
  model: z.literal("Bytedance-Seedance-1.0-pro"),
  imageUrl: z
    .string()
    .url("Please provide a valid image URL")
    .or(z.string().startsWith("data:")),
  prompt: z
    .string()
    .max(2000, "Prompt must be less than 2000 characters")
    .optional(),
  resolution: z.enum(["480P", "720P", "1080P"]).default("1080P"),
  ratio: z
    .enum(["Auto", "21:9", "16:9", "4:3", "1:1", "3:4", "9:16"])
    .default("16:9"),
  duration: z.union([z.literal(5), z.literal(10)]).default(5),
  fixedLens: z.boolean().default(false),
  watermark: z.boolean().default(true),
  seed: z
    .number()
    .int()
    .min(-1)
    .optional()
    .or(z.literal("")),
})

export type VideoGenerationFormData = z.infer<typeof videoGenerationSchema>

/**
 * Settings form schema
 */
export const settingsSchema = z.object({
  defaultImageModel: z.enum([
    "seedream-4-0-250828",
    "seedream-3-5",
    "seedream-3-0",
    "Bytedance-SeedEdit-3.0-i2i",
  ]),
  defaultVideoModel: z.literal("Bytedance-Seedance-1.0-pro"),
  defaultImageSize: z.enum(["1K", "2K", "4K"]),
  defaultWatermark: z.boolean(),
  autoOptimizePrompts: z.boolean(),
  maxHistoryItems: z.number().int().min(0).max(1000),
  theme: z.enum(["light", "dark", "system"]),
})

export type SettingsFormData = z.infer<typeof settingsSchema>

/**
 * Helper function to parse seed input
 * Converts empty string to undefined, keeps number as-is
 */
export function parseSeedInput(value: number | "" | undefined): number | undefined {
  if (value === "" || value === undefined) return undefined
  return value
}

/**
 * Helper function to parse prompts from textarea
 * Splits by newlines and filters empty lines
 */
export function parsePromptsFromText(text: string): string[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
}
