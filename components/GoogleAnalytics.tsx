'use client';

import { GoogleAnalytics as GA } from '@next/third-parties/google';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { trackPageView } from '@/lib/analytics';

interface GoogleAnalyticsProps {
  gaId: string;
}

export default function GoogleAnalytics({ gaId }: GoogleAnalyticsProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname) {
      const url = pathname + (searchParams ? `?${searchParams}` : '');
      trackPageView(url);
    }
  }, [pathname, searchParams]);

  if (!gaId || gaId === '') {
    return null;
  }

  return <GA gaId={gaId} />;
}

// Hook for easy access to tracking functions
export function useAnalytics() {
  return {
    trackPageView,
    trackEvent: (action: string, category: string, label?: string, value?: number) => {
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', action, {
          event_category: category,
          event_label: label,
          value: value,
        });
      }
    },
    trackBlogView: (blogId: string, title: string) => {
      window.gtag?.('event', 'view_blog', {
        event_category: 'engagement',
        event_label: `${blogId}: ${title}`,
        custom_parameter_1: blogId,
        custom_parameter_2: title,
      });
    },
    trackBlogShare: (blogId: string, platform: string) => {
      window.gtag?.('event', 'share', {
        method: platform,
        content_type: 'blog',
        item_id: blogId,
      });
    },
    trackSearch: (searchTerm: string) => {
      window.gtag?.('event', 'search', {
        search_term: searchTerm,
      });
    },
    trackContactForm: () => {
      window.gtag?.('event', 'generate_lead', {
        event_category: 'engagement',
        event_label: 'contact_form',
      });
    },
  };
}