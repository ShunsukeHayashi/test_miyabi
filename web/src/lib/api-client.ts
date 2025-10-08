// Client-side API wrapper for BytePlus operations
// Calls Next.js API routes (which securely use BytePlusClient on the server)

export interface GenerateImageRequest {
  model: string;
  prompt: string;
  size?: '1K' | '2K' | '4K';
  watermark?: boolean;
  seed?: number;
  image?: string[]; // For image-to-image
  sequential_image_generation?: 'auto' | 'none';
  sequential_image_generation_options?: {
    max_images?: number;
  };
}

export interface GenerateVideoRequest {
  model: string;
  image: string;
  prompt?: string;
  resolution?: '720P' | '1080P' | '4K';
  ratio?: '16:9' | '9:16' | '1:1' | '4:3' | '3:4';
  duration?: number;
  fixed_lens?: boolean;
  watermark?: boolean;
  seed?: number;
}

export interface OptimizePromptRequest {
  prompt: string;
  type?: 'image' | 'image-edit' | 'video';
  style?: string;
}

export interface BatchGenerateRequest {
  prompts: string[];
  sharedParams: Partial<GenerateImageRequest>;
  maxConcurrency?: number;
}

export interface EditImageRequest {
  image: string | string[];
  prompt: string;
  size?: '1K' | '2K' | '4K';
  watermark?: boolean;
  seed?: number;
}

export class APIClient {
  private baseUrl: string;

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl;
  }

  async generateImage(params: GenerateImageRequest) {
    const response = await fetch(`${this.baseUrl}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to generate image');
    }

    return response.json();
  }

  async generateVideo(params: GenerateVideoRequest) {
    const response = await fetch(`${this.baseUrl}/api/generate-video`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to generate video');
    }

    return response.json();
  }

  async batchGenerate(params: BatchGenerateRequest) {
    const response = await fetch(`${this.baseUrl}/api/batch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to batch generate images');
    }

    return response.json();
  }

  async editImage(params: EditImageRequest) {
    const response = await fetch(`${this.baseUrl}/api/edit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to edit image');
    }

    return response.json();
  }

  async optimizePrompt(params: OptimizePromptRequest) {
    const response = await fetch(`${this.baseUrl}/api/optimize-prompt`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to optimize prompt');
    }

    return response.json();
  }
}

export const apiClient = new APIClient();
