import Link from "next/link";
import Image from "next/image";
import { Clock, TrendingUp, ArrowRight, Eye, Heart } from "lucide-react";

interface RelatedBlog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage?: string;
  category: string;
  readingTime: number;
  author: {
    name: string;
    avatar?: string;
  };
  views?: number;
  likes?: number;
}

interface RelatedArticlesProps {
  articles: RelatedBlog[];
}

export default function RelatedArticles({ articles }: RelatedArticlesProps) {
  if (!articles || articles.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full mb-4">
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm font-semibold">Continue Reading</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Related Articles
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover more insightful content tailored to your interests
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <article
              key={article._id}
              className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-gray-100"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Image Container */}
              <div className="relative h-56 bg-gradient-to-br from-orange-400 to-pink-500 overflow-hidden">
                {article.featuredImage ? (
                  <Image
                    src={article.featuredImage}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-white text-6xl font-bold opacity-20">
                      {article.title.charAt(0)}
                    </div>
                  </div>
                )}

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className="bg-white/95 backdrop-blur-sm text-gray-900 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                    {article.category}
                  </span>
                </div>

                {/* Hover Icon */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="bg-white rounded-full p-4 shadow-2xl transform scale-0 group-hover:scale-100 transition-transform duration-500">
                    <ArrowRight className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Author Info */}
                <div className="flex items-center mb-4">
                  {article.author.avatar ? (
                    <div className="w-10 h-10 rounded-full overflow-hidden mr-3 ring-2 ring-orange-100">
                      <Image
                        src={article.author.avatar}
                        alt={article.author.name}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3 ring-2 ring-orange-100">
                      {article.author.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {article.author.name}
                    </p>
                    <p className="text-xs text-gray-500">Author</p>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-orange-600 transition-colors duration-300">
                  <Link href={`/blogs/${article.slug}`}>{article.title}</Link>
                </h3>

                {/* Excerpt */}
                <p className="text-gray-600 mb-4 line-clamp-3 text-sm leading-relaxed">
                  {article.excerpt}
                </p>

                {/* Meta Info */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-1.5 text-orange-500" />
                      {article.readingTime} min
                    </span>
                    {article.views !== undefined && (
                      <span className="flex items-center">
                        <Eye className="h-4 w-4 mr-1.5 text-blue-500" />
                        {article.views}
                      </span>
                    )}
                  </div>

                  <Link
                    href={`/blogs/${article.slug}`}
                    className="flex items-center text-orange-600 hover:text-orange-700 font-semibold text-sm group/link"
                  >
                    <span>Read</span>
                    <ArrowRight className="h-4 w-4 ml-1 group-hover/link:translate-x-1 transition-transform duration-300" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            href="/blogs"
            className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-orange-600 to-pink-600 text-white rounded-full font-semibold hover:from-orange-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <span>Explore All Articles</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
