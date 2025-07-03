import { NextResponse } from 'next/server';
import { requireAuth, AuthenticatedRequest } from '@/middleware/auth';

// POST - Upload image
async function uploadImageHandler(request: AuthenticatedRequest) {
  try {
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

    // For now, we'll use a placeholder URL
    // In a real application, you would upload to Cloudinary, AWS S3, or similar
    const placeholderUrl = `https://via.placeholder.com/800x400/FF6B35/FFFFFF?text=${encodeURIComponent(file.name)}`;

    return NextResponse.json({
      url: placeholderUrl,
      filename: file.name,
      size: file.size,
      type: file.type
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