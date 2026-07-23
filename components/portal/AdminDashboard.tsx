"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LogOut,
  Save,
  FileText,
  Settings,
  Plus,
  Trash2,
  Edit3,
  Loader2,
  Star,
  HelpCircle,
  Briefcase,
  Home,
  Inbox,
  Layout,
  Palette,
  KeyRound,
  UserPlus,
} from "lucide-react";
import type { BlogPost, ContactSubmission, SiteContent, Testimonial } from "@/types/content";
import {
  pageHeaderLabels,
  type PageHeaderKey,
} from "@/lib/page-headers";

interface AdminDashboardProps {
  initialContent: SiteContent;
  initialPosts: BlogPost[];
  initialSubmissions: ContactSubmission[];
}

type Tab =
  | "hero"
  | "about"
  | "portfolio"
  | "faq"
  | "testimonials"
  | "blog"
  | "branding"
  | "settings"
  | "account"
  | "inbox";

const inputClass =
  "w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-text-primary";
const textareaClass =
  "w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm text-text-primary";

export function AdminDashboard({
  initialContent,
  initialPosts,
  initialSubmissions,
}: AdminDashboardProps) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("hero");
  const [content, setContent] = useState(initialContent);
  const [posts, setPosts] = useState(initialPosts);
  const [submissions, setSubmissions] = useState(initialSubmissions);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [accountForm, setAccountForm] = useState({
    currentPassword: "",
    newUsername: "Sameer Malik",
    newPassword: "",
  });
  const [accountMessage, setAccountMessage] = useState("");
  const [accountSaving, setAccountSaving] = useState(false);
  const [users, setUsers] = useState<
    { username: string; role: "admin" | "seo"; createdAt: string }[]
  >([]);
  const [newUserForm, setNewUserForm] = useState({
    username: "",
    password: "",
    role: "seo" as "admin" | "seo",
  });
  const [newUserMessage, setNewUserMessage] = useState("");
  const [newUserSaving, setNewUserSaving] = useState(false);

  useEffect(() => {
    if (tab !== "account") return;
    fetch("/api/auth/users")
      .then((res) => (res.ok ? res.json() : { users: [] }))
      .then((data) => setUsers(data.users ?? []))
      .catch(() => {});
  }, [tab]);

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

  async function addUser() {
    if (!newUserForm.username.trim() || !newUserForm.password) return;
    setNewUserSaving(true);
    setNewUserMessage("");
    const res = await fetch("/api/auth/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUserForm),
    });
    const data = await res.json();
    setNewUserSaving(false);
    if (res.ok) {
      setUsers(data.users ?? []);
      setNewUserForm({ username: "", password: "", role: "seo" });
      setNewUserMessage("User created.");
    } else {
      setNewUserMessage(data.error ?? "Failed to create user.");
    }
  }

  async function removeUser(username: string) {
    const res = await fetch(`/api/auth/users?username=${encodeURIComponent(username)}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (res.ok) setUsers(data.users ?? []);
  }

  const [newPost, setNewPost] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "SEO",
    published: false,
    coverImage: "",
  });

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "hero", label: "Home Hero", icon: Home },
    { id: "about", label: "About", icon: Layout },
    { id: "portfolio", label: "Portfolio", icon: Briefcase },
    { id: "faq", label: "FAQ", icon: HelpCircle },
    { id: "testimonials", label: "Testimonials", icon: Star },
    { id: "blog", label: "Blog", icon: FileText },
    { id: "branding", label: "Logo & Headers", icon: Palette },
    { id: "settings", label: "Settings", icon: Settings },
    { id: "account", label: "Account", icon: KeyRound },
    { id: "inbox", label: "Inbox", icon: Inbox },
  ];

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/portal");
    router.refresh();
  }

  async function saveContent() {
    setSaving(true);
    setMessage("");
    const res = await fetch("/api/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(content),
    });
    setSaving(false);
    setMessage(res.ok ? "Saved! Website updated." : "Failed to save.");
    if (res.ok) router.refresh();
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
      setNewPost({ title: "", excerpt: "", content: "", category: "SEO", published: false, coverImage: "" });
      setMessage("Post created!");
    }
    setSaving(false);
  }

  async function updatePost(post: BlogPost) {
    setSaving(true);
    const res = await fetch("/api/blog", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(post),
    });
    if (res.ok) {
      const updated = await res.json();
      setPosts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      setEditingPost(null);
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

  async function markRead(id: string) {
    await fetch("/api/contact/submissions", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setSubmissions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, read: true } : s))
    );
  }

  function addTestimonial() {
    const t: Testimonial = {
      id: crypto.randomUUID(),
      quote: "",
      author: "",
      role: "",
      rating: 5,
    };
    setContent({ ...content, testimonials: [...content.testimonials, t] });
  }

  function addFaq() {
    setContent({
      ...content,
      faq: [...content.faq, { question: "", answer: "" }],
    });
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/60 bg-surface/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div>
            <h1 className="text-lg font-semibold text-text-primary">Admin Dashboard</h1>
            <p className="text-xs text-text-muted">Full website control</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={saveContent}
              disabled={saving}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save Site
            </button>
            <button onClick={handleLogout} className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm text-text-secondary hover:text-text-primary">
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl gap-8 px-6 py-8">
        <aside className="hidden w-56 shrink-0 lg:block">
          <nav className="sticky top-24 space-y-1">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                  tab === t.id
                    ? "bg-primary/10 text-primary"
                    : "text-text-secondary hover:bg-card hover:text-text-primary"
                }`}
              >
                <t.icon className="h-4 w-4 shrink-0" />
                <span className="flex-1">{t.label}</span>
                {t.id === "inbox" && submissions.filter((s) => !s.read).length > 0 && (
                  <span className="rounded-full bg-accent px-1.5 text-xs text-background">
                    {submissions.filter((s) => !s.read).length}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="mb-6 flex flex-wrap gap-2 lg:hidden">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  tab === t.id ? "bg-primary text-white" : "bg-card text-text-secondary hover:text-text-primary"
                }`}
              >
                <t.icon className="h-4 w-4" />
                {t.label}
              </button>
            ))}
          </div>

          {message && (
            <p className="mb-4 rounded-lg border border-accent/30 bg-accent/10 px-4 py-2.5 text-sm text-accent">{message}</p>
          )}

        {tab === "hero" && (
          <div className="space-y-4 rounded-xl border border-border bg-card p-6">
            <h2 className="font-semibold text-text-primary">Home Page Hero</h2>
            <input value={content.hero.tagline} onChange={(e) => setContent({ ...content, hero: { ...content.hero, tagline: e.target.value } })} className={inputClass} placeholder="Tagline" />
            <input value={content.hero.headline} onChange={(e) => setContent({ ...content, hero: { ...content.hero, headline: e.target.value } })} className={inputClass} placeholder="Headline" />
            <textarea value={content.hero.description} onChange={(e) => setContent({ ...content, hero: { ...content.hero, description: e.target.value } })} rows={4} className={textareaClass} placeholder="Description" />
          </div>
        )}

        {tab === "about" && (
          <div className="space-y-4">
            {(["personalStory", "experience", "education"] as const).map((field) => (
              <div key={field} className="rounded-xl border border-border bg-card p-6">
                <h2 className="mb-3 font-semibold capitalize text-text-primary">{field.replace(/([A-Z])/g, " $1")}</h2>
                <textarea value={content.about[field]} onChange={(e) => setContent({ ...content, about: { ...content.about, [field]: e.target.value } })} rows={4} className={textareaClass} />
              </div>
            ))}
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="mb-3 font-semibold text-text-primary">Contact Info</h2>
              <div className="grid gap-4 sm:grid-cols-3">
                <input value={content.contact.email} onChange={(e) => setContent({ ...content, contact: { ...content.contact, email: e.target.value } })} className={inputClass} placeholder="Email" />
                <input value={content.contact.whatsapp} onChange={(e) => setContent({ ...content, contact: { ...content.contact, whatsapp: e.target.value } })} className={inputClass} placeholder="WhatsApp display text" />
                <input value={content.contact.location} onChange={(e) => setContent({ ...content, contact: { ...content.contact, location: e.target.value } })} className={inputClass} placeholder="Location" />
              </div>
            </div>
            {content.services.map((service, i) => (
              <div key={service.id} className="rounded-xl border border-border bg-card p-6">
                <h2 className="mb-3 font-semibold text-text-primary">Service: {service.title}</h2>
                <input value={service.title} onChange={(e) => { const s = [...content.services]; s[i] = { ...s[i]!, title: e.target.value }; setContent({ ...content, services: s }); }} className={`${inputClass} mb-3`} />
                <textarea value={service.shortDescription} onChange={(e) => { const s = [...content.services]; s[i] = { ...s[i]!, shortDescription: e.target.value }; setContent({ ...content, services: s }); }} rows={3} className={textareaClass} />
              </div>
            ))}
          </div>
        )}

        {tab === "portfolio" && (
          <div className="space-y-4">
            {content.portfolio.map((project, i) => (
              <div key={project.slug} className="rounded-xl border border-border bg-card p-6">
                <h2 className="mb-3 font-semibold text-text-primary">{project.title}</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  <input value={project.title} onChange={(e) => { const p = [...content.portfolio]; p[i] = { ...p[i]!, title: e.target.value }; setContent({ ...content, portfolio: p }); }} className={inputClass} placeholder="Title" />
                  <input value={project.projectUrl} onChange={(e) => { const p = [...content.portfolio]; p[i] = { ...p[i]!, projectUrl: e.target.value }; setContent({ ...content, portfolio: p }); }} className={inputClass} placeholder="Live URL (https://...)" />
                </div>
                {/* PROJECT IMAGE — paste an image URL, or a local path like /images/projects/name.jpg */}
                <input value={project.image} onChange={(e) => { const p = [...content.portfolio]; p[i] = { ...p[i]!, image: e.target.value }; setContent({ ...content, portfolio: p }); }} className={`${inputClass} mt-3`} placeholder="Image URL" />
                <textarea value={project.overview} onChange={(e) => { const p = [...content.portfolio]; p[i] = { ...p[i]!, overview: e.target.value }; setContent({ ...content, portfolio: p }); }} rows={2} className={`${textareaClass} mt-3`} placeholder="Overview" />
                <textarea value={project.results} onChange={(e) => { const p = [...content.portfolio]; p[i] = { ...p[i]!, results: e.target.value }; setContent({ ...content, portfolio: p }); }} rows={2} className={`${textareaClass} mt-3`} placeholder="Results" />
              </div>
            ))}
          </div>
        )}

        {tab === "faq" && (
          <div className="space-y-4">
            <button onClick={addFaq} className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm text-text-secondary hover:text-text-primary">
              <Plus className="h-4 w-4" /> Add FAQ
            </button>
            {content.faq.map((item, i) => (
              <div key={i} className="rounded-xl border border-border bg-card p-6">
                <div className="mb-3 flex justify-between">
                  <span className="text-sm font-medium text-text-muted">FAQ {i + 1}</span>
                  <button onClick={() => setContent({ ...content, faq: content.faq.filter((_, idx) => idx !== i) })} className="text-error"><Trash2 className="h-4 w-4" /></button>
                </div>
                <input value={item.question} onChange={(e) => { const f = [...content.faq]; f[i] = { ...f[i]!, question: e.target.value }; setContent({ ...content, faq: f }); }} className={`${inputClass} mb-3`} placeholder="Question" />
                <textarea value={item.answer} onChange={(e) => { const f = [...content.faq]; f[i] = { ...f[i]!, answer: e.target.value }; setContent({ ...content, faq: f }); }} rows={3} className={textareaClass} placeholder="Answer" />
              </div>
            ))}
          </div>
        )}

        {tab === "testimonials" && (
          <div className="space-y-4">
            <button onClick={addTestimonial} className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm text-text-secondary hover:text-text-primary">
              <Plus className="h-4 w-4" /> Add Testimonial
            </button>
            {content.testimonials.map((item, i) => (
              <div key={item.id} className="rounded-xl border border-border bg-card p-6">
                <div className="mb-3 flex justify-between">
                  <span className="text-sm font-medium text-text-muted">Testimonial {i + 1}</span>
                  <button onClick={() => setContent({ ...content, testimonials: content.testimonials.filter((t) => t.id !== item.id) })} className="text-error"><Trash2 className="h-4 w-4" /></button>
                </div>
                <textarea value={item.quote} onChange={(e) => { const t = [...content.testimonials]; t[i] = { ...t[i]!, quote: e.target.value }; setContent({ ...content, testimonials: t }); }} rows={3} className={`${textareaClass} mb-3`} placeholder="Quote" />
                <div className="grid gap-3 sm:grid-cols-3">
                  <input value={item.author} onChange={(e) => { const t = [...content.testimonials]; t[i] = { ...t[i]!, author: e.target.value }; setContent({ ...content, testimonials: t }); }} className={inputClass} placeholder="Author name" />
                  <input value={item.role} onChange={(e) => { const t = [...content.testimonials]; t[i] = { ...t[i]!, role: e.target.value }; setContent({ ...content, testimonials: t }); }} className={inputClass} placeholder="Role / Company" />
                  <input type="number" min={1} max={5} value={item.rating} onChange={(e) => { const t = [...content.testimonials]; t[i] = { ...t[i]!, rating: Number(e.target.value) }; setContent({ ...content, testimonials: t }); }} className={inputClass} placeholder="Rating 1-5" />
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "branding" && (
          <div className="space-y-6">
            <section className="rounded-xl border border-border bg-card p-6">
              <h2 className="mb-1 font-semibold text-text-primary">Navbar Logo</h2>
              <p className="mb-4 text-xs text-text-muted">
                Use a file in the <code className="text-accent">public/</code> folder (e.g.{" "}
                <code className="text-accent">/logo.png</code>) or a full image URL.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm text-text-secondary">Logo path or URL</label>
                  <input
                    value={content.settings.branding.logoSrc}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        settings: {
                          ...content.settings,
                          branding: {
                            ...content.settings.branding,
                            logoSrc: e.target.value,
                          },
                        },
                      })
                    }
                    className={inputClass}
                    placeholder="/logo.png"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-text-secondary">Logo alt text (SEO)</label>
                  <input
                    value={content.settings.branding.logoAlt}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        settings: {
                          ...content.settings,
                          branding: {
                            ...content.settings.branding,
                            logoAlt: e.target.value,
                          },
                        },
                      })
                    }
                    className={inputClass}
                    placeholder="Sameer Malik"
                  />
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="font-semibold text-text-primary">Page Header Backgrounds</h2>
              <p className="text-xs text-text-muted">
                Each page header uses a background image. Paste an image URL or use a local path
                like <code className="text-accent">/headers/about.jpg</code> (file goes in{" "}
                <code className="text-accent">public/headers/</code>).
              </p>
              {(Object.keys(pageHeaderLabels) as PageHeaderKey[]).map((key) => (
                <div key={key} className="rounded-xl border border-border bg-card p-5">
                  <h3 className="mb-3 text-sm font-medium text-text-primary">
                    {pageHeaderLabels[key]}
                  </h3>
                  <input
                    value={content.settings.pageHeaders[key].src}
                    onChange={(e) => {
                      const pageHeaders = { ...content.settings.pageHeaders };
                      pageHeaders[key] = {
                        ...pageHeaders[key],
                        src: e.target.value,
                      };
                      setContent({
                        ...content,
                        settings: { ...content.settings, pageHeaders },
                      });
                    }}
                    className={`${inputClass} mb-3`}
                    placeholder="Image URL or /headers/page.jpg"
                  />
                  <input
                    value={content.settings.pageHeaders[key].alt}
                    onChange={(e) => {
                      const pageHeaders = { ...content.settings.pageHeaders };
                      pageHeaders[key] = {
                        ...pageHeaders[key],
                        alt: e.target.value,
                      };
                      setContent({
                        ...content,
                        settings: { ...content.settings, pageHeaders },
                      });
                    }}
                    className={inputClass}
                    placeholder="Image description for SEO"
                  />
                </div>
              ))}
            </section>
          </div>
        )}

        {tab === "settings" && (
          <div className="space-y-4 rounded-xl border border-border bg-card p-6">
            <h2 className="font-semibold text-text-primary">Site Settings</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm text-text-secondary">WhatsApp Number (with country code)</label>
                <input value={content.settings.whatsappNumber} onChange={(e) => setContent({ ...content, settings: { ...content.settings, whatsappNumber: e.target.value } })} className={inputClass} placeholder="+1234567890" />
                <p className="mt-1 text-xs text-text-muted">Powers the floating WhatsApp button</p>
              </div>
              <div>
                <label className="mb-1 block text-sm text-text-secondary">Google Analytics ID</label>
                <input value={content.settings.gaMeasurementId} onChange={(e) => setContent({ ...content, settings: { ...content.settings, gaMeasurementId: e.target.value } })} className={inputClass} placeholder="G-XXXXXXXXXX" />
              </div>
              <div>
                <label className="mb-1 block text-sm text-text-secondary">Contact Form Email</label>
                <input value={content.settings.contactEmail} onChange={(e) => setContent({ ...content, settings: { ...content.settings, contactEmail: e.target.value } })} className={inputClass} placeholder="hello@yourdomain.com" />
              </div>
              <div>
                <label className="mb-1 block text-sm text-text-secondary">Calendly URL (optional)</label>
                <input value={content.settings.calendlyUrl} onChange={(e) => setContent({ ...content, settings: { ...content.settings, calendlyUrl: e.target.value } })} className={inputClass} placeholder="https://calendly.com/..." />
              </div>
            </div>
          </div>
        )}

        {tab === "account" && (
          <div className="space-y-6">
            <div className="space-y-4 rounded-xl border border-border bg-card p-6">
              <h2 className="font-semibold text-text-primary">Change your username / password</h2>
              <p className="text-xs text-text-muted">
                This updates the login you&apos;re currently signed in with.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm text-text-secondary">Current password</label>
                  <input
                    type="password"
                    value={accountForm.currentPassword}
                    onChange={(e) => setAccountForm({ ...accountForm, currentPassword: e.target.value })}
                    className={inputClass}
                    placeholder="Current password"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-text-secondary">New username</label>
                  <input
                    value={accountForm.newUsername}
                    onChange={(e) => setAccountForm({ ...accountForm, newUsername: e.target.value })}
                    className={inputClass}
                    placeholder="New username"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-text-secondary">New password</label>
                  <input
                    type="password"
                    value={accountForm.newPassword}
                    onChange={(e) => setAccountForm({ ...accountForm, newPassword: e.target.value })}
                    className={inputClass}
                    placeholder="At least 6 characters"
                  />
                </div>
              </div>
              {accountMessage && <p className="text-sm text-text-secondary">{accountMessage}</p>}
              <button
                onClick={changeAccount}
                disabled={accountSaving}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white disabled:opacity-60"
              >
                {accountSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
                Update credentials
              </button>
            </div>

            <div className="space-y-4 rounded-xl border border-border bg-card p-6">
              <h2 className="font-semibold text-text-primary">Add another admin or SEO user</h2>
              <p className="text-xs text-text-muted">
                Gives someone else their own login, separate from the main admin account.
              </p>
              <div className="grid gap-4 sm:grid-cols-3">
                <input
                  value={newUserForm.username}
                  onChange={(e) => setNewUserForm({ ...newUserForm, username: e.target.value })}
                  className={inputClass}
                  placeholder="Username"
                />
                <input
                  type="password"
                  value={newUserForm.password}
                  onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
                  className={inputClass}
                  placeholder="Password"
                />
                <select
                  value={newUserForm.role}
                  onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value as "admin" | "seo" })}
                  className={inputClass}
                >
                  <option value="seo">SEO access</option>
                  <option value="admin">Full admin access</option>
                </select>
              </div>
              {newUserMessage && <p className="text-sm text-text-secondary">{newUserMessage}</p>}
              <button
                onClick={addUser}
                disabled={newUserSaving}
                className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-text-primary hover:border-primary/40 disabled:opacity-60"
              >
                {newUserSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
                Add user
              </button>

              {users.length > 0 && (
                <div className="mt-2 space-y-2">
                  {users.map((u) => (
                    <div key={u.username} className="flex items-center justify-between rounded-lg border border-border px-4 py-2.5 text-sm">
                      <span className="text-text-primary">
                        {u.username} <span className="text-text-muted">— {u.role}</span>
                      </span>
                      <button onClick={() => removeUser(u.username)} className="text-text-muted hover:text-error">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {tab === "inbox" && (
          <div className="space-y-4">
            {submissions.length === 0 && <p className="text-sm text-text-muted">No messages yet.</p>}
            {submissions.map((sub) => (
              <div key={sub.id} className={`rounded-xl border p-5 ${sub.read ? "border-border bg-card" : "border-accent/40 bg-accent/5"}`}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-text-primary">{sub.name} — {sub.subject}</p>
                    <p className="text-xs text-text-muted">{sub.email} · {new Date(sub.createdAt).toLocaleString()}</p>
                    <p className="mt-3 text-sm text-text-secondary">{sub.message}</p>
                  </div>
                  {!sub.read && (
                    <button onClick={() => markRead(sub.id)} className="shrink-0 rounded-lg border border-border px-3 py-1.5 text-xs text-text-secondary hover:text-text-primary">
                      Mark read
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "blog" && (
          <div className="space-y-6">
            <section className="rounded-xl border border-border bg-card p-6">
              <h2 className="mb-4 flex items-center gap-2 font-semibold text-text-primary"><Plus className="h-5 w-5" /> New Post</h2>
              <div className="space-y-3">
                <input value={newPost.title} onChange={(e) => setNewPost({ ...newPost, title: e.target.value })} className={inputClass} placeholder="Title" />
                <input value={newPost.category} onChange={(e) => setNewPost({ ...newPost, category: e.target.value })} className={inputClass} placeholder="Category" />
                <input value={newPost.coverImage} onChange={(e) => setNewPost({ ...newPost, coverImage: e.target.value })} className={inputClass} placeholder="Cover image URL (optional)" />
                <textarea value={newPost.excerpt} onChange={(e) => setNewPost({ ...newPost, excerpt: e.target.value })} rows={2} className={textareaClass} placeholder="Excerpt / meta description" />
                <textarea value={newPost.content} onChange={(e) => setNewPost({ ...newPost, content: e.target.value })} rows={6} className={textareaClass} placeholder="Content" />
                <label className="flex items-center gap-2 text-sm text-text-secondary">
                  <input type="checkbox" checked={newPost.published} onChange={(e) => setNewPost({ ...newPost, published: e.target.checked })} /> Publish
                </label>
                <button onClick={createPost} disabled={saving} className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white">Create Post</button>
              </div>
            </section>
            {posts.map((post) => (
              <div key={post.id} className="rounded-xl border border-border bg-card p-5">
                {editingPost?.id === post.id ? (
                  <div className="space-y-3">
                    <input value={editingPost.title} onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })} className={inputClass} />
                    <input value={editingPost.coverImage ?? ""} onChange={(e) => setEditingPost({ ...editingPost, coverImage: e.target.value })} className={inputClass} placeholder="Cover image URL (optional)" />
                    <textarea value={editingPost.content} onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })} rows={5} className={textareaClass} />
                    <div className="flex gap-2">
                      <button onClick={() => updatePost(editingPost)} className="rounded-lg bg-primary px-4 py-2 text-sm text-white">Save</button>
                      <button onClick={() => setEditingPost(null)} className="rounded-lg border border-border px-4 py-2 text-sm">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-text-primary">{post.title}</h3>
                      <p className="text-xs text-text-muted">{post.category} · {post.published ? "Live" : "Draft"}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setEditingPost(post)} className="rounded-lg border border-border p-2"><Edit3 className="h-4 w-4" /></button>
                      <button onClick={() => deletePost(post.id)} className="rounded-lg border border-border p-2 text-error"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
