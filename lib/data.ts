import { promises as fs } from "fs";
import path from "path";
import type {
  BlogComment,
  BlogPost,
  ContactSubmission,
  SiteContent,
} from "@/types/content";
import { defaultBlogPosts, defaultSiteContent } from "@/lib/default-content";

const DATA_DIR = path.join(process.cwd(), "data");
const SITE_CONTENT_PATH = path.join(DATA_DIR, "site-content.json");
const BLOG_POSTS_PATH = path.join(DATA_DIR, "blog-posts.json");
const SUBMISSIONS_PATH = path.join(DATA_DIR, "contact-submissions.json");
const COMMENTS_PATH = path.join(DATA_DIR, "blog-comments.json");

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function readJson<T>(filePath: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function writeJson<T>(filePath: string, data: T): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
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
    },
    about: { ...defaultSiteContent.about, ...partial.about },
    services: partial.services ?? defaultSiteContent.services,
    portfolio: partial.portfolio ?? defaultSiteContent.portfolio,
    faq: partial.faq ?? defaultSiteContent.faq,
    testimonials: partial.testimonials ?? defaultSiteContent.testimonials,
    hero: { ...defaultSiteContent.hero, ...partial.hero },
  };
}

export async function getSiteContent(): Promise<SiteContent> {
  const raw = await readJson<Partial<SiteContent> | null>(
    SITE_CONTENT_PATH,
    null
  );
  if (!raw) return defaultSiteContent;
  return mergeSiteContent(raw);
}

export async function saveSiteContent(content: SiteContent): Promise<void> {
  await writeJson(SITE_CONTENT_PATH, content);
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  return readJson(BLOG_POSTS_PATH, defaultBlogPosts);
}

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
  await writeJson(BLOG_POSTS_PATH, posts);
}

export async function getContactSubmissions(): Promise<ContactSubmission[]> {
  const submissions = await readJson<ContactSubmission[]>(SUBMISSIONS_PATH, []);
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
  await writeJson(SUBMISSIONS_PATH, submissions);
  return submission;
}

export async function markSubmissionRead(id: string): Promise<void> {
  const submissions = await getContactSubmissions();
  const index = submissions.findIndex((s) => s.id === id);
  if (index !== -1) {
    submissions[index]!.read = true;
    await writeJson(SUBMISSIONS_PATH, submissions);
  }
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function getCommentsForPost(
  postSlug: string
): Promise<BlogComment[]> {
  const comments = await readJson<BlogComment[]>(COMMENTS_PATH, []);
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
  const comments = await readJson<BlogComment[]>(COMMENTS_PATH, []);
  const comment: BlogComment = {
    id: crypto.randomUUID(),
    ...data,
    createdAt: new Date().toISOString(),
  };
  comments.unshift(comment);
  await writeJson(COMMENTS_PATH, comments);
  return comment;
}
