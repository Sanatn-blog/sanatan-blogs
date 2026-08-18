import BlogsListClient from "./BlogsListClient";

// Server wrapper so the listing can export its own metadata - see the note in
// app/blogs/[id]/page.tsx.
export { metadata } from "./metadata";

export const dynamic = "force-dynamic";

export default function BlogsPage() {
  return <BlogsListClient />;
}
