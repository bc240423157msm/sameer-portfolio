"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Check, X } from "lucide-react";
import type { BlogPost } from "@/types/content";
import { RichTextEditor } from "@/components/blog/RichTextEditor";
import { ImageUploader } from "@/components/portal/ImageUploader";
import { readingTimeMinutes } from "@/lib/blog-html";
import { checkFocusKeyword, metaDescriptionStatus } from "@/lib/blog-seo";
import { slugify } from "@/utils/slugify";
import { cn } from "@/utils/cn";
import type { BlogDraft } from "@/lib/blog-drafts";

export interface BlogPostFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  published: boolean;
  coverImage: string;
  coverImageAlt: string;
  focusKeyword: string;
}

interface BlogPostEditorProps {
  value: BlogPostFormData;
  onChange: (data: BlogPostFormData) => void;
  postId?: string;
  inputClass: string;
  textareaClass: string;
}

const AUTOSAVE_MS = 18_000;

export function BlogPostEditor({
  value,
  onChange,
  postId,
  inputClass,
  textareaClass,
}: BlogPostEditorProps) {
  const draftId = useId().replace(/:/g, "");
  const slugManual = useRef(false);
  const [draftSavedAt, setDraftSavedAt] = useState<string | null>(null);
  const [savingDraft, setSavingDraft] = useState(false);
  const [restoredDraft, setRestoredDraft] = useState(false);

  useEffect(() => {
    const draftKey = postId ?? draftId;
    fetch(`/api/blog/draft?id=${encodeURIComponent(draftKey)}`)
      .then((r) => r.json())
      .then((data: { draft?: BlogDraft | null }) => {
        const draft = data.draft;
        if (!draft?.content && !draft?.title) return;
        if (draft.title || draft.content) {
          onChange({
            ...value,
            title: draft.title ?? value.title,
            slug: draft.slug ?? value.slug,
            excerpt: draft.excerpt ?? value.excerpt,
            content: draft.content ?? value.content,
            category: draft.category ?? value.category,
            coverImage: draft.coverImage ?? value.coverImage,
            coverImageAlt: draft.coverImageAlt ?? value.coverImageAlt,
            focusKeyword: draft.focusKeyword ?? value.focusKeyword,
            published: draft.published ?? value.published,
          });
          setDraftSavedAt(draft.savedAt ?? null);
          setRestoredDraft(true);
        }
      })
      .catch(() => {});
    // Only run once on mount for this editor instance
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId, draftId]);

  const readingTime = readingTimeMinutes(value.content);
  const metaStatus = metaDescriptionStatus(value.excerpt);
  const keywordCheck = checkFocusKeyword(value.focusKeyword, {
    title: value.title,
    excerpt: value.excerpt,
    contentHtml: value.content,
  });

  const update = useCallback(
    (patch: Partial<BlogPostFormData>) => {
      onChange({ ...value, ...patch });
    },
    [value, onChange]
  );

  function handleTitleChange(title: string) {
    const patch: Partial<BlogPostFormData> = { title };
    if (!slugManual.current) {
      patch.slug = slugify(title);
    }
    if (!value.coverImageAlt || value.coverImageAlt === value.title) {
      patch.coverImageAlt = title;
    }
    update(patch);
  }

  function handleSlugChange(slug: string) {
    slugManual.current = true;
    update({ slug: slugify(slug) });
  }

  const autosave = useCallback(async () => {
    if (!value.title && !value.content) return;
    setSavingDraft(true);
    try {
      const res = await fetch("/api/blog/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: postId ?? draftId,
          postId,
          ...value,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setDraftSavedAt(data.savedAt);
      }
    } catch {
      // silent — autosave is best-effort
    } finally {
      setSavingDraft(false);
    }
  }, [value, postId, draftId]);

  useEffect(() => {
    const timer = setInterval(autosave, AUTOSAVE_MS);
    return () => clearInterval(timer);
  }, [autosave]);

  const metaColor =
    metaStatus.status === "ideal"
      ? "text-success"
      : metaStatus.status === "short"
        ? "text-warning"
        : "text-error";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-text-muted">
          {restoredDraft && !savingDraft && "Draft restored · "}
          {savingDraft
            ? "Saving draft…"
            : draftSavedAt
              ? `Draft saved ${new Date(draftSavedAt).toLocaleTimeString()}`
              : "Autosaves every 18s"}
        </p>
        <p className="text-xs text-text-muted">
          {readingTime} min read
        </p>
      </div>

      <input
        value={value.title}
        onChange={(e) => handleTitleChange(e.target.value)}
        className={inputClass}
        placeholder="Post title"
      />

      <div>
        <label className="mb-1 block text-xs text-text-muted">URL slug</label>
        <input
          value={value.slug}
          onChange={(e) => handleSlugChange(e.target.value)}
          className={inputClass}
          placeholder="post-url-slug"
        />
      </div>

      <input
        value={value.category}
        onChange={(e) => update({ category: e.target.value })}
        className={inputClass}
        placeholder="Category"
      />

      <ImageUploader
        label="Featured image (cover)"
        value={value.coverImage}
        onChange={(url) => update({ coverImage: url })}
        aspect="aspect-video"
        enableDragDrop
      />

      <div>
        <label className="mb-1 block text-xs text-text-muted">
          Featured image alt text
        </label>
        <input
          value={value.coverImageAlt}
          onChange={(e) => update({ coverImageAlt: e.target.value })}
          className={inputClass}
          placeholder="Describe the cover image"
        />
      </div>

      <div>
        <textarea
          value={value.excerpt}
          onChange={(e) => update({ excerpt: e.target.value })}
          rows={2}
          className={textareaClass}
          placeholder="Meta description / excerpt"
        />
        <p className={cn("mt-1 text-xs", metaColor)}>
          {metaStatus.length} characters
          {metaStatus.status === "ideal" && " — ideal length (150–160)"}
          {metaStatus.status === "short" && " — aim for 150–160 characters"}
          {metaStatus.status === "long" && " — may be truncated in search results"}
        </p>
      </div>

      <div>
        <label className="mb-1 block text-xs text-text-muted">
          Focus keyword (optional)
        </label>
        <input
          value={value.focusKeyword}
          onChange={(e) => update({ focusKeyword: e.target.value })}
          className={inputClass}
          placeholder="e.g. Next.js SEO"
        />
        {keywordCheck && (
          <ul className="mt-2 space-y-1 text-xs text-text-secondary">
            <KeywordRow ok={keywordCheck.inTitle} label="Keyword in title" />
            <KeywordRow ok={keywordCheck.inFirstParagraph} label="Keyword in first paragraph" />
            <KeywordRow ok={keywordCheck.inH2} label="Keyword in at least one H2" />
            <KeywordRow ok={keywordCheck.inMetaDescription} label="Keyword in meta description" />
          </ul>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm text-text-secondary">Content</label>
        <RichTextEditor
          value={value.content}
          onChange={(html) => update({ content: html })}
        />
      </div>
    </div>
  );
}

function KeywordRow({ ok, label }: { ok: boolean; label: string }) {
  return (
    <li className="flex items-center gap-2">
      {ok ? (
        <Check className="h-3.5 w-3.5 text-success" />
      ) : (
        <X className="h-3.5 w-3.5 text-text-muted" />
      )}
      <span className={ok ? "text-success" : ""}>{label}</span>
    </li>
  );
}

export function blogPostToForm(post: BlogPost): BlogPostFormData {
  return {
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    category: post.category,
    published: post.published,
    coverImage: post.coverImage ?? "",
    coverImageAlt: post.coverImageAlt ?? post.title,
    focusKeyword: post.focusKeyword ?? "",
  };
}

export function formToBlogPost(
  form: BlogPostFormData,
  existing?: BlogPost
): Omit<BlogPost, "id" | "createdAt" | "updatedAt"> & { id?: string } {
  return {
    id: existing?.id,
    slug: form.slug || slugify(form.title),
    title: form.title,
    excerpt: form.excerpt,
    content: form.content,
    category: form.category,
    published: form.published,
    coverImage: form.coverImage || undefined,
    coverImageAlt: form.coverImageAlt || form.title,
    focusKeyword: form.focusKeyword || undefined,
  };
}
