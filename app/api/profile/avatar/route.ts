import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { requireAuth, AuthenticatedRequest } from '@/middleware/auth';
import { uploadAvatar, deleteFromCloudinary } from '@/lib/cloudinary';

// POST - Upload profile avatar
async function uploadAvatarHandler(request: AuthenticatedRequest) {
  try {
    await connectDB();

    // Check if Cloudinary environment variables are configured
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.error('Cloudinary environment variables not configured');
      return NextResponse.json(
        { error: 'Image upload service not configured. Please contact administrator.' },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('avatar') as File;
    const cropData = formData.get('cropData') as string;

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

    // Validate file size (5MB limit for avatars)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 5MB' },
        { status: 400 }
      );
    }

    // Convert File to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Parse crop data if provided
    if (cropData) {
      try {
        const crop = JSON.parse(cropData);
        // Note: Crop data is parsed but not used in current implementation
        // uploadOptions could be used for Cloudinary transformation options
        console.log('Crop data received:', crop);
      } catch (error) {
        console.error('Invalid crop data:', error);
      }
    }

    // Upload to Cloudinary with avatar settings
    const uploadResult = await uploadAvatar(buffer);

    // Get current user to check if they have an existing avatar
    const currentUser = await User.findById(request.user?._id);
    if (currentUser?.avatar) {
      // Extract public_id from existing avatar URL and delete it
      try {
        const urlParts = currentUser.avatar.split('/');
        const publicId = urlParts[urlParts.length - 1].split('.')[0];
        await deleteFromCloudinary(`sanatan-blogs/avatars/${publicId}`);
      } catch (error) {
        console.error('Failed to delete old avatar:', error);
      }
    }

    // Update user's avatar in database
    const updatedUser = await User.findByIdAndUpdate(
      request.user?._id,
      { avatar: uploadResult.secure_url },
      { new: true }
    ).select('-password -emailVerificationToken -resetPasswordToken -resetPasswordExpires -otp -otpExpiry');

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Avatar updated successfully',
      avatar: uploadResult.secure_url,
      user: updatedUser
    });

  } catch (error) {
    console.error('Avatar upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload avatar' },
      { status: 500 }
    );
  }
}

export const POST = requireAuth(uploadAvatarHandler); 