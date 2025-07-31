// Google Analytics configuration for Next.js
'use client';

type GtagCommand = 'config' | 'event' | 'set' | 'consent';

declare global {
  interface Window {
    gtag: (command: GtagCommand, targetId: string, config?: Record<string, unknown>) => void;
  }
}

// Track page views
export const trackPageView = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag && process.env.NEXT_PUBLIC_GA_ID) {
    window.gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
      page_path: url,
    });
  }
};

// Track events
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Track custom events specific to your blog
export const trackBlogView = (blogId: string, title: string) => {
  trackEvent('view_blog', 'engagement', `${blogId}: ${title}`);
};

export const trackBlogShare = (blogId: string, platform: string) => {
  trackEvent('share_blog', 'social', `${platform}: ${blogId}`);
};

export const trackSearchQuery = (query: string) => {
  trackEvent('search', 'engagement', query);
};

export const trackContactForm = () => {
  trackEvent('submit_contact_form', 'engagement');
};

export const trackNewsletterSignup = () => {
  trackEvent('newsletter_signup', 'engagement');
};