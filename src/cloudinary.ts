/**
 * Cloudinary Client Helper
 * Provides functions to upload media (images and videos) and build optimized Cloudinary URLs.
 */

export interface CloudinaryUploadResponse {
  success: boolean;
  url: string;
  publicId: string;
  format: string;
  width?: number;
  height?: number;
  duration?: number;
  bytes?: number;
  resourceType: string;
}

export interface CloudinaryResource {
  publicId: string;
  format: string;
  url: string;
  width: number;
  height: number;
  bytes: number;
  createdAt: string;
}

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'tomxzhw2';

/**
 * Upload a video directly to Cloudinary using secure signature or server proxy
 */
export async function uploadVideoToCloudinary(
  file: File,
  options: {
    folder?: string;
    onProgress?: (percent: number) => void;
  } = {}
): Promise<CloudinaryUploadResponse> {
  const folder = options.folder || 'cinematic_assets';

  // Step 1: Request signed upload parameters from backend
  try {
    const signRes = await fetch('/api/cloudinary/sign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ folder }),
    });

    if (signRes.ok) {
      const signData = await signRes.json();
      const { signature, timestamp, apiKey, cloudName } = signData;

      // Direct upload to Cloudinary video endpoint
      return await new Promise<CloudinaryUploadResponse>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        const url = `https://api.cloudinary.com/v1_1/${cloudName || CLOUD_NAME}/video/upload`;

        xhr.open('POST', url, true);

        if (xhr.upload && options.onProgress) {
          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
              const percent = Math.round((event.loaded / event.total) * 100);
              options.onProgress?.(percent);
            }
          };
        }

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const res = JSON.parse(xhr.responseText);
              resolve({
                success: true,
                url: res.secure_url || res.url,
                publicId: res.public_id,
                format: res.format,
                width: res.width,
                height: res.height,
                duration: res.duration,
                bytes: res.bytes,
                resourceType: res.resource_type || 'video',
              });
            } catch (e: any) {
              reject(new Error('Failed to parse Cloudinary response: ' + e.message));
            }
          } else {
            let errorMsg = `Cloudinary returned HTTP ${xhr.status}`;
            try {
              const res = JSON.parse(xhr.responseText);
              if (res.error?.message) errorMsg = res.error.message;
            } catch {
              // ignore
            }
            reject(new Error(errorMsg));
          }
        };

        xhr.onerror = () => {
          reject(new Error('Network error during Cloudinary video upload'));
        };

        const formData = new FormData();
        formData.append('file', file);
        formData.append('api_key', apiKey);
        formData.append('timestamp', String(timestamp));
        formData.append('signature', signature);
        formData.append('folder', folder);

        xhr.send(formData);
      });
    }
  } catch (err: any) {
    console.warn('Direct signed upload failed, falling back to server proxy:', err.message);
  }

  // Step 2: Fallback to server proxy upload if direct fails
  const fileData = await fileToBase64(file);
  const response = await fetch('/api/cloudinary/upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ file: fileData, folder }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Upload failed with status ${response.status}`);
  }

  const result = await response.json();
  return {
    success: true,
    url: result.url,
    publicId: result.publicId,
    format: result.format,
    width: result.width,
    height: result.height,
    bytes: result.bytes,
    resourceType: result.resourceType || 'video',
  };
}

/**
 * Upload an image or file via the secure server proxy route
 */
export async function uploadToCloudinary(
  file: File | string,
  folder = 'cinematic_assets'
): Promise<CloudinaryUploadResponse> {
  let fileData: string;

  if (typeof file === 'string') {
    fileData = file;
  } else {
    fileData = await fileToBase64(file);
  }

  const response = await fetch('/api/cloudinary/upload', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      file: fileData,
      folder,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Upload failed with status ${response.status}`);
  }

  return response.json();
}

/**
 * Helper to convert File to base64 Data URL
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

/**
 * Get optimized Cloudinary URL with dynamic transformations
 */
export function getOptimizedImageUrl(
  publicIdOrUrl: string,
  options: {
    width?: number;
    height?: number;
    crop?: 'fill' | 'scale' | 'fit' | 'thumb';
    quality?: 'auto' | number;
    format?: 'auto' | 'webp' | 'jpg' | 'png';
  } = {}
): string {
  if (!publicIdOrUrl) return '';

  if (publicIdOrUrl.startsWith('http')) {
    if (publicIdOrUrl.includes('cloudinary.com')) {
      const parts = publicIdOrUrl.split('/upload/');
      if (parts.length === 2) {
        const transforms: string[] = [];
        if (options.width) transforms.push(`w_${options.width}`);
        if (options.height) transforms.push(`h_${options.height}`);
        if (options.crop) transforms.push(`c_${options.crop}`);
        transforms.push(`q_${options.quality || 'auto'}`);
        transforms.push(`f_${options.format || 'auto'}`);
        return `${parts[0]}/upload/${transforms.join(',')}/${parts[1]}`;
      }
    }
    return publicIdOrUrl;
  }

  const transforms: string[] = [];
  if (options.width) transforms.push(`w_${options.width}`);
  if (options.height) transforms.push(`h_${options.height}`);
  if (options.crop) transforms.push(`c_${options.crop}`);
  transforms.push(`q_${options.quality || 'auto'}`);
  transforms.push(`f_${options.format || 'auto'}`);

  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transforms.join(',')}/${publicIdOrUrl}`;
}

/**
 * Fetch recently uploaded media from Cloudinary
 */
export async function getCloudinaryMedia(max = 20): Promise<CloudinaryResource[]> {
  try {
    const res = await fetch(`/api/cloudinary/resources?max=${max}`);
    if (!res.ok) return [];
    const data = await res.json();
    return data.resources || [];
  } catch {
    return [];
  }
}

/**
 * Check Cloudinary connection status
 */
export async function checkCloudinaryStatus(): Promise<{
  connected: boolean;
  cloudName: string;
}> {
  try {
    const res = await fetch('/api/cloudinary/status');
    const data = await res.json();
    return {
      connected: data.status === 'connected',
      cloudName: data.cloudName,
    };
  } catch {
    return {
      connected: false,
      cloudName: CLOUD_NAME,
    };
  }
}
