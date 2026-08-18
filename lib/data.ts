import { cache } from "react";
import type {
  BlogComment,
  BlogPost,
  ContactSubmission,
  PendingTestimonial,
  SiteContent,
} from "@/types/content";
import { defaultBlogPosts, defaultSiteContent } from "@/lib/default-content";
import { kvGet, kvSet } from "@/lib/kv";

const SITE_CONTENT_KEY = "site-content";
const BLOG_POSTS_KEY = "blog-posts";
const SUBMISSIONS_KEY = "contact-submissions";
const COMMENTS_KEY = "blog-comments";
const PAGES_KEY = "custom-pages";
const MEDIA_KEY = "media-library";
const PENDING_TESTIMONIALS_KEY = "pending-testimonials";

export interface MediaItem {
  url: string;
  uploadedAt: string;
  usedIn: string[];
}

// Technologies that must never appear in the "Technologies I Use" section,
// no matter what is saved in the database. This is a hard, permanent block —
// not just a default — so old/stale saved data can never bring them back.
const BLOCKED_TECH_SLUGS = new Set(["supabase", "postgresql", "postgres"]);

function sanitizeTechItems(
  items: SiteContent["home"]["techStack"]["items"]
): SiteContent["home"]["techStack"]["items"] {
  return items.filter(
    (item) =>
      !BLOCKED_TECH_SLUGS.has(item.slug.toLowerCase().trim()) &&
      !BLOCKED_TECH_SLUGS.has(item.name.toLowerCase().trim())
  );
}

function mergeSiteContent(partial: Partial<SiteContent>): SiteContent {
  const settings: Partial<SiteContent["settings"]> = partial.settings ?? {};
  return {
    ...defaultSiteContent,
    ...partial,
    contact: { ...defaultSiteContent.contact, ...partial.contact },
    settings: {
      ...defaultSiteContent.settings,
      ...settings,
      branding: {
        ...defaultSiteContent.settings.branding,
        ...settings.branding,
      },
      seo: {
        ...defaultSiteContent.settings.seo,
        ...settings.seo,
      },
      navLinks: settings.navLinks ?? defaultSiteContent.settings.navLinks,
      footerLinks: settings.footerLinks ?? defaultSiteContent.settings.footerLinks,
      footerDescription:
        settings.footerDescription ??
        defaultSiteContent.settings.footerDescription,
      pageHeaders: {
        ...defaultSiteContent.settings.pageHeaders,
        ...(settings.pageHeaders ?? {}),
        ...Object.fromEntries(
          (
            Object.keys(
              defaultSiteContent.settings.pageHeaders
            ) as (keyof typeof defaultSiteContent.settings.pageHeaders)[]
          ).map((key) => [
            key,
            {
              ...defaultSiteContent.settings.pageHeaders[key],
              ...(settings.pageHeaders?.[key] ?? {}),
            },
          ])
        ),
      },
      pageHeroText: {
        ...defaultSiteContent.settings.pageHeroText,
        ...(settings.pageHeroText ?? {}),
        ...Object.fromEntries(
          (
            Object.keys(
              defaultSiteContent.settings.pageHeroText
            ) as (keyof typeof defaultSiteContent.settings.pageHeroText)[]
          ).map((key) => [
            key,
            {
              ...defaultSiteContent.settings.pageHeroText[key],
              ...(settings.pageHeroText?.[key] ?? {}),
            },
          ])
        ),
      },
    },
    about: {
      ...defaultSiteContent.about,
      ...partial.about,
      skills: partial.about?.skills ?? defaultSiteContent.about.skills,
      whyClientsChooseMe:
        partial.about?.whyClientsChooseMe ??
        defaultSiteContent.about.whyClientsChooseMe,
      detailsImage: {
        ...defaultSiteContent.about.detailsImage,
        ...partial.about?.detailsImage,
      },
      galleryPhotos:
        partial.about?.galleryPhotos ?? defaultSiteContent.about.galleryPhotos,
    },
    services: partial.services ?? defaultSiteContent.services,
    whyWorkWithMe: partial.whyWorkWithMe ?? defaultSiteContent.whyWorkWithMe,
    developmentProcess:
      partial.developmentProcess ?? defaultSiteContent.developmentProcess,
    contactPage: {
      ...defaultSiteContent.contactPage,
      ...partial.contactPage,
      getInTouch: {
        ...defaultSiteContent.contactPage.getInTouch,
        ...partial.contactPage?.getInTouch,
      },
      faq: {
        ...defaultSiteContent.contactPage.faq,
        ...partial.contactPage?.faq,
      },
    },
    portfolio: partial.portfolio ?? defaultSiteContent.portfolio,
    faq: partial.faq ?? defaultSiteContent.faq,
    testimonials: partial.testimonials ?? defaultSiteContent.testimonials,
    hero: { ...defaultSiteContent.hero, ...partial.hero },
    home: {
      ...defaultSiteContent.home,
      ...partial.home,
      stats: partial.home?.stats ?? defaultSiteContent.home.stats,
      techStack: {
        ...defaultSiteContent.home.techStack,
        ...partial.home?.techStack,
        items: sanitizeTechItems(
          partial.home?.techStack?.items ??
            defaultSiteContent.home.techStack.items
        ),
      },
      servicesPreview: {
        ...defaultSiteContent.home.servicesPreview,
        ...partial.home?.servicesPreview,
        items:
          partial.home?.servicesPreview?.items ??
          defaultSiteContent.home.servicesPreview.items,
      },
      whyChooseMe: {
        ...defaultSiteContent.home.whyChooseMe,
        ...partial.home?.whyChooseMe,
        items:
          partial.home?.whyChooseMe?.items ??
          defaultSiteContent.home.whyChooseMe.items,
      },
      aboutIntro: {
        ...defaultSiteContent.home.aboutIntro,
        ...partial.home?.aboutIntro,
        highlights:
          partial.home?.aboutIntro?.highlights ??
          defaultSiteContent.home.aboutIntro.highlights,
        mainPhoto: {
          ...defaultSiteContent.home.aboutIntro.mainPhoto,
          ...partial.home?.aboutIntro?.mainPhoto,
        },
        accentPhoto1: {
          ...defaultSiteContent.home.aboutIntro.accentPhoto1,
          ...partial.home?.aboutIntro?.accentPhoto1,
        },
        accentPhoto2: {
          ...defaultSiteContent.home.aboutIntro.accentPhoto2,
          ...partial.home?.aboutIntro?.accentPhoto2,
        },
      },
      cta: { ...defaultSiteContent.home.cta, ...partial.home?.cta },
    },
  };
}

// Wrapped in React's `cache()` so that within a single request, every
// section/component that calls getSiteContent() shares ONE Redis round-trip
// instead of each firing its own — previously a single page (e.g. the
// homepage, which pulls content in ~9 separate section components) made
// 9+ sequential network calls to Upstash, which is what was making pages
// slow. `cache()` de-dupes calls per request only; it doesn't cache across
// different requests, so edits made in the admin panel still show up
// immediately.
export const getSiteContent = cache(async (): Promise<SiteContent> => {
  const raw = await kvGet<Partial<SiteContent> | null>(SITE_CONTENT_KEY, null);
  if (!raw) return defaultSiteContent;
  return mergeSiteContent(raw);
});

export async function saveSiteContent(content: SiteContent): Promise<void> {
  await kvSet(SITE_CONTENT_KEY, content);
}

export const getBlogPosts = cache(async (): Promise<BlogPost[]> => {
  return kvGet(BLOG_POSTS_KEY, defaultBlogPosts);
});

export async function getPublishedBlogPosts(): Promise<BlogPost[]> {
  const posts = await getBlogPosts();
  return posts
    .filter((p) => p.published)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}

export async function getBlogPostBySlug(
  slug: string
): Promise<BlogPost | undefined> {
  const posts = await getBlogPosts();
  return posts.find((p) => p.slug === slug);
}

export async function saveBlogPosts(posts: BlogPost[]): Promise<void> {
  await kvSet(BLOG_POSTS_KEY, posts);
}

export async function getContactSubmissions(): Promise<ContactSubmission[]> {
  const submissions = await kvGet<ContactSubmission[]>(SUBMISSIONS_KEY, []);
  return submissions.sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function saveContactSubmission(
  data: Omit<ContactSubmission, "id" | "createdAt" | "read">
): Promise<ContactSubmission> {
  const submissions = await getContactSubmissions();
  const submission: ContactSubmission = {
    id: crypto.randomUUID(),
    ...data,
    createdAt: new Date().toISOString(),
    read: false,
  };
  submissions.unshift(submission);
  await kvSet(SUBMISSIONS_KEY, submissions);
  return submission;
}

export async function markSubmissionRead(id: string): Promise<void> {
  const submissions = await getContactSubmissions();
  const index = submissions.findIndex((s) => s.id === id);
  if (index !== -1) {
    submissions[index]!.read = true;
    await kvSet(SUBMISSIONS_KEY, submissions);
  }
}

export { slugify } from "@/utils/slugify";

// ---- Client-submitted reviews awaiting admin approval ----

export async function getPendingTestimonials(): Promise<PendingTestimonial[]> {
  const items = await kvGet<PendingTestimonial[]>(PENDING_TESTIMONIALS_KEY, []);
  return items.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function savePendingTestimonial(
  data: Omit<PendingTestimonial, "id" | "createdAt">
): Promise<PendingTestimonial> {
  const items = await getPendingTestimonials();
  const item: PendingTestimonial = {
    id: crypto.randomUUID(),
    ...data,
    createdAt: new Date().toISOString(),
  };
  items.unshift(item);
  await kvSet(PENDING_TESTIMONIALS_KEY, items);
  return item;
}

/** Removes a pending review — used both when rejecting it and right after
 * approving it (it moves into the live `testimonials` list instead). */
export async function removePendingTestimonial(id: string): Promise<void> {
  const items = await getPendingTestimonials();
  await kvSet(
    PENDING_TESTIMONIALS_KEY,
    items.filter((t) => t.id !== id)
  );
}

export async function getCommentsForPost(
  postSlug: string
): Promise<BlogComment[]> {
  const comments = await kvGet<BlogComment[]>(COMMENTS_KEY, []);
  return comments
    .filter((c) => c.postSlug === postSlug)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}

export async function saveComment(
  data: Omit<BlogComment, "id" | "createdAt">
): Promise<BlogComment> {
  const comments = await kvGet<BlogComment[]>(COMMENTS_KEY, []);
  const comment: BlogComment = {
    id: crypto.randomUUID(),
    ...data,
    createdAt: new Date().toISOString(),
  };
  comments.unshift(comment);
  await kvSet(COMMENTS_KEY, comments);
  return comment;
}

// ---- Custom pages (admin-created pages from the dashboard) ----

export const getCustomPages = cache(async () => {
  const { defaultCustomPages } = await import("@/lib/default-content");
  return kvGet(PAGES_KEY, defaultCustomPages);
});

export async function saveCustomPages(
  pages: Awaited<ReturnType<typeof getCustomPages>>
): Promise<void> {
  await kvSet(PAGES_KEY, pages);
}

// ---- Media library ----

export async function getMediaLibrary(): Promise<MediaItem[]> {
  return kvGet<MediaItem[]>(MEDIA_KEY, []);
}

export async function addMediaItem(
  url: string,
  usedIn?: string
): Promise<MediaItem> {
  const library = await getMediaLibrary();
  const existing = library.find((m) => m.url === url);
  if (existing) {
    if (usedIn && !existing.usedIn.includes(usedIn)) {
      existing.usedIn.push(usedIn);
      await kvSet(MEDIA_KEY, library);
    }
    return existing;
  }
  const item: MediaItem = {
    url,
    uploadedAt: new Date().toISOString(),
    usedIn: usedIn ? [usedIn] : [],
  };
  library.unshift(item);
  await kvSet(MEDIA_KEY, library);
  return item;
}

export async function removeMediaItem(url: string): Promise<void> {
  const library = await getMediaLibrary();
  await kvSet(
    MEDIA_KEY,
    library.filter((m) => m.url !== url)
  );
}
