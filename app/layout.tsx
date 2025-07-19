import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";
import GlobalErrorHandler from "@/components/GlobalErrorHandler";
import HydrationErrorHandler from "@/components/HydrationErrorHandler";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sanatan Blogs",
  description: "A secure platform for authentic storytelling and meaningful conversations. Share your knowledge, connect with readers, and build a community around your ideas.",
  keywords: ["blog", "writing", "sanatan", "storytelling", "community"],
  authors: [{ name: "Sanatan Blogs Team" }],
  icons: {
    icon: [
      { url: '/favicon-simple.svg', type: 'image/svg+xml', sizes: '32x32' },
      { url: '/favicon-om.svg', type: 'image/svg+xml', sizes: '64x64' },
      { url: '/favicon.ico', sizes: 'any' }
    ],
    apple: '/favicon-om.svg',
  },
  openGraph: {
    title: "Sanatan Blogs",
    description: "A secure platform for authentic storytelling and meaningful conversations.",
    url: "https://sanatanblogs.com",
    siteName: "Sanatan Blogs",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sanatan Blogs",
    description: "A secure platform for authentic storytelling and meaningful conversations.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Remove browser extension attributes that cause hydration mismatches
              if (typeof document !== 'undefined') {
                const html = document.documentElement;
                if (html.hasAttribute('foxified')) {
                  html.removeAttribute('foxified');
                }
              }
              
              // Handle HMR errors gracefully
              if (typeof window !== 'undefined') {
                window.addEventListener('error', function(event) {
                  if (event.error && event.error.message && 
                      (event.error.message.includes('module factory is not available') ||
                       event.error.message.includes('error-boundary.js'))) {
                    console.warn('HMR error detected, attempting to recover...');
                    event.preventDefault();
                    
                    // Try to recover by reloading the page after a short delay
                    setTimeout(() => {
                      if (window.location.href.includes('localhost')) {
                        window.location.reload();
                      }
                    }, 1000);
                  }
                });
              }
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <GlobalErrorHandler />
        <HydrationErrorHandler />
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
