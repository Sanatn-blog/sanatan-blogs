import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

export interface UploadOptions {
  folder?: string;
  quality?: string;
  width?: number;
  height?: number;
  crop?: string;
  format?: string;
}

export async function uploadToCloudinary(
  file: Buffer | string,
  options: UploadOptions = {}
): Promise<CloudinaryUploadResult> {
  try {
    const defaultOptions = {
      folder: 'sanatan-blogs',
      quality: 'auto',
      fetch_format: 'auto',
      ...options
    };

    // Convert Buffer to data URI if needed
    const fileToUpload = Buffer.isBuffer(file) 
      ? `data:image/jpeg;base64,${file.toString('base64')}`
      : file;

    const result = await cloudinary.uploader.upload(fileToUpload, defaultOptions);
    
    return {
      public_id: result.public_id,
      secure_url: result.secure_url,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload image to Cloudinary');
  }
}

export async function deleteFromCloudinary(publicId: string): Promise<boolean> {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === 'ok';
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    return false;
  }
}

export async function uploadAvatar(file: Buffer | string): Promise<CloudinaryUploadResult> {
  return uploadToCloudinary(file, {
    folder: 'sanatan-blogs/avatars',
    width: 200,
    height: 200,
    crop: 'fill',
    quality: '80',
    format: 'jpg'
  });
}

export async function uploadBlogImage(file: Buffer | string): Promise<CloudinaryUploadResult> {
  return uploadToCloudinary(file, {
    folder: 'sanatan-blogs/blog-images',
    width: 1200,
    height: 630,
    crop: 'fill',
    quality: '85',
    format: 'jpg'
  });
}

export async function uploadThumbnail(file: Buffer | string): Promise<CloudinaryUploadResult> {
  return uploadToCloudinary(file, {
    folder: 'sanatan-blogs/thumbnails',
    width: 400,
    height: 250,
    crop: 'fill',
    quality: '80',
    format: 'jpg'
  });
}

export function getOptimizedImageUrl(
  publicId: string,
  options: {
    width?: number;
    height?: number;
    quality?: string;
    format?: string;
  } = {}
): string {
  return cloudinary.url(publicId, {
    quality: 'auto',
    fetch_format: 'auto',
    ...options
  });
}

export default cloudinary; 