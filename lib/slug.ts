/**
 * Build a URL slug from a title.
 *
 * The previous version stripped everything outside [a-z0-9 ], which is fine for
 * English and destroys everything else: a Devanagari title lost every one of its
 * characters, leaving an empty slug that the uniqueness loop then turned into
 * "-", "--1", "--2". Since this site publishes in Hindi, that is every article -
 * three published posts, three meaningless URLs carrying none of the words
 * anyone would actually search for.
 *
 * The character classes below match letters, numbers and combining marks in any
 * script. The marks matter as much as the letters here: Devanagari matras are
 * combining marks rather than letters, so leaving \p{M} out mangles every word
 * into its bare consonants. Non-ASCII slugs are percent-encoded in the URL and
 * are handled normally by search engines, which display them decoded.
 */
export function generateSlug(text: string): string {
  return (
    (text || "")
      .toLowerCase()
      .normalize("NFC")
      // Any run of characters that is not part of a word becomes one dash.
      .replace(/[^\p{L}\p{N}\p{M}]+/gu, "-")
      .replace(/^-+|-+$/g, "")
      .substring(0, 100)
      // The truncation above can land mid-separator.
      .replace(/-+$/, "")
  );
}

/**
 * A slug carrying no letters or digits (the "-", "--1" shapes above) is not
 * worth putting in a URL - callers fall back to the document id instead.
 */
export function isUsableSlug(slug?: string | null): boolean {
  return !!slug && /[\p{L}\p{N}]/u.test(slug);
}
