'use client';

import { useState } from 'react';
import { 
  Facebook, 
  Twitter, 
  Linkedin, 
  Copy,
  Share2,
  MessageCircle as Telegram,
  Send
} from 'lucide-react';
import { useAnalytics } from './GoogleAnalytics';

interface SocialShareProps {
  title: string;
  description: string;
  url: string;
  image?: string;
  blogId?: string;
  hashtags?: string[];
  className?: string;
}

interface SocialPlatform {
  name: string;
  icon: React.ReactNode;
  shareUrl: (params: {
    url: string;
    title: string;
    description: string;
    image?: string;
    hashtags?: string[];
  }) => string;
  color: string;
}

const socialPlatforms: SocialPlatform[] = [
  {
    name: 'Facebook',
    icon: <Facebook className="w-5 h-5" />,
    shareUrl: ({ url, title, description }) => 
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(`${title} - ${description}`)}`,
    color: 'hover:bg-blue-600',
  },
  {
    name: 'Twitter',
    icon: <Twitter className="w-5 h-5" />,
    shareUrl: ({ url, title, hashtags }) => {
      const hashtagText = hashtags?.length ? hashtags.map(tag => `#${tag.replace(/\s+/g, '')}`).join(' ') : '';
      return `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(`${title} ${hashtagText}`)}`;
    },
    color: 'hover:bg-sky-500',
  },
  {
    name: 'LinkedIn',
    icon: <Linkedin className="w-5 h-5" />,
    shareUrl: ({ url, title, description }) => 
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(description)}`,
    color: 'hover:bg-blue-700',
  },
  {
    name: 'Telegram',
    icon: <Telegram className="w-5 h-5" />,
    shareUrl: ({ url, title, description }) => 
      `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(`${title} - ${description}`)}`,
    color: 'hover:bg-blue-500',
  },
  {
    name: 'WhatsApp',
    icon: <Send className="w-5 h-5" />,
    shareUrl: ({ url, title, description }) => 
      `https://wa.me/?text=${encodeURIComponent(`${title} - ${description} ${url}`)}`,
    color: 'hover:bg-green-600',
  },
];

export default function SocialShare({ 
  title, 
  description, 
  url, 
  image, 
  blogId,
  hashtags = ['SanatanDharma', 'Spirituality', 'Wisdom'],
  className = '' 
}: SocialShareProps) {
  const [copied, setCopied] = useState(false);
  const { trackBlogShare } = useAnalytics();

  const handleShare = (platform: string, shareUrl: string) => {
    // Track the share event
    if (blogId) {
      trackBlogShare(blogId, platform);
    }

    // Open share window
    const width = 600;
    const height = 400;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;
    
    window.open(
      shareUrl,
      'share',
      `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
    );
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      
      // Track copy event
      if (blogId) {
        trackBlogShare(blogId, 'copy_link');
      }
      
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url,
        });
        
        if (blogId) {
          trackBlogShare(blogId, 'native_share');
        }
      } catch (err) {
        console.error('Native share failed:', err);
      }
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <Share2 className="w-4 h-4" />
        <span className="font-medium">Share this article:</span>
      </div>
      
      <div className="flex flex-wrap gap-3">
        {/* Social Platform Buttons */}
        {socialPlatforms.map((platform) => {
          const shareUrl = platform.shareUrl({ url, title, description, image, hashtags });
          
          return (
            <button
              key={platform.name}
              onClick={() => handleShare(platform.name, shareUrl)}
              className={`
                flex items-center justify-center w-10 h-10 rounded-full 
                bg-gray-100 text-gray-600 transition-all duration-200
                ${platform.color} hover:text-white hover:scale-105
                focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2
              `}
              title={`Share on ${platform.name}`}
              aria-label={`Share article on ${platform.name}`}
            >
              {platform.icon}
            </button>
          );
        })}
        
        {/* Copy Link Button */}
        <button
          onClick={handleCopyLink}
          className={`
            flex items-center justify-center w-10 h-10 rounded-full 
            transition-all duration-200 focus:outline-none focus:ring-2 
            focus:ring-orange-500 focus:ring-offset-2 hover:scale-105
            ${copied 
              ? 'bg-green-100 text-green-600' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }
          `}
          title={copied ? 'Link copied!' : 'Copy link'}
          aria-label={copied ? 'Link copied to clipboard' : 'Copy article link'}
        >
          <Copy className="w-5 h-5" />
        </button>
        
        {/* Native Share Button (for mobile devices) */}
        {typeof navigator !== 'undefined' && 'share' in navigator && (
          <button
            onClick={handleNativeShare}
            className="
              flex items-center justify-center w-10 h-10 rounded-full 
              bg-orange-100 text-orange-600 transition-all duration-200
              hover:bg-orange-200 hover:scale-105
              focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2
            "
            title="Share using device options"
            aria-label="Share article using device share options"
          >
            <Share2 className="w-5 h-5" />
          </button>
        )}
      </div>
      
      {/* Copy Confirmation */}
      {copied && (
        <div className="flex items-center space-x-2 text-sm text-green-600 animate-fade-in">
          <Copy className="w-4 h-4" />
          <span>Link copied to clipboard!</span>
        </div>
      )}
    </div>
  );
}

// Compact version for smaller spaces
export function CompactSocialShare({ 
  title, 
  description, 
  url, 
  blogId,
  className = '' 
}: Omit<SocialShareProps, 'image' | 'hashtags'>) {
  const [showFullShare, setShowFullShare] = useState(false);

  if (showFullShare) {
    return (
      <div className={className}>
        <SocialShare 
          title={title}
          description={description}
          url={url}
          blogId={blogId}
        />
        <button
          onClick={() => setShowFullShare(false)}
          className="mt-2 text-sm text-gray-500 hover:text-gray-700"
        >
          Show less
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowFullShare(true)}
      className={`
        flex items-center space-x-2 text-gray-600 hover:text-orange-600 
        transition-colors ${className}
      `}
      aria-label="Share this article"
    >
      <Share2 className="w-4 h-4" />
      <span className="text-sm">Share</span>
    </button>
  );
}