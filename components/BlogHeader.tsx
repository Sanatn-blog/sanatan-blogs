import Link from "next/link";
import Image from "next/image";
import { Calendar, User, Clock, Eye, MessageCircle, Tag } from "lucide-react";

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

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center">
            {/* Category Badge */}
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-600 to-pink-600 text-white px-5 py-2.5 rounded-full text-sm font-bold mb-8 shadow-lg">
              <Tag className="h-4 w-4" />
              <span>{category}</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
              {title}
            </h1>

            {/* Excerpt */}
            <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-4xl mx-auto leading-relaxed">
              {excerpt}
            </p>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 text-gray-700 mb-8">
              <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm">
                <User className="h-5 w-5 text-orange-600" />
                <Link
                  href={`/authors/${author._id}`}
                  className="hover:text-orange-600 transition-colors font-semibold"
                >
                  {author.name}
                </Link>
              </div>
              <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm">
                <Calendar className="h-5 w-5 text-blue-600" />
                <span>{formatDate(publishedAt)}</span>
              </div>
              <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm">
                <Clock className="h-5 w-5 text-green-600" />
                <span>{readingTime} min read</span>
              </div>
              <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm">
                <Eye className="h-5 w-5 text-purple-600" />
                <span>{views.toLocaleString()} views</span>
              </div>
            </div>

            {/* Comment CTA */}
            <div className="flex justify-center mb-8">
              <button
                onClick={() => {
                  const commentsSection = document.getElementById("comments");
                  if (commentsSection) {
                    commentsSection.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-orange-600 to-pink-600 text-white rounded-full hover:from-orange-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
              >
                <MessageCircle className="h-5 w-5" />
                <span>Join Discussion ({commentsCount || 0} comments)</span>
              </button>
            </div>

            {/* Tags */}
            {tags && tags.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-white text-gray-700 px-4 py-2 rounded-full text-sm hover:bg-orange-100 hover:text-orange-700 transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer"
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
      {featuredImage && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 mb-16 relative z-10">
          <div className="relative h-[400px] md:h-[500px] lg:h-[600px] rounded-3xl overflow-hidden shadow-2xl ring-8 ring-white">
            <Image
              src={featuredImage}
              alt={title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>

            {/* Reading Time Badge on Image */}
            <div className="absolute bottom-6 left-6 right-6">
              <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl inline-flex items-center space-x-3">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <Clock className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">
                    Estimated reading time
                  </p>
                  <p className="text-lg font-bold text-gray-900">
                    {readingTime} minutes
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
