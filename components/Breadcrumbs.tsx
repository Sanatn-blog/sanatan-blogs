'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { BreadcrumbStructuredData } from './StructuredData';

interface BreadcrumbItem {
  name: string;
  url: string;
  isCurrentPage?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  // Always include home as the first item
  const breadcrumbItems = [
    { name: 'Home', url: '/' },
    ...items,
  ];

  return (
    <>
      <BreadcrumbStructuredData items={breadcrumbItems} />
      <nav 
        aria-label="Breadcrumb navigation"
        className={`flex items-center space-x-2 text-sm text-gray-600 ${className}`}
      >
        <ol className="flex items-center space-x-2">
          {breadcrumbItems.map((item, index) => (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <ChevronRight className="w-4 h-4 mx-2 text-gray-400" aria-hidden="true" />
              )}
              
              {index === 0 ? (
                <Link
                  href={item.url}
                  className="flex items-center hover:text-orange-600 transition-colors"
                  aria-label="Go to homepage"
                >
                  <Home className="w-4 h-4 mr-1" aria-hidden="true" />
                  <span className="sr-only">{item.name}</span>
                </Link>
              ) : item.isCurrentPage || index === breadcrumbItems.length - 1 ? (
                <span 
                  className="text-gray-900 font-medium"
                  aria-current="page"
                >
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.url}
                  className="hover:text-orange-600 transition-colors"
                  aria-label={`Go to ${item.name}`}
                >
                  {item.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}

// Helper function to generate breadcrumbs for different page types
export function generateBlogBreadcrumbs(blogTitle: string, blogSlug: string, category?: string): BreadcrumbItem[] {
  const items: BreadcrumbItem[] = [
    { name: 'Blogs', url: '/blogs' },
  ];

  if (category) {
    items.push({
      name: category,
      url: `/blogs?category=${encodeURIComponent(category)}`,
    });
  }

  items.push({
    name: blogTitle,
    url: `/blogs/${blogSlug}`,
    isCurrentPage: true,
  });

  return items;
}

export function generateAuthorBreadcrumbs(authorName: string, authorId: string): BreadcrumbItem[] {
  return [
    { name: 'Authors', url: '/authors' },
    { name: authorName, url: `/authors/${authorId}`, isCurrentPage: true },
  ];
}

export function generateCategoryBreadcrumbs(categoryName: string): BreadcrumbItem[] {
  return [
    { name: 'Blogs', url: '/blogs' },
    { name: categoryName, url: `/blogs?category=${encodeURIComponent(categoryName)}`, isCurrentPage: true },
  ];
}