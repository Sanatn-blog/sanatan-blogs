"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Calendar,
  User,
  Clock,
  Eye,
  Heart,
  Share2,
  BookmarkPlus,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
  Copy,
  Loader2,
  Github,
  MessageCircle as Telegram,
  ExternalLink,
  UserPlus,
  UserMinus,
  Users,
  Send,
  Edit,
  Trash2,
  Reply,
  CheckCircle,
  BookOpen,
  AlertCircle,
} from "lucide-react";
import Image from "next/image";
import RelatedArticles from "@/components/RelatedArticles";
import BlogHeader from "@/components/BlogHeader";
import AuthorBio from "@/components/AuthorBio";

// TypeScript interfaces
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

interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  author: Author;
  category: string;
  tags: string[];
  publishedAt?: string;
  updatedAt: string;
  readingTime: number;
  views: number;
  likes: string[];
  comments: string[];
  commentsCount?: number;
  featured?: boolean;
  status: "draft" | "published" | "archived";
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string[];
  };
}

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
}

interface Comment {
  _id: string;
  content: string;
  author: {
    _id: string;
    name: string;
    avatar?: string;
  };
  createdAt: string;
  updatedAt: string;
  replies?: Comment[];
  likes: string[];
}

interface CommentResponse {
  comments: Comment[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

interface BlogResponse {
  blog: Blog;
  relatedBlogs: RelatedBlog[];
  navigation?: {
    next?: { title: string; slug: string };
    previous?: { title: string; slug: string };
  };
}

// Function to convert markdown to formatted HTML
const formatContent = (content: string): string => {
  if (!content) return "";

  let formattedContent = content;

  // Handle code blocks first (before other formatting)
  formattedContent = formattedContent.replace(
    /```([\s\S]*?)```/g,
    '<pre class="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-4"><code class="text-sm text-gray-800">$1</code></pre>',
  );

  // Handle inline code
  formattedContent = formattedContent.replace(
    /`([^`]+)`/g,
    '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono text-gray-800">$1</code>',
  );

  // Handle horizontal rules
  formattedContent = formattedContent.replace(
    /^---$/gm,
    '<hr class="border-gray-300 my-6">',
  );

  // Handle tables
  formattedContent = formattedContent.replace(
    /^\|(.+)\|$/gm,
    (match, content) => {
      const cells = content.split("|").map((cell: string) => cell.trim());
      const headerCells = cells
        .map(
          (cell: string) =>
            `<th class="border border-gray-300 px-4 py-2 text-left font-semibold">${cell}</th>`,
        )
        .join("");
      return `<table class="border-collapse border border-gray-300 mb-4 w-full"><thead><tr>${headerCells}</tr></thead><tbody>`;
    },
  );

  // Handle table rows (non-header)
  formattedContent = formattedContent.replace(
    /^\|(.+)\|$/gm,
    (match, content) => {
      if (content.includes("---")) return ""; // Skip separator rows
      const cells = content.split("|").map((cell: string) => cell.trim());
      const rowCells = cells
        .map(
          (cell: string) =>
            `<td class="border border-gray-300 px-4 py-2">${cell}</td>`,
        )
        .join("");
      return `<tr>${rowCells}</tr>`;
    },
  );

  // Close table tags
  formattedContent = formattedContent.replace(
    /<\/tr>\n<\/tbody><\/table>/g,
    "</tr></tbody></table>",
  );

  // Handle headings
  formattedContent = formattedContent.replace(
    /^### (.+)$/gm,
    '<h3 class="text-xl font-semibold text-gray-800 mb-4 mt-6">$1</h3>',
  );

  formattedContent = formattedContent.replace(
    /^## (.+)$/gm,
    '<h2 class="text-2xl font-bold text-gray-900 mb-4 mt-6">$1</h2>',
  );

  formattedContent = formattedContent.replace(
    /^# (.+)$/gm,
    '<h1 class="text-3xl font-bold text-gray-900 mb-4 mt-6">$1</h1>',
  );

  // Handle blockquotes
  formattedContent = formattedContent.replace(
    /^> (.+)$/gm,
    '<blockquote class="bg-orange-50 border-l-4 border-orange-500 italic text-gray-700 p-4 mb-4">$1</blockquote>',
  );

  // Handle numbered lists
  formattedContent = formattedContent.replace(
    /^(\d+)\. (.+)$/gm,
    '<li class="mb-2 text-gray-700">$2</li>',
  );

  // Handle bullet lists
  formattedContent = formattedContent.replace(
    /^[-*] (.+)$/gm,
    '<li class="mb-2 text-gray-700">$1</li>',
  );

  // Wrap consecutive list items in ul/ol tags
  formattedContent = formattedContent.replace(
    /(<li[^>]*>.*?<\/li>)+/g,
    (match) => `<ul class="list-disc list-inside mb-4 space-y-2">${match}</ul>`,
  );

  // Handle bold text
  formattedContent = formattedContent.replace(
    /\*\*(.+?)\*\*/g,
    '<strong class="font-bold">$1</strong>',
  );

  // Handle italic text
  formattedContent = formattedContent.replace(
    /\*(.+?)\*/g,
    '<em class="italic">$1</em>',
  );

  // Handle strikethrough
  formattedContent = formattedContent.replace(
    /~~(.+?)~~/g,
    '<del class="line-through">$1</del>',
  );

  // Handle links
  formattedContent = formattedContent.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" class="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">$1</a>',
  );

  // Handle images
  formattedContent = formattedContent.replace(
    /!\[([^\]]*)\]\(([^)]+)\)/g,
    '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg mb-4" />',
  );

  // Split into paragraphs and handle remaining text
  const paragraphs = formattedContent.split("\n\n");
  const processedParagraphs = paragraphs.map((paragraph) => {
    const trimmed = paragraph.trim();
    if (!trimmed) return "";

    // Skip if it's already HTML
    if (trimmed.startsWith("<")) return trimmed;

    // Handle single line breaks within paragraphs
    const withLineBreaks = trimmed.replace(/\n/g, "<br>");
    return `<p class="mb-4 text-gray-700 leading-relaxed">${withLineBreaks}</p>`;
  });

  return processedParagraphs.filter((p) => p).join("\n");
};

export default function BlogDetailPage() {
  const params = useParams();
  const blogId = params.id as string;

  const [blog, setBlog] = useState<Blog | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<RelatedBlog[]>([]);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [likes, setLikes] = useState(0);
  const [bookmarks, setBookmarks] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<{
    _id: string;
    name: string;
    role?: string;
    avatar?: string;
  } | null>(null);

  // Comment states
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentContent, setCommentContent] = useState("");
  const [replyContent, setReplyContent] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentError, setCommentError] = useState<string | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Check if user is logged in and get current user
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.user) {
            setCurrentUser({
              _id: data.user._id,
              name: data.user.name,
              role: data.user.role,
              avatar: data.user.avatar,
            });
          }
        })
        .catch((err) => console.error("Error fetching current user:", err));
    }
  }, []);

  // Check like status when current user or blog changes
  useEffect(() => {
    if (blog && currentUser) {
      const isUserLiked = blog.likes?.includes(currentUser._id) || false;
      setIsLiked(isUserLiked);
    } else if (blog && !currentUser) {
      setIsLiked(false);
    }
  }, [blog, currentUser]);

  const checkFollowStatus = useCallback(async () => {
    if (!currentUser || !blog) return;

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      const response = await fetch(
        `/api/users/follow?userId=${blog.author._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        setIsFollowing(data.isFollowing);
      }
    } catch (error) {
      console.error("Error checking follow status:", error);
    }
  }, [currentUser, blog]);

  // Check follow status when blog and current user are loaded
  useEffect(() => {
    if (blog && currentUser && blog.author._id !== currentUser._id) {
      checkFollowStatus();
    }
  }, [blog, currentUser, checkFollowStatus]);

  const handleFollow = async () => {
    if (!currentUser || !blog) {
      window.location.href = "/login";
      return;
    }

    if (blog.author._id === currentUser._id) return;

    setFollowLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        window.location.href = "/login";
        return;
      }

      const response = await fetch("/api/users/follow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ targetUserId: blog.author._id }),
      });

      if (response.ok) {
        const data = await response.json();
        setIsFollowing(data.isFollowing);
        // Update blog author's follower count if available
        if (blog && data.followersCount !== undefined) {
          setBlog((prev) =>
            prev
              ? {
                  ...prev,
                  author: {
                    ...prev.author,
                    followers: data.followersCount,
                  },
                }
              : null,
          );
        }
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Failed to follow/unfollow user");
      }
    } catch (error) {
      console.error("Error following/unfollowing:", error);
      alert("Failed to follow/unfollow user");
    } finally {
      setFollowLoading(false);
    }
  };

  // Comment functions
  const fetchComments = useCallback(async () => {
    if (!blog) return;

    setCommentsLoading(true);
    try {
      console.log("Fetching comments for blog:", blogId);
      const response = await fetch(`/api/blogs/${blogId}/comments`);
      console.log("Comments response status:", response.status);

      if (response.ok) {
        const data: CommentResponse = await response.json();
        console.log("Comments fetched successfully:", data.comments.length);
        setComments(data.comments);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error("Failed to fetch comments:", errorData);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setCommentsLoading(false);
    }
  }, [blog, blogId]);

  // Function to refetch blog data to get updated comment count
  const refetchBlogData = useCallback(async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const headers: Record<string, string> = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`/api/blogs/${blogId}`, { headers });

      if (response.ok) {
        const data: BlogResponse = await response.json();
        if (data.blog) {
          setBlog(data.blog);
        }
      }
    } catch (error) {
      console.error("Error refetching blog data:", error);
    }
  }, [blogId]);

  const handleSubmitComment = async () => {
    if (!currentUser || !blog) {
      window.location.href = "/login";
      return;
    }

    if (!commentContent.trim()) {
      setCommentError("Comment cannot be empty");
      return;
    }

    setCommentLoading(true);
    setCommentError(null);

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        window.location.href = "/login";
        return;
      }

      console.log("Submitting comment:", { content: commentContent, blogId });

      const response = await fetch(`/api/blogs/${blogId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: commentContent }),
      });

      console.log("Comment submission response status:", response.status);

      if (response.ok) {
        const newComment = await response.json();
        console.log("Comment submitted successfully:", newComment);
        // Refetch comments to ensure consistency with server state
        await fetchComments();
        // Refetch blog data to get updated comment count
        await refetchBlogData();
        setCommentContent("");
        setCommentError(null);
        // Show success message
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 3000);
      } else {
        const errorData = await response.json();
        console.error("Comment submission failed:", errorData);

        // Handle specific error cases
        if (response.status === 401) {
          setCommentError("Please log in to post a comment");
          setTimeout(() => {
            window.location.href = "/login";
          }, 2000);
        } else if (response.status === 403) {
          setCommentError("Your account is not approved to post comments");
        } else if (response.status === 404) {
          setCommentError("Blog not found");
        } else {
          setCommentError(
            errorData.error || "Failed to post comment. Please try again.",
          );
        }
      }
    } catch (error) {
      console.error("Error posting comment:", error);
      setCommentError("Failed to post comment. Please try again.");
    } finally {
      setCommentLoading(false);
    }
  };

  const handleReply = async (parentCommentId: string) => {
    if (!currentUser || !blog) {
      window.location.href = "/login";
      return;
    }

    if (!replyContent.trim()) {
      setCommentError("Reply cannot be empty");
      return;
    }

    setCommentLoading(true);
    setCommentError(null);

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        window.location.href = "/login";
        return;
      }

      const response = await fetch(`/api/blogs/${blogId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: replyContent,
          parentCommentId,
        }),
      });

      if (response.ok) {
        await response.json();
        // Refetch comments to ensure consistency with server state
        await fetchComments();
        // Refetch blog data to get updated comment count
        await refetchBlogData();
        setReplyContent("");
        setReplyingTo(null);
        setCommentError(null);
      } else {
        const errorData = await response.json();
        setCommentError(errorData.error || "Failed to post reply");
      }
    } catch (error) {
      console.error("Error posting reply:", error);
      setCommentError("Failed to post reply");
    } finally {
      setCommentLoading(false);
    }
  };

  const handleEditComment = async (commentId: string) => {
    if (!editContent.trim()) {
      setCommentError("Comment cannot be empty");
      return;
    }

    setCommentLoading(true);
    setCommentError(null);

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        window.location.href = "/login";
        return;
      }

      const response = await fetch(
        `/api/blogs/${blogId}/comments/${commentId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content: editContent }),
        },
      );

      if (response.ok) {
        await response.json();
        // Refetch comments to ensure consistency with server state
        await fetchComments();
        // Refetch blog data to get updated comment count
        await refetchBlogData();
        setEditingComment(null);
        setEditContent("");
        setCommentError(null);
      } else {
        const errorData = await response.json();
        setCommentError(errorData.error || "Failed to update comment");
      }
    } catch (error) {
      console.error("Error updating comment:", error);
      setCommentError("Failed to update comment");
    } finally {
      setCommentLoading(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    setCommentLoading(true);

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        window.location.href = "/login";
        return;
      }

      const response = await fetch(
        `/api/blogs/${blogId}/comments/${commentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.ok) {
        // Refetch comments to ensure consistency with server state
        await fetchComments();
        // Refetch blog data to get updated comment count
        await refetchBlogData();
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Failed to delete comment");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      alert("Failed to delete comment");
    } finally {
      setCommentLoading(false);
    }
  };

  const canEditComment = (comment: Comment) => {
    return currentUser && comment.author._id === currentUser._id;
  };

  const canDeleteComment = (comment: Comment) => {
    return (
      currentUser &&
      (comment.author._id === currentUser._id ||
        currentUser.role === "admin" ||
        currentUser.role === "super_admin")
    );
  };

  // Fetch blog data
  useEffect(() => {
    const fetchBlog = async () => {
      if (!blogId) return;

      try {
        setLoading(true);
        setError(null);

        console.log("Fetching blog with ID:", blogId);
        const response = await fetch(`/api/blogs/${blogId}`);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Blog not found");
          }
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.error ||
              `HTTP ${response.status}: ${response.statusText}`,
          );
        }

        const data: BlogResponse = await response.json();

        if (!data.blog) {
          throw new Error("Invalid blog data received");
        }

        console.log("Blog data received:", data.blog);
        setBlog(data.blog);
        setRelatedBlogs(data.relatedBlogs || []);
        setLikes(data.blog.likes?.length || 0);
        setBookmarks(0); // Bookmarks not implemented in backend yet

        // Check if current user has liked this blog
        if (currentUser) {
          const isUserLiked =
            data.blog.likes?.includes(currentUser._id) || false;
          setIsLiked(isUserLiked);

          // Check if current user has bookmarked this blog
          const token = localStorage.getItem("accessToken");
          if (token) {
            try {
              const bookmarkResponse = await fetch(
                `/api/blogs/${blogId}/bookmark`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                },
              );

              if (bookmarkResponse.ok) {
                const bookmarkData = await bookmarkResponse.json();
                setIsBookmarked(bookmarkData.bookmarked);
                setBookmarks(bookmarkData.bookmarksCount);
              }
            } catch (error) {
              console.error("Error fetching bookmark status:", error);
            }
          }
        }
      } catch (err) {
        console.error("Error fetching blog:", err);
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load blog";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [blogId, currentUser]);

  // Fetch comments when blog is loaded
  useEffect(() => {
    if (blog) {
      fetchComments();
    }
  }, [blog, fetchComments]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Recently";
    const date = new Date(dateString);
    return date.toLocaleDateString("hi-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleLike = async () => {
    if (!blog) return;

    // If user is not logged in, redirect to login
    if (!currentUser) {
      window.location.href = "/login";
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        window.location.href = "/login";
        return;
      }

      const response = await fetch(`/api/blogs/${blog._id}/like`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setIsLiked(data.liked);
        setLikes(data.likesCount);
      } else {
        const errorData = await response.json();
        if (response.status === 401) {
          window.location.href = "/login";
        } else {
          alert(errorData.error || "Failed to like/unlike blog");
        }
      }
    } catch (error) {
      console.error("Error liking/unliking blog:", error);
      alert("Failed to like/unlike blog");
    }
  };

  const handleBookmark = async () => {
    if (!blog) return;

    // If user is not logged in, redirect to login
    if (!currentUser) {
      window.location.href = "/login";
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        window.location.href = "/login";
        return;
      }

      const response = await fetch(`/api/blogs/${blog._id}/bookmark`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setIsBookmarked(data.bookmarked);
        setBookmarks(data.bookmarksCount);
      } else {
        const errorData = await response.json();
        if (response.status === 401) {
          window.location.href = "/login";
        } else {
          alert(errorData.error || "Failed to bookmark/unbookmark blog");
        }
      }
    } catch (error) {
      console.error("Error bookmarking/unbookmarking blog:", error);
      alert("Failed to bookmark/unbookmark blog");
    }
  };

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  const shareOptions = [
    {
      name: "Facebook",
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      color: "text-blue-600",
    },
    {
      name: "Twitter",
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(blog?.title || "")}`,
      color: "text-blue-400",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      color: "text-blue-700",
    },
  ];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    alert("Link copied!");
    setShowShareMenu(false);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        {/* Navigation Breadcrumb Skeleton */}
        <nav className="bg-gray-50 py-4">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-2">
              <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
              <div className="h-4 w-32 bg-gray-300 rounded animate-pulse"></div>
            </div>
          </div>
        </nav>

        {/* Article Header Skeleton */}
        <header className="py-12 bg-gradient-to-r from-orange-50 to-yellow-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              {/* Category Badge Skeleton */}
              <div className="inline-block h-8 w-24 bg-orange-200 rounded-full animate-pulse mb-6"></div>

              {/* Title Skeleton */}
              <div className="space-y-3 mb-6">
                <div className="h-12 bg-gray-200 rounded-lg animate-pulse mx-auto max-w-2xl"></div>
                <div className="h-12 bg-gray-200 rounded-lg animate-pulse mx-auto max-w-xl"></div>
              </div>

              {/* Excerpt Skeleton */}
              <div className="space-y-2 mb-8 max-w-3xl mx-auto">
                <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              </div>

              {/* Meta Information Skeleton */}
              <div className="flex flex-wrap items-center justify-center gap-6 mb-8">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center">
                    <div className="h-5 w-5 bg-gray-300 rounded mr-2 animate-pulse"></div>
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>

              {/* Tags Skeleton */}
              <div className="flex flex-wrap justify-center gap-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-6 w-16 bg-gray-200 rounded-full animate-pulse"
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </header>

        {/* Featured Image Skeleton */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 mb-12">
          <div className="relative h-96 bg-gradient-to-r from-gray-300 to-gray-400 rounded-2xl overflow-hidden shadow-2xl animate-pulse">
            <div className="absolute bottom-6 left-6 right-6">
              <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-lg p-4">
                <div className="h-5 w-48 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Article Content Skeleton */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Skeleton */}
            <div className="lg:col-span-1 order-2 lg:order-1">
              <div className="sticky top-24 space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-12 bg-gray-200 rounded-xl animate-pulse"
                  ></div>
                ))}
              </div>
            </div>

            {/* Main Content Skeleton */}
            <div className="lg:col-span-3 order-1 lg:order-2">
              <div className="space-y-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="space-y-3">
                    <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-6 bg-gray-200 rounded w-5/6 animate-pulse"></div>
                  </div>
                ))}
              </div>

              {/* Author Bio Skeleton */}
              <div className="mt-12 p-6 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl border border-orange-100">
                <div className="h-6 w-32 bg-gray-200 rounded mb-4 animate-pulse"></div>
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-gray-300 rounded-full animate-pulse"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <BookOpen className="h-16 w-16 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-100 mb-4">
            Article Not Found
          </h2>
          <p className="text-gray-100 mb-8">{error}</p>
          <Link
            href="/blogs"
            className="inline-flex items-center space-x-2 text-orange-600 hover:text-orange-700 font-medium"
          >
            <ChevronLeft className="h-5 w-5" />
            <span>Back to All Articles</span>
          </Link>
        </div>
      </div>
    );
  }

  // No blog data
  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <BookOpen className="h-16 w-16 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Article Not Found
          </h2>
          <p className="text-gray-600 mb-8">
            The requested article could not be found.
          </p>
          <Link
            href="/blogs"
            className="inline-flex items-center space-x-2 text-orange-600 hover:text-orange-700 font-medium"
          >
            <ChevronLeft className="h-5 w-5" />
            <span>Back to All Articles</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Breadcrumb */}
      <nav className="bg-gray-50 py-4">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-orange-600 hover:text-orange-700">
              Home
            </Link>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <Link
              href="/blogs"
              className="text-orange-600 hover:text-orange-700"
            >
              Blogs
            </Link>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <span className="text-gray-500 truncate">{blog.title}</span>
          </div>
        </div>
      </nav>

      {/* Blog Header */}
      <BlogHeader
        title={blog.title}
        excerpt={blog.excerpt}
        category={blog.category}
        author={blog.author}
        publishedAt={blog.publishedAt}
        readingTime={blog.readingTime}
        views={blog.views}
        commentsCount={blog.commentsCount}
        tags={blog.tags}
        featuredImage={blog.featuredImage}
      />

      {/* Article Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="grid grid-cols-1 gap-8">
          {/* Main Content */}
          <div className="order-1 overflow-hidden">
            <article className="prose prose-xl max-w-none blog-content">
              <div className="overflow-hidden">
                <div
                  dangerouslySetInnerHTML={{
                    __html: formatContent(blog.content),
                  }}
                  className="text-gray-800 leading-relaxed break-words overflow-hidden"
                />
              </div>
            </article>

            {/* Social Actions */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-4 p-6 bg-gray-50 rounded-2xl">
              {/* Like Button */}
              <button
                onClick={handleLike}
                className={`flex items-center space-x-2 py-4 px-8 rounded-full transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 ${
                  isLiked
                    ? "bg-gradient-to-r from-red-500 to-pink-500 text-white"
                    : "bg-white text-gray-700 hover:bg-red-50 hover:text-red-600"
                }`}
                title={
                  currentUser
                    ? isLiked
                      ? "Unlike this post"
                      : "Like this post"
                    : "Login to like this post"
                }
              >
                <Heart className={`h-6 w-6 ${isLiked ? "fill-current" : ""}`} />
                <span className="font-bold">{likes}</span>
                {!currentUser && (
                  <span className="text-xs text-gray-500 ml-1">(Login)</span>
                )}
              </button>

              {/* Bookmark Button */}
              <button
                onClick={handleBookmark}
                className={`flex items-center space-x-2 py-4 px-8 rounded-full transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 ${
                  isBookmarked
                    ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white"
                    : "bg-white text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                }`}
                title={
                  currentUser
                    ? isBookmarked
                      ? "Remove bookmark"
                      : "Bookmark this post"
                    : "Login to bookmark this post"
                }
              >
                <BookmarkPlus
                  className={`h-5 w-5 ${isBookmarked ? "fill-current" : ""}`}
                />
                <span className="font-medium">{bookmarks}</span>
                {!currentUser && (
                  <span className="text-xs text-gray-500 ml-1">(Login)</span>
                )}
              </button>

              {/* Share Button */}
              <div className="relative">
                <button
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="flex items-center space-x-2 py-3 px-6 rounded-xl bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                >
                  <Share2 className="h-5 w-5" />
                  <span className="font-medium">Share</span>
                </button>

                {/* Share Menu */}
                {showShareMenu && (
                  <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-10 min-w-[200px]">
                    {shareOptions.map((option) => (
                      <a
                        key={option.name}
                        href={option.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center space-x-3 px-4 py-2 hover:bg-gray-50 transition-colors ${option.color}`}
                      >
                        <option.icon className="h-4 w-4" />
                        <span className="text-sm font-medium text-gray-700">
                          {option.name}
                        </span>
                      </a>
                    ))}
                    <button
                      onClick={copyToClipboard}
                      className="w-full flex items-center space-x-3 px-4 py-2 hover:bg-gray-50 transition-colors text-gray-600"
                    >
                      <Copy className="h-4 w-4" />
                      <span className="text-sm font-medium text-gray-700">
                        Copy Link
                      </span>
                    </button>
                  </div>
                )}
              </div>

              {/* Comments Link */}
              <Link
                href="#comments"
                className="flex items-center space-x-2 py-3 px-6 rounded-xl bg-gray-100 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  const commentsSection = document.getElementById("comments");
                  if (commentsSection) {
                    commentsSection.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
                <MessageCircle className="h-5 w-5" />
                <span className="font-medium">
                  {blog?.commentsCount || 0} Comments
                </span>
              </Link>
            </div>

            {/* Author Bio */}
            <AuthorBio
              author={blog.author}
              currentUser={currentUser}
              isFollowing={isFollowing}
              followLoading={followLoading}
              onFollow={handleFollow}
            />
          </div>
        </div>
      </main>

      {/* Comments Section */}
      <section id="comments" className="py-8 sm:py-12 lg:py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">
            Comments ({blog?.commentsCount || 0})
          </h2>

          {/* Comment Form */}
          <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-8">
            {currentUser ? (
              <div>
                <div className="flex items-start space-x-3 sm:space-x-4 mb-4">
                  {currentUser.avatar ? (
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden flex-shrink-0">
                      <Image
                        src={currentUser.avatar}
                        alt={currentUser.name}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                      {currentUser.name.charAt(0)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <textarea
                      value={commentContent}
                      onChange={(e) => setCommentContent(e.target.value)}
                      placeholder="Share your thoughts on this article..."
                      className="w-full p-3 sm:p-4 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 placeholder-gray-500 text-sm sm:text-base"
                      rows={3}
                      maxLength={1000}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && e.ctrlKey) {
                          e.preventDefault();
                          handleSubmitComment();
                        }
                      }}
                    />
                    {commentError && (
                      <p className="text-red-500 text-sm mt-2 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        {commentError}
                      </p>
                    )}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-3 space-y-3 sm:space-y-0">
                      <span className="text-xs sm:text-sm text-gray-500">
                        {commentContent.length}/1000 characters
                      </span>
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <button
                          onClick={() => setCommentContent("")}
                          disabled={!commentContent.trim() || commentLoading}
                          className="px-3 py-2 sm:px-4 sm:py-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                        >
                          Clear
                        </button>
                        <button
                          onClick={handleSubmitComment}
                          disabled={commentLoading || !commentContent.trim()}
                          className="flex items-center space-x-1 sm:space-x-2 px-4 py-2 sm:px-6 sm:py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm min-h-[40px]"
                        >
                          {commentLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Send className="h-4 w-4" />
                          )}
                          <span>
                            {commentLoading ? "Posting..." : "Post Comment"}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Join the Discussion
                </h3>
                <p className="text-gray-600 mb-4">
                  Please log in to leave a comment and engage with other
                  readers.
                </p>
                <Link
                  href="/login"
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  <span>Login to Comment</span>
                </Link>
              </div>
            )}
          </div>

          {/* Comments List */}
          <div className="space-y-6">
            {commentsLoading ? (
              <div className="text-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-orange-600 mx-auto mb-4" />
                <p className="text-gray-600">Loading comments...</p>
              </div>
            ) : comments.length > 0 ? (
              comments.map((comment) => (
                <div
                  key={comment._id}
                  className="bg-white rounded-2xl shadow-lg p-4 sm:p-6"
                >
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    {comment.author.avatar ? (
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden flex-shrink-0">
                        <Image
                          src={comment.author.avatar}
                          alt={comment.author.name}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                        {comment.author.name.charAt(0)}
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 space-y-1 sm:space-y-0">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 text-sm sm:text-base">
                            {comment.author.name}
                          </h4>
                          <p className="text-xs sm:text-sm text-gray-500">
                            {formatDate(comment.createdAt)}
                          </p>
                        </div>

                        {(canEditComment(comment) ||
                          canDeleteComment(comment)) && (
                          <div className="flex items-center space-x-1 sm:space-x-2 self-start sm:self-center">
                            {canEditComment(comment) && (
                              <button
                                onClick={() => {
                                  setEditingComment(comment._id);
                                  setEditContent(comment.content);
                                }}
                                className="text-gray-500 hover:text-orange-600 transition-colors p-2 sm:p-1 -mr-1 sm:mr-0"
                                title="Edit comment"
                              >
                                <Edit className="h-4 w-4 sm:h-4 sm:w-4" />
                              </button>
                            )}
                            {canDeleteComment(comment) && (
                              <button
                                onClick={() => handleDeleteComment(comment._id)}
                                className="text-gray-500 hover:text-red-600 transition-colors p-2 sm:p-1 -mr-1 sm:mr-0"
                                title="Delete comment"
                              >
                                <Trash2 className="h-4 w-4 sm:h-4 sm:w-4" />
                              </button>
                            )}
                          </div>
                        )}
                      </div>

                      {editingComment === comment._id ? (
                        <div className="space-y-3">
                          <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 placeholder-gray-500 text-sm sm:text-base"
                            rows={3}
                            maxLength={1000}
                          />
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                            <span className="text-xs sm:text-sm text-gray-500">
                              {editContent.length}/1000 characters
                            </span>
                            <div className="flex space-x-2 sm:space-x-3">
                              <button
                                onClick={() => {
                                  setEditingComment(null);
                                  setEditContent("");
                                }}
                                className="px-3 py-2 sm:px-4 sm:py-2 text-gray-600 hover:text-gray-800 transition-colors text-sm min-h-[40px]"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleEditComment(comment._id)}
                                disabled={commentLoading || !editContent.trim()}
                                className="px-4 py-2 sm:px-4 sm:py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 transition-colors text-sm min-h-[40px]"
                              >
                                {commentLoading ? "Saving..." : "Save"}
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <p className="text-gray-700 mb-3 text-sm sm:text-base">
                            {comment.content}
                          </p>

                          <div className="flex items-center space-x-4">
                            {currentUser && (
                              <button
                                onClick={() => setReplyingTo(comment._id)}
                                className="flex items-center space-x-1 text-gray-500 hover:text-orange-600 transition-colors p-1 -ml-1 min-h-[32px]"
                              >
                                <Reply className="h-4 w-4" />
                                <span className="text-sm">Reply</span>
                              </button>
                            )}
                          </div>

                          {/* Reply Form */}
                          {replyingTo === comment._id && (
                            <div className="mt-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
                              <div className="flex items-start space-x-3">
                                <div className="flex-1 min-w-0">
                                  <textarea
                                    value={replyContent}
                                    onChange={(e) =>
                                      setReplyContent(e.target.value)
                                    }
                                    placeholder="Write a reply..."
                                    className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 placeholder-gray-500 text-sm sm:text-base"
                                    rows={2}
                                    maxLength={1000}
                                  />
                                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-2 space-y-2 sm:space-y-0">
                                    <span className="text-xs sm:text-sm text-gray-500">
                                      {replyContent.length}/1000 characters
                                    </span>
                                    <div className="flex space-x-2">
                                      <button
                                        onClick={() => {
                                          setReplyingTo(null);
                                          setReplyContent("");
                                        }}
                                        className="px-3 py-2 sm:px-3 sm:py-1 text-gray-600 hover:text-gray-800 transition-colors text-sm min-h-[36px]"
                                      >
                                        Cancel
                                      </button>
                                      <button
                                        onClick={() => handleReply(comment._id)}
                                        disabled={
                                          commentLoading || !replyContent.trim()
                                        }
                                        className="px-4 py-2 sm:px-3 sm:py-1 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 transition-colors text-sm min-h-[36px]"
                                      >
                                        {commentLoading
                                          ? "Posting..."
                                          : "Reply"}
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Replies */}
                          {comment.replies && comment.replies.length > 0 && (
                            <div className="mt-4 space-y-3">
                              {comment.replies.map((reply) => (
                                <div
                                  key={reply._id}
                                  className="ml-4 sm:ml-8 p-3 sm:p-4 bg-gray-50 rounded-lg"
                                >
                                  <div className="flex items-start space-x-2 sm:space-x-3">
                                    {reply.author.avatar ? (
                                      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden flex-shrink-0">
                                        <Image
                                          src={reply.author.avatar}
                                          alt={reply.author.name}
                                          width={36}
                                          height={36}
                                          className="w-full h-full object-cover"
                                        />
                                      </div>
                                    ) : (
                                      <div className="w-8 h-8 sm:w-9 sm:h-9 bg-orange-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                        {reply.author.name.charAt(0)}
                                      </div>
                                    )}

                                    <div className="flex-1 min-w-0">
                                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1 space-y-1 sm:space-y-0">
                                        <div className="flex-1 min-w-0">
                                          <h5 className="font-semibold text-gray-900 text-sm">
                                            {reply.author.name}
                                          </h5>
                                          <p className="text-xs text-gray-500">
                                            {formatDate(reply.createdAt)}
                                          </p>
                                        </div>

                                        {(canEditComment(reply) ||
                                          canDeleteComment(reply)) && (
                                          <div className="flex items-center space-x-1 self-start sm:self-center">
                                            {canEditComment(reply) && (
                                              <button
                                                onClick={() => {
                                                  setEditingComment(reply._id);
                                                  setEditContent(reply.content);
                                                }}
                                                className="text-gray-400 hover:text-orange-600 transition-colors p-2 sm:p-1 -mr-1 sm:mr-0"
                                                title="Edit reply"
                                              >
                                                <Edit className="h-4 w-4 sm:h-3 sm:w-3" />
                                              </button>
                                            )}
                                            {canDeleteComment(reply) && (
                                              <button
                                                onClick={() =>
                                                  handleDeleteComment(reply._id)
                                                }
                                                className="text-gray-400 hover:text-red-600 transition-colors p-2 sm:p-1 -mr-1 sm:mr-0"
                                                title="Delete reply"
                                              >
                                                <Trash2 className="h-4 w-4 sm:h-3 sm:w-3" />
                                              </button>
                                            )}
                                          </div>
                                        )}
                                      </div>
                                      <p className="text-gray-700 text-sm">
                                        {reply.content}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Comments Yet
                </h3>
                <p className="text-gray-600">
                  Be the first to share your thoughts!
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Related Articles */}
      <RelatedArticles articles={relatedBlogs} />

      {/* Back to Blogs */}
      <div className="py-12 text-center bg-white">
        <Link
          href="/blogs"
          className="inline-flex items-center space-x-2 px-8 py-4 bg-white text-orange-600 border-2 border-orange-600 rounded-full font-semibold hover:bg-orange-600 hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <ChevronLeft className="h-5 w-5" />
          <span>View All Articles</span>
        </Link>
      </div>

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5" />
            <span>Comment posted successfully!</span>
          </div>
        </div>
      )}

      {/* Floating Comment Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <button
          onClick={() => {
            const commentsSection = document.getElementById("comments");
            if (commentsSection) {
              commentsSection.scrollIntoView({ behavior: "smooth" });
            }
          }}
          className="flex items-center space-x-2 px-4 py-3 bg-orange-600 text-white rounded-full shadow-lg hover:bg-orange-700 transition-all duration-300 hover:scale-105"
          title="Join the discussion"
        >
          <MessageCircle className="h-5 w-5" />
          <span className="font-medium">{blog?.commentsCount || 0}</span>
        </button>
      </div>
    </div>
  );
}
