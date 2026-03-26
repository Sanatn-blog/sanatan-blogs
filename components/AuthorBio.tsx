import Link from "next/link";
import Image from "next/image";
import {
  UserPlus,
  UserMinus,
  Users,
  Loader2,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
  Facebook,
  Github,
  MessageCircle as Telegram,
  ExternalLink,
} from "lucide-react";

interface Author {
  _id: string;
  name: string;
  bio?: string;
  avatar?: string;
  followers?: number;
  following?: number;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    website?: string;
    instagram?: string;
    youtube?: string;
    facebook?: string;
    github?: string;
    telegram?: string;
    reddit?: string;
    pinterest?: string;
    tiktok?: string;
  };
}

interface AuthorBioProps {
  author: Author;
  currentUser: {
    _id: string;
    name: string;
    role?: string;
    avatar?: string;
  } | null;
  isFollowing: boolean;
  followLoading: boolean;
  onFollow: () => void;
}

export default function AuthorBio({
  author,
  currentUser,
  isFollowing,
  followLoading,
  onFollow,
}: AuthorBioProps) {
  const socialIcons = [
    {
      key: "twitter",
      icon: Twitter,
      color: "hover:text-blue-400",
      bgColor: "hover:bg-blue-50",
    },
    {
      key: "linkedin",
      icon: Linkedin,
      color: "hover:text-blue-600",
      bgColor: "hover:bg-blue-50",
    },
    {
      key: "github",
      icon: Github,
      color: "hover:text-gray-900",
      bgColor: "hover:bg-gray-100",
    },
    {
      key: "instagram",
      icon: Instagram,
      color: "hover:text-pink-600",
      bgColor: "hover:bg-pink-50",
    },
    {
      key: "youtube",
      icon: Youtube,
      color: "hover:text-red-600",
      bgColor: "hover:bg-red-50",
    },
    {
      key: "facebook",
      icon: Facebook,
      color: "hover:text-blue-700",
      bgColor: "hover:bg-blue-50",
    },
    {
      key: "telegram",
      icon: Telegram,
      color: "hover:text-blue-500",
      bgColor: "hover:bg-blue-50",
    },
    {
      key: "website",
      icon: ExternalLink,
      color: "hover:text-orange-600",
      bgColor: "hover:bg-orange-50",
    },
  ];

  return (
    <div className="mt-12 mb-12">
      {/* Card Container */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
        {/* Header with gradient accent */}
        <div className="h-2 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500"></div>

        <div className="p-6 md:p-8">
          {/* Title and Follow Button Row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h3 className="text-xl md:text-2xl font-bold text-gray-900">
              About the Author
            </h3>

            {/* Follow Button - Only show if not viewing own profile */}
            {currentUser && author._id !== currentUser._id && (
              <button
                onClick={onFollow}
                disabled={followLoading}
                className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  isFollowing
                    ? "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-red-600"
                    : "bg-gradient-to-r from-orange-600 to-pink-600 text-white hover:from-orange-700 hover:to-pink-700 shadow-sm hover:shadow"
                } ${followLoading ? "opacity-60 cursor-not-allowed" : ""}`}
              >
                {followLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : isFollowing ? (
                  <>
                    <UserMinus className="h-4 w-4" />
                    <span>Unfollow</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4" />
                    <span>Follow</span>
                  </>
                )}
              </button>
            )}

            {!currentUser && (
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-600 to-pink-600 text-white rounded-lg text-sm font-semibold hover:from-orange-700 hover:to-pink-700 transition-all duration-200 shadow-sm hover:shadow"
              >
                <UserPlus className="h-4 w-4" />
                <span>Follow</span>
              </Link>
            )}
          </div>

          {/* Author Info Section */}
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <Link href={`/authors/${author._id}`} className="block group">
                {author.avatar ? (
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden ring-2 ring-gray-200 group-hover:ring-orange-500 transition-all duration-300">
                    <Image
                      src={author.avatar}
                      alt={author.name}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-orange-500 to-pink-500 rounded-full flex items-center justify-center text-white text-3xl font-bold ring-2 ring-gray-200 group-hover:ring-orange-500 transition-all duration-300">
                    {author.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </Link>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              {/* Author Name */}
              <h4 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                <Link
                  href={`/authors/${author._id}`}
                  className="hover:text-orange-600 transition-colors duration-200"
                >
                  {author.name}
                </Link>
              </h4>

              {/* Bio */}
              {author.bio && (
                <p className="text-gray-600 mb-4 leading-relaxed text-sm md:text-base">
                  {author.bio}
                </p>
              )}

              {/* Stats */}
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <Link
                  href={`/authors/${author._id}`}
                  className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-orange-600 transition-colors duration-200"
                >
                  <Users className="h-4 w-4" />
                  <span className="font-medium">{author.followers || 0}</span>
                  <span>followers</span>
                </Link>
                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                <Link
                  href={`/authors/${author._id}`}
                  className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-orange-600 transition-colors duration-200"
                >
                  <span className="font-medium">{author.following || 0}</span>
                  <span>following</span>
                </Link>
              </div>

              {/* Social Links */}
              {author.socialLinks &&
                Object.values(author.socialLinks).some((link) => link) && (
                  <div className="flex flex-wrap gap-2">
                    {socialIcons.map(({ key, icon: Icon, color, bgColor }) => {
                      const link =
                        author.socialLinks?.[
                          key as keyof typeof author.socialLinks
                        ];
                      if (!link) return null;

                      return (
                        <a
                          key={key}
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`p-2 rounded-lg bg-gray-50 text-gray-600 transition-all duration-200 ${color} ${bgColor}`}
                          title={key.charAt(0).toUpperCase() + key.slice(1)}
                          aria-label={`Visit ${author.name}'s ${key}`}
                        >
                          <Icon className="h-5 w-5" />
                        </a>
                      );
                    })}
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
