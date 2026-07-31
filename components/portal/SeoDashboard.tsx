"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LogOut,
  Plus,
  Trash2,
  Edit3,
  FileText,
  Loader2,
  KeyRound,
} from "lucide-react";
import type { BlogPost } from "@/types/content";
import {
  BlogPostEditor,
  blogPostToForm,
  formToBlogPost,
  type BlogPostFormData,
} from "@/components/blog/BlogPostEditor";

interface SeoDashboardProps {
  initialPosts: BlogPost[];
}

export function SeoDashboard({ initialPosts }: SeoDashboardProps) {
  const router = useRouter();
  const [posts, setPosts] = useState(initialPosts);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [accountForm, setAccountForm] = useState({
    currentPassword: "",
    newUsername: "",
    newPassword: "",
  });
  const [accountMessage, setAccountMessage] = useState("");
  const [accountSaving, setAccountSaving] = useState(false);
  const emptyPostForm: BlogPostFormData = {
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "SEO",
    published: true,
    coverImage: "",
    coverImageAlt: "",
    focusKeyword: "",
  };

  const [newPost, setNewPost] = useState<BlogPostFormData>(emptyPostForm);
  const [editingForm, setEditingForm] = useState<BlogPostFormData | null>(null);

  async function refreshMe() {
    const res = await fetch("/api/auth/me");
    if (!res.ok) return;
    const data = await res.json();
    const username = data.user?.username as string | undefined;
    if (username) {
      setAccountForm((prev) => ({ ...prev, newUsername: username }));
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refreshMe();
  }, []);

  async function changeAccount() {
    setAccountSaving(true);
    setAccountMessage("");
    const res = await fetch("/api/auth/account", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(accountForm),
    });
    const data = await res.json();
    setAccountSaving(false);
    if (res.ok) {
      setAccountMessage("Credentials updated. Use the new username/password next time you log in.");
      setAccountForm({ ...accountForm, currentPassword: "", newPassword: "" });
    } else {
      setAccountMessage(data.error ?? "Failed to update credentials.");
    }
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/portal");
    router.refresh();
  }

  async function createPost() {
    if (!newPost.title || !newPost.content) return;
    setSaving(true);
    const res = await fetch("/api/blog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPost),
    });
    if (res.ok) {
      const post = await res.json();
      setPosts((prev) => [post, ...prev]);
      setNewPost(emptyPostForm);
      setMessage("Post published successfully!");
    }
    setSaving(false);
  }

  async function updatePost(post: BlogPost, form: BlogPostFormData) {
    setSaving(true);
    const payload = { id: post.id, ...formToBlogPost(form, post) };
    const res = await fetch("/api/blog", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const updated = await res.json();
      setPosts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      setEditingPost(null);
      setEditingForm(null);
      setMessage("Post updated!");
    }
    setSaving(false);
  }

  async function deletePost(id: string) {
    if (!confirm("Delete this post?")) return;
    const res = await fetch(`/api/blog?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      setPosts((prev) => prev.filter((p) => p.id !== id));
      setMessage("Post deleted.");
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/60 bg-surface/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <div>
            <h1 className="text-lg font-semibold text-text-primary">
              SEO Dashboard
            </h1>
            <p className="text-xs text-text-muted">
              Create & manage blog posts
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm text-text-secondary transition-colors hover:text-text-primary"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-8">
        {message && (
          <p className="mb-4 rounded-lg border border-accent/30 bg-accent/10 px-4 py-2.5 text-sm text-accent">
            {message}
          </p>
        )}

        <section className="mb-8 rounded-xl border border-border bg-card p-6">
          <h2 className="mb-4 flex items-center gap-2 font-semibold text-text-primary">
            <Plus className="h-5 w-5 text-accent" />
            New Blog Post
          </h2>
          <BlogPostEditor
            value={newPost}
            onChange={setNewPost}
            inputClass="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-text-primary"
            textareaClass="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm text-text-primary"
          />
          <button
            onClick={createPost}
            disabled={saving}
            className="mt-4 flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-white disabled:opacity-60"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <FileText className="h-4 w-4" />
            )}
            Publish Post
          </button>
        </section>

        <section className="space-y-4">
          <h2 className="font-semibold text-text-primary">Your Posts</h2>
          {posts.length === 0 && (
            <p className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-text-muted">
              No posts yet. Create your first SEO article above.
            </p>
          )}
          {posts.map((post) => (
            <div
              key={post.id}
              className="rounded-xl border border-border bg-card p-5"
            >
              {editingPost?.id === post.id && editingForm ? (
                <div className="space-y-3">
                  <BlogPostEditor
                    value={editingForm}
                    onChange={setEditingForm}
                    postId={post.id}
                    inputClass="w-full rounded-lg border border-border bg-surface px-4 py-2 text-sm text-text-primary"
                    textareaClass="w-full rounded-lg border border-border bg-surface px-4 py-2 text-sm text-text-primary"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => updatePost(post, editingForm)}
                      className="rounded-lg bg-primary px-4 py-2 text-sm text-white"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => { setEditingPost(null); setEditingForm(null); }}
                      className="rounded-lg border border-border px-4 py-2 text-sm text-text-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-medium text-text-primary">
                      {post.title}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-sm text-text-secondary">
                      {post.excerpt}
                    </p>
                    <p className="mt-2 text-xs text-text-muted">
                      {post.category} ·{" "}
                      {post.published ? "Live" : "Draft"} ·{" "}
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button
                      onClick={() => { setEditingPost(post); setEditingForm(blogPostToForm(post)); }}
                      className="rounded-lg border border-border p-2 text-text-secondary hover:text-text-primary"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deletePost(post.id)}
                      className="rounded-lg border border-border p-2 text-error hover:bg-error/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </section>

        <section className="mt-8 space-y-4 rounded-xl border border-border bg-card p-6">
          <h2 className="flex items-center gap-2 font-semibold text-text-primary">
            <KeyRound className="h-5 w-5 text-accent" />
            Change your username / password
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <input
              type="password"
              value={accountForm.currentPassword}
              onChange={(e) => setAccountForm({ ...accountForm, currentPassword: e.target.value })}
              className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-text-primary"
              placeholder="Current password"
            />
            <input
              value={accountForm.newUsername}
              onChange={(e) => setAccountForm({ ...accountForm, newUsername: e.target.value })}
              className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-text-primary"
              placeholder="New username"
            />
            <input
              type="password"
              value={accountForm.newPassword}
              onChange={(e) => setAccountForm({ ...accountForm, newPassword: e.target.value })}
              className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-text-primary"
              placeholder="At least 6 characters"
            />
          </div>
          {accountMessage && <p className="text-sm text-text-secondary">{accountMessage}</p>}
          <button
            onClick={changeAccount}
            disabled={accountSaving}
            className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-white disabled:opacity-60"
          >
            {accountSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
            Update credentials
          </button>
        </section>
      </div>
    </div>
  );
}
