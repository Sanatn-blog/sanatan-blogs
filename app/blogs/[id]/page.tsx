import BlogDetailClient from "./BlogDetailClient";

// The article UI is heavily interactive - comments, likes, bookmarks, follow -
// so it stays a client component. This server wrapper exists so the route can
// export generateMetadata, which a "use client" module is not allowed to do.
// Without it the article inherited the root layout's title, description and
// canonical, and every post on the site told Google it was the homepage.
export { generateMetadata } from "./metadata";

export const dynamic = "force-dynamic";

export default function BlogDetailPage() {
  return <BlogDetailClient />;
}
