'use client';

import React, { useState, useRef, useCallback } from 'react';
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { X, RotateCw, Check } from 'lucide-react';

interface ImageCropperProps {
  imageSrc: string;
  onCropComplete: (croppedImage: string) => void;
  onCancel: () => void;
  aspectRatio?: number;
}

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number,
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  )
}

export default function ImageCropper({ 
  imageSrc, 
  onCropComplete, 
  onCancel, 
  aspectRatio = 1 
}: ImageCropperProps) {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [rotation, setRotation] = useState(0);
  const imgRef = useRef<HTMLImageElement>(null);

  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    const crop = centerAspectCrop(width, height, aspectRatio);
    setCrop(crop);
  }, [aspectRatio]);

  const getCroppedImg = useCallback(async (): Promise<string> => {
    if (!imgRef.current || !completedCrop) {
      throw new Error('No image or crop data');
    }

    const image = imgRef.current;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('No 2d context');
    }

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;

    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width,
      completedCrop.height,
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          resolve(url);
        }
      }, 'image/jpeg', 0.9);
    });
  }, [completedCrop]);

  const handleCropComplete = async () => {
    try {
      const croppedImageUrl = await getCroppedImg();
      onCropComplete(croppedImageUrl);
    } catch (error) {
      console.error('Error cropping image:', error);
    }
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Crop Profile Image</h3>
          <button
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="relative mb-4">
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={aspectRatio}
            circularCrop
          >
            <img
              ref={imgRef}
              alt="Crop me"
              src={imageSrc}
              onLoad={onImageLoad}
              style={{ 
                transform: `rotate(${rotation}deg)`,
                maxWidth: '100%',
                maxHeight: '60vh'
              }}
              className="rounded-lg"
            />
          </ReactCrop>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={handleRotate}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              <RotateCw className="w-4 h-4" />
              <span>Rotate</span>
            </button>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCropComplete}
              disabled={!completedCrop}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-orange-600 to-pink-600 hover:from-orange-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-600 text-white rounded-lg transition-all disabled:cursor-not-allowed"
            >
              <Check className="w-4 h-4" />
              <span>Apply Crop</span>
            </button>
          </div>
        </div>

        <div className="mt-4 p-3 bg-gray-700 rounded-lg">
          <p className="text-sm text-gray-300">
            <strong>Tip:</strong> Drag the corners to adjust the crop area. The image will be cropped to a perfect square for your profile picture.
          </p>
        </div>
      </div>
    </div>
  );
} 