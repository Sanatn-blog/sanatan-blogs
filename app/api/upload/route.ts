import { NextResponse } from 'next/server';
import { requireAuth, AuthenticatedRequest } from '@/middleware/auth';
import { uploadBlogImage } from '@/lib/cloudinary';

// POST - Upload image
async function uploadImageHandler(request: AuthenticatedRequest) {
  try {
    // Check if Cloudinary environment variables are configured
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.error('Cloudinary environment variables not configured');
      return NextResponse.json(
        { error: 'Image upload service not configured. Please contact administrator.' },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('image') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      );
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 10MB' },
        { status: 400 }
      );
    }

    // Convert File to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const uploadResult = await uploadBlogImage(buffer);

    return NextResponse.json({
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      filename: file.name,
      size: uploadResult.bytes,
      type: file.type,
      width: uploadResult.width,
      height: uploadResult.height
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}

export const POST = requireAuth(uploadImageHandler); 