import mongoose from "mongoose";
import type { FilterQuery } from "mongoose";
import type { IBlog } from "@/models/Blog";

/**
 * Build the `$or` branches that resolve a blog from a URL segment which may be
 * either an ObjectId or a slug.
 *
 * The `_id` branch is only included when the value actually casts to an
 * ObjectId — otherwise Mongoose throws a CastError for the whole query and the
 * route 500s, even though the `slug` branch would have matched. Blog links are
 * generated both ways in this app (listing pages use `_id`, the sitemap,
 * related articles and admin previews use `slug`), so every lookup by URL
 * segment has to tolerate both.
 */
export function blogIdOrSlugBranches(
  idOrSlug: string,
): NonNullable<FilterQuery<IBlog>["$or"]> {
  const branches: NonNullable<FilterQuery<IBlog>["$or"]> = [{ slug: idOrSlug }];

  if (mongoose.Types.ObjectId.isValid(idOrSlug)) {
    branches.unshift({ _id: idOrSlug });
  }

  return branches;
}

/**
 * Filter matching a published blog by either its id or its slug.
 */
export function publishedBlogFilter(idOrSlug: string): FilterQuery<IBlog> {
  return {
    $or: blogIdOrSlugBranches(idOrSlug),
    status: "published",
    isPublished: true,
  };
}
