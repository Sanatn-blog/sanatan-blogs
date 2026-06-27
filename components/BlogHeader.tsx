"use client";

import Link from "next/link";
import Image from "next/image";
import { Calendar, User, Clock, Eye, MessageCircle, Tag } from "lucide-react";
import { useState, useEffect } from "react";

interface Author {
  _id: string;
  name: string;
  avatar?: string;
}

interface BlogHeaderProps {
  title: string;
  excerpt: string;
  category: string;
  author: Author;
  publishedAt?: string;
  readingTime: number;
  views: number;
  commentsCount?: number;
  tags: string[];
  featuredImage?: string;
}

export default function BlogHeader({
  title,
  excerpt,
  category,
  author,
  publishedAt,
  readingTime,
  views,
  commentsCount,
  tags,
  featuredImage,
}: BlogHeaderProps) {
  const [imageError, setImageError] = useState(false);
  const [imageKey, setImageKey] = useState(0);

  // Force image reload when featuredImage changes
  useEffect(() => {
    setImageError(false);
    setImageKey((prev) => prev + 1);
  }, [featuredImage]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Recently";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <header className="relative">
      {/* Hero Section with Background */}
      <div className="relative bg-gradient-to-br from-orange-50 via-pink-50 to-yellow-50 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-orange-500 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500 rounded-full filter blur-3xl"></div>
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 lg:py-24">
          <div className="text-center">
            {/* Category Badge */}
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-600 to-pink-600 text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold mb-6 sm:mb-8 shadow-lg">
              <Tag className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>{category}</span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-gray-900 mb-6 leading-tight break-words px-2">
              {title}
            </h1>

            {/* Excerpt */}
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 mb-10 max-w-4xl mx-auto leading-relaxed break-words px-2">
              {excerpt}
            </p>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-6 lg:gap-8 text-gray-700 mb-8 px-2">
              <div className="flex items-center space-x-2 bg-white px-3 sm:px-4 py-2 rounded-full shadow-sm text-sm sm:text-base">
                <User className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 flex-shrink-0" />
                <Link
                  href={`/authors/${author._id}`}
                  className="hover:text-orange-600 transition-colors font-semibold truncate max-w-[120px] sm:max-w-none"
                >
                  {author.name}
                </Link>
              </div>
              <div className="flex items-center space-x-2 bg-white px-3 sm:px-4 py-2 rounded-full shadow-sm text-sm sm:text-base">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0" />
                <span className="whitespace-nowrap">
                  {formatDate(publishedAt)}
                </span>
              </div>
              <div className="flex items-center space-x-2 bg-white px-3 sm:px-4 py-2 rounded-full shadow-sm text-sm sm:text-base">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0" />
                <span className="whitespace-nowrap">
                  {readingTime} min read
                </span>
              </div>
              <div className="flex items-center space-x-2 bg-white px-3 sm:px-4 py-2 rounded-full shadow-sm text-sm sm:text-base">
                <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 flex-shrink-0" />
                <span className="whitespace-nowrap">
                  {views.toLocaleString()} views
                </span>
              </div>
            </div>

            {/* Comment CTA */}
            <div className="flex justify-center mb-8 px-2">
              <button
                onClick={() => {
                  const commentsSection = document.getElementById("comments");
                  if (commentsSection) {
                    commentsSection.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="flex items-center space-x-2 sm:space-x-3 px-4 sm:px-6 md:px-8 py-3 sm:py-4 bg-gradient-to-r from-orange-600 to-pink-600 text-white rounded-full hover:from-orange-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold text-sm sm:text-base"
              >
                <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                <span className="whitespace-nowrap">
                  Join Discussion ({commentsCount || 0})
                </span>
              </button>
            </div>

            {/* Tags */}
            {tags && tags.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 px-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-white text-gray-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm hover:bg-orange-100 hover:text-orange-700 transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Featured Image */}
      {featuredImage && !imageError && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 mt-6">
          <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl bg-gray-100">
            {/* Responsive image with proper aspect ratio */}
            <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[500px] xl:h-[600px]">
              <Image
                key={`blog-image-${imageKey}`}
                src={`${featuredImage}?t=${Date.now()}`}
                alt={title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, 1280px"
                priority
                quality={90}
                onError={() => setImageError(true)}
                unoptimized={
                  featuredImage.startsWith("data:") ||
                  !featuredImage.startsWith("http")
                }
              />
            </div>
          </div>

          {/* Reading Time Badge Below Image */}
          <div className="mt-6">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl inline-flex items-center space-x-3">
              <div className="bg-orange-100 p-2 rounded-lg flex-shrink-0">
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-gray-600 font-medium truncate">
                  Estimated reading time
                </p>
                <p className="text-lg font-bold text-gray-900 whitespace-nowrap">
                  {readingTime} minutes
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
