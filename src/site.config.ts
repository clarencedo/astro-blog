import type { SiteConfig } from "./types";

export const siteConfig: SiteConfig = {
  // Used as both a meta property (src/components/BaseHead.astro L:31 + L:49) & the generated satori png (src/pages/og-image/[slug].png.ts)
  author: "Clarence Du",
  // Meta property used to construct the meta title property, found in src/components/BaseHead.astro L:11
  title: "a blog by clarence",
  // Meta property used as the default description meta property
  description: "An opinionated starter theme for Astro",
  // HTML lang property, found in src/layouts/Base.astro L:18
  lang: "en-GB",
  // Meta property, found in src/components/BaseHead.astro L:42
  ogLocale: "en_GB",
  // Date.prototype.toLocaleDateString() parameters, found in src/utils/date.ts.
  date: {
    locale: "en-GB",
    options: {
      day: "numeric",
      month: "short",
      year: "numeric",
    },
  },
  // Include view-transitions: https://docs.astro.build/en/guides/view-transitions/
  includeViewTransitions: false,
  webmentions: {
    link: "https://webmention.io/api/mentions.html?token=AmaCjSEAwmz_3LtAFGEKdQ",
  },
};

// Used to generate links in both the Header & Footer.
export const menuLinks: Array<{ title: string; path: string }> = [
  {
    title: "Home",
    path: "/",
  },
  {
    title: "About",
    path: "/about/",
  },
  {
    title: "Posts",
    path: "/posts/",
  },
  {
    title: "Books",
    path: "/books/",
  },
];
