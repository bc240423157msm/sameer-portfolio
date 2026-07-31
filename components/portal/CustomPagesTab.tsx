"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, ExternalLink } from "lucide-react";
import type { CustomPage } from "@/types/content";
import { slugify } from "@/utils/slugify";

interface CustomPagesTabProps {
  inputClass: string;
  textareaClass: string;
}

export function CustomPagesTab({ inputClass, textareaClass }: CustomPagesTabProps) {
  const [pages, setPages] = useState<CustomPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState("");
  const [newMeta, setNewMeta] = useState("");
  const [saveStatus, setSaveStatus] = useState<
    Record<string, { type: "success" | "error"; message: string }>
  >({});

  async function load() {
    setLoading(true);
    const res = await fetch("/api/pages");
    setPages(res.ok ? await res.json() : []);
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);

  async function createPage() {
    if (!newTitle.trim()) return;
    const res = await fetch("/api/pages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: newTitle,
        metaDescription: newMeta,
        published: false,
        showInNav: false,
      }),
    });
    if (res.ok) {
      const page = await res.json();
      setPages((prev) => [...prev, page]);
      setNewTitle("");
      setNewMeta("");
    }
  }

  async function updatePage(page: CustomPage) {
    const res = await fetch("/api/pages", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(page),
    });
    if (res.ok) {
      const saved = await res.json();
      setPages((prev) => prev.map((p) => (p.id === saved.id ? saved : p)));
      setSaveStatus((s) => ({
        ...s,
        [page.id]: { type: "success", message: "Saved." },
      }));
    } else {
      const body = await res.json().catch(() => null);
      setSaveStatus((s) => ({
        ...s,
        [page.id]: {
          type: "error",
          message: body?.error ?? "Failed to save. Try again.",
        },
      }));
    }
    setTimeout(() => {
      setSaveStatus((s) => {
        const next = { ...s };
        delete next[page.id];
        return next;
      });
    }, 4000);
  }

  async function deletePage(id: string) {
    if (!confirm("Delete this page?")) return;
    await fetch(`/api/pages?id=${id}`, { method: "DELETE" });
    setPages((prev) => prev.filter((p) => p.id !== id));
  }

  if (loading) return <p className="text-sm text-text-muted">Loading pages…</p>;

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="mb-4 flex items-center gap-2 font-semibold text-text-primary">
          <Plus className="h-5 w-5" /> New Custom Page
        </h2>
        <div className="space-y-3">
          <input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className={inputClass}
            placeholder="Page title (e.g. FAQ, Careers)"
          />
          <textarea
            value={newMeta}
            onChange={(e) => setNewMeta(e.target.value)}
            rows={2}
            className={textareaClass}
            placeholder="Meta description for SEO (150–160 chars ideal)"
          />
          <button
            type="button"
            onClick={createPage}
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white"
          >
            Create Page
          </button>
        </div>
      </section>

      {pages.map((page) => (
        <div key={page.id} className="rounded-xl border border-border bg-card p-5 space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div>
              <input
                value={page.title}
                onChange={(e) => {
                  const title = e.target.value;
                  setPages((prev) =>
                    prev.map((p) => (p.id === page.id ? { ...p, title } : p))
                  );
                }}
                className={inputClass}
              />
              <div className="mt-2 flex items-center gap-2">
                <span className="text-xs text-text-muted">/pages/</span>
                <input
                  value={page.slug}
                  onChange={(e) => {
                    const slug = e.target.value;
                    setPages((prev) =>
                      prev.map((p) => (p.id === page.id ? { ...p, slug } : p))
                    );
                  }}
                  onBlur={(e) => {
                    const slug = slugify(e.target.value) || slugify(page.title) || "page";
                    setPages((prev) =>
                      prev.map((p) => (p.id === page.id ? { ...p, slug } : p))
                    );
                  }}
                  className="w-full max-w-xs rounded-lg border border-border bg-surface px-3 py-1.5 text-xs text-text-primary"
                  placeholder="page-url"
                />
                <button
                  type="button"
                  onClick={() =>
                    setPages((prev) =>
                      prev.map((p) =>
                        p.id === page.id ? { ...p, slug: slugify(p.title) } : p
                      )
                    )
                  }
                  className="whitespace-nowrap rounded-lg border border-border px-2.5 py-1.5 text-xs text-text-secondary hover:text-text-primary"
                  title="Regenerate URL from the title"
                >
                  Reset from title
                </button>
              </div>
            </div>
            <div className="flex gap-2">
              <a
                href={`/pages/${page.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-border p-2"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
              <button
                type="button"
                onClick={() => deletePage(page.id)}
                className="rounded-lg border border-border p-2 text-error"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
          <textarea
            value={page.metaDescription}
            onChange={(e) =>
              setPages((prev) =>
                prev.map((p) =>
                  p.id === page.id ? { ...p, metaDescription: e.target.value } : p
                )
              )
            }
            rows={2}
            className={textareaClass}
            placeholder="Meta description"
          />
          <textarea
            value={page.blocks[0]?.text ?? ""}
            onChange={(e) =>
              setPages((prev) =>
                prev.map((p) =>
                  p.id === page.id
                    ? {
                        ...p,
                        blocks: [
                          {
                            id: p.blocks[0]?.id ?? crypto.randomUUID(),
                            type: "paragraph" as const,
                            text: e.target.value,
                          },
                        ],
                      }
                    : p
                )
              )
            }
            rows={6}
            className={textareaClass}
            placeholder="Page body content"
          />
          <div className="flex flex-wrap gap-4 text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={page.published}
                onChange={(e) =>
                  setPages((prev) =>
                    prev.map((p) =>
                      p.id === page.id ? { ...p, published: e.target.checked } : p
                    )
                  )
                }
              />
              Published
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={page.showInNav}
                onChange={(e) =>
                  setPages((prev) =>
                    prev.map((p) =>
                      p.id === page.id ? { ...p, showInNav: e.target.checked } : p
                    )
                  )
                }
              />
              Show in navigation
            </label>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                const current = pages.find((p) => p.id === page.id);
                if (current) updatePage(current);
              }}
              className="rounded-lg bg-primary px-4 py-2 text-sm text-white"
            >
              Save Page
            </button>
            {saveStatus[page.id] && (
              <span
                className={`text-xs ${
                  saveStatus[page.id]!.type === "success"
                    ? "text-success"
                    : "text-error"
                }`}
              >
                {saveStatus[page.id]!.message}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
