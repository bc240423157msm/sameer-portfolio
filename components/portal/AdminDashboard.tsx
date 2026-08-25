"use client";

import { useEffect, useState } from "react";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { SetupChecklist } from "@/components/portal/SetupChecklist";
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
  Images,
  Layers,
  Share2,
} from "lucide-react";
import type { BlogPost, ContactSubmission, SiteContent, Testimonial, SocialLink } from "@/types/content";
import {
  pageHeaderLabels,
  pageHeroTextLabels,
  type PageHeaderKey,
  type PageHeroTextKey,
} from "@/lib/page-headers";
import { ImageUploader } from "@/components/portal/ImageUploader";
import { TechIconUploader } from "@/components/portal/TechIconUploader";
import { ICON_OPTIONS } from "@/lib/icon-registry";
import {
  BlogPostEditor,
  blogPostToForm,
  formToBlogPost,
  type BlogPostFormData,
} from "@/components/blog/BlogPostEditor";
import { MediaLibraryTab } from "@/components/portal/MediaLibraryTab";
import { CustomPagesTab } from "@/components/portal/CustomPagesTab";
import { SocialIcon, SOCIAL_PLATFORMS } from "@/components/common/SocialIcon";
import { slugify } from "@/utils/slugify";

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
  | "media"
  | "pages"
  | "branding"
  | "social"
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
    newUsername: "",
    newPassword: "",
  });
  const [accountMessage, setAccountMessage] = useState("");
  const [accountSaving, setAccountSaving] = useState(false);

  type TwoFactorInfo = { method: "none" | "email" | "totp" | "both"; totpVerified: boolean };
  type UserRow = {
    username: string;
    role: "admin" | "seo";
    createdAt?: string;
    avatarUrl?: string;
    email?: string;
    twoFactor: TwoFactorInfo;
    isBuiltin: boolean;
  };
  const [users, setUsers] = useState<UserRow[]>([]);
  type PendingReview = {
    id: string;
    quote: string;
    author: string;
    role: string;
    rating: number;
    image?: string;
    createdAt: string;
  };
  const [pendingReviews, setPendingReviews] = useState<PendingReview[]>([]);
  const [pendingBusyId, setPendingBusyId] = useState<string | null>(null);
  const [newUserForm, setNewUserForm] = useState({
    username: "",
    password: "",
    role: "seo" as "admin" | "seo",
    avatarUrl: "",
    email: "",
  });
  const [newUserMessage, setNewUserMessage] = useState("");
  const [newUserSaving, setNewUserSaving] = useState(false);

  // My own profile (avatar / email / 2FA self-service)
  const [myAvatar, setMyAvatar] = useState("");
  const [myEmail, setMyEmail] = useState("");
  const [myTwoFactor, setMyTwoFactor] = useState<TwoFactorInfo>({ method: "none", totpVerified: false });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");
  const [totpQr, setTotpQr] = useState("");
  const [totpSecret, setTotpSecret] = useState("");
  const [totpCode, setTotpCode] = useState("");
  const [totpMessage, setTotpMessage] = useState("");
  const [totpBusy, setTotpBusy] = useState(false);

  async function refreshUsers() {
    const res = await fetch("/api/auth/users");
    const data = res.ok ? await res.json() : { users: [] };
    setUsers(data.users ?? []);
  }

  async function refreshPendingReviews() {
    const res = await fetch("/api/testimonials/pending");
    if (!res.ok) return;
    setPendingReviews(await res.json());
  }

  async function approveReview(id: string) {
    setPendingBusyId(id);
    try {
      const res = await fetch("/api/testimonials/pending", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setPendingReviews((prev) => prev.filter((r) => r.id !== id));
        const item = pendingReviews.find((r) => r.id === id);
        if (item) {
          setContent((prev) => ({
            ...prev,
            testimonials: [
              ...prev.testimonials,
              {
                id: item.id,
                quote: item.quote,
                author: item.author,
                role: item.role,
                rating: item.rating,
                image: item.image,
              },
            ],
          }));
        }
      }
    } finally {
      setPendingBusyId(null);
    }
  }

  async function rejectReview(id: string) {
    setPendingBusyId(id);
    try {
      const res = await fetch(`/api/testimonials/pending?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (res.ok) setPendingReviews((prev) => prev.filter((r) => r.id !== id));
    } finally {
      setPendingBusyId(null);
    }
  }

  async function refreshMe() {
    const res = await fetch("/api/auth/me");
    if (!res.ok) return;
    const data = await res.json();
    setMyAvatar(data.avatarUrl ?? "");
    setMyEmail(data.email ?? "");
    setMyTwoFactor(data.twoFactor ?? { method: "none", totpVerified: false });
    const username = data.user?.username as string | undefined;
    if (username) {
      setAccountForm((prev) => ({ ...prev, newUsername: username }));
    }
  }

  async function saveMyProfile() {
    setProfileSaving(true);
    setProfileMessage("");
    const res = await fetch("/api/auth/account", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ avatarUrl: myAvatar, email: myEmail }),
    });
    setProfileSaving(false);
    setProfileMessage(res.ok ? "Profile updated." : "Failed to update profile.");
  }

  async function startTotpSetup() {
    setTotpBusy(true);
    setTotpMessage("");
    try {
      const res = await fetch("/api/auth/2fa/self-setup");
      const data = await res.json();
      if (!res.ok) {
        setTotpMessage(data.error ?? "Could not start setup.");
        return;
      }
      setTotpQr(data.qrDataUrl);
      setTotpSecret(data.secret);
    } finally {
      setTotpBusy(false);
    }
  }

  async function confirmTotpSetup() {
    setTotpBusy(true);
    setTotpMessage("");
    try {
      const res = await fetch("/api/auth/2fa/self-setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: totpCode }),
      });
      const data = await res.json();
      if (!res.ok) {
        setTotpMessage(data.error ?? "Incorrect code.");
        return;
      }
      setTotpMessage("Authenticator app connected! Ask an admin to set your account's 2FA to \"Authenticator app\" or \"Both\" to require it at login.");
      setTotpQr("");
      setTotpCode("");
      refreshMe();
    } finally {
      setTotpBusy(false);
    }
  }

  async function updateUserTwoFactor(username: string, method: TwoFactorInfo["method"]) {
    await fetch("/api/auth/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, twoFactorMethod: method }),
    });
    refreshUsers();
  }

  useEffect(() => {
    if (tab !== "account") return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- async fetch-on-tab-change, not a synchronous setState
    refreshUsers();
    refreshMe();
  }, [tab]);

  useEffect(() => {
    if (tab !== "testimonials") return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- async fetch-on-tab-change, not a synchronous setState
    refreshPendingReviews();
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
      await refreshUsers();
      setNewUserForm({ username: "", password: "", role: "seo", avatarUrl: "", email: "" });
      setNewUserMessage("User created.");
    } else {
      setNewUserMessage(data.error ?? "Failed to create user.");
    }
  }

  async function removeUser(username: string) {
    const res = await fetch(`/api/auth/users?username=${encodeURIComponent(username)}`, {
      method: "DELETE",
    });
    if (res.ok) await refreshUsers();
  }

  const emptyPostForm: BlogPostFormData = {
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "SEO",
    published: false,
    coverImage: "",
    coverImageAlt: "",
    focusKeyword: "",
  };

  const [newPost, setNewPost] = useState<BlogPostFormData>(emptyPostForm);
  const [editingForm, setEditingForm] = useState<BlogPostFormData | null>(null);

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "hero", label: "Home Page", icon: Home },
    { id: "about", label: "About", icon: Layout },
    { id: "portfolio", label: "Portfolio", icon: Briefcase },
    { id: "faq", label: "FAQ", icon: HelpCircle },
    { id: "testimonials", label: "Testimonials", icon: Star },
    { id: "blog", label: "Blog", icon: FileText },
    { id: "media", label: "Media", icon: Images },
    { id: "pages", label: "Pages", icon: Layers },
    { id: "branding", label: "Logo & Headers", icon: Palette },
    { id: "social", label: "Social Links", icon: Share2 },
    { id: "settings", label: "Settings", icon: Settings },
    { id: "account", label: "Account", icon: KeyRound },
    { id: "inbox", label: "Inbox", icon: Inbox },
  ];

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
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
      setNewPost(emptyPostForm);
      setMessage("Post created!");
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

  function addProject() {
    const base = "new-project";
    const existingSlugs = new Set(content.portfolio.map((p) => p.slug));
    let slug = base;
    let n = 2;
    while (existingSlugs.has(slug)) {
      slug = `${base}-${n}`;
      n += 1;
    }
    setContent({
      ...content,
      portfolio: [
        ...content.portfolio,
        {
          slug,
          title: "New Project",
          subtitle: "",
          description: "",
          technologies: [],
          overview: "",
          problem: "",
          solution: "",
          results: "",
          role: "",
          projectUrl: "",
          image: "",
        },
      ],
    });
  }

  function removeProject(i: number) {
    setContent({
      ...content,
      portfolio: content.portfolio.filter((_, idx) => idx !== i),
    });
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="relative overflow-hidden border-b border-border/60 bg-surface/80 backdrop-blur-md">
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          aria-hidden
          style={{
            background:
              "radial-gradient(circle at 15% 0%, color-mix(in srgb, var(--color-primary) 16%, transparent), transparent 55%), radial-gradient(circle at 85% 100%, color-mix(in srgb, var(--color-accent) 12%, transparent), transparent 55%)",
          }}
        />
        <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-sm font-bold text-white shadow-lg shadow-primary/20">
              SM
            </span>
            <div>
              <h1 className="text-lg font-semibold text-text-primary">Admin Dashboard</h1>
              <p className="text-xs text-text-muted">Full website control</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={saveContent}
              disabled={saving}
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-secondary px-4 py-2 text-sm font-medium text-white shadow-md shadow-primary/20 transition-opacity hover:opacity-90 disabled:opacity-60"
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

      <SetupChecklist />

      <div className="mx-auto flex max-w-7xl gap-8 px-6 py-8">
        <aside className="hidden w-56 shrink-0 lg:block">
          <nav className="sticky top-24 space-y-1">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-all ${
                  tab === t.id
                    ? "bg-gradient-to-r from-primary/15 to-transparent text-primary shadow-[inset_2px_0_0_0_var(--color-primary)]"
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
                  tab === t.id ? "bg-gradient-to-r from-primary to-secondary text-white shadow-md shadow-primary/20" : "bg-card text-text-secondary hover:text-text-primary"
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
          <div className="space-y-4">
            <section className="space-y-4 rounded-xl border border-border bg-card p-6">
              <h2 className="font-semibold text-text-primary">Home Page Hero</h2>
              <input value={content.hero.tagline} onChange={(e) => setContent({ ...content, hero: { ...content.hero, tagline: e.target.value } })} className={inputClass} placeholder="Tagline" />
              <input value={content.hero.headline} onChange={(e) => setContent({ ...content, hero: { ...content.hero, headline: e.target.value } })} className={inputClass} placeholder="Headline" />
              <textarea value={content.hero.description} onChange={(e) => setContent({ ...content, hero: { ...content.hero, description: e.target.value } })} rows={4} className={textareaClass} placeholder="Description" />
            </section>

            <section className="space-y-4 rounded-xl border border-border bg-card p-6">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-semibold text-text-primary">Home Stats</h2>
                <button
                  type="button"
                  onClick={() =>
                    setContent({
                      ...content,
                      home: {
                        ...content.home,
                        stats: [
                          ...content.home.stats,
                          { id: crypto.randomUUID(), value: 0, suffix: "+", label: "New Stat" },
                        ],
                      },
                    })
                  }
                  className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs text-text-secondary hover:text-text-primary"
                >
                  <Plus className="h-4 w-4" /> Add stat
                </button>
              </div>
              <div className="grid gap-3">
                {content.home.stats.map((stat, i) => (
                  <div key={stat.id} className="grid gap-3 rounded-lg border border-border bg-surface p-4 sm:grid-cols-[120px_90px_1fr_auto]">
                    <input
                      type="number"
                      value={stat.value}
                      onChange={(e) => {
                        const stats = [...content.home.stats];
                        stats[i] = { ...stats[i]!, value: Number(e.target.value) };
                        setContent({ ...content, home: { ...content.home, stats } });
                      }}
                      className={inputClass}
                      placeholder="Value"
                    />
                    <input
                      value={stat.suffix}
                      onChange={(e) => {
                        const stats = [...content.home.stats];
                        stats[i] = { ...stats[i]!, suffix: e.target.value };
                        setContent({ ...content, home: { ...content.home, stats } });
                      }}
                      className={inputClass}
                      placeholder="+"
                    />
                    <input
                      value={stat.label}
                      onChange={(e) => {
                        const stats = [...content.home.stats];
                        stats[i] = { ...stats[i]!, label: e.target.value };
                        setContent({ ...content, home: { ...content.home, stats } });
                      }}
                      className={inputClass}
                      placeholder="Happy Clients"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setContent({
                          ...content,
                          home: {
                            ...content.home,
                            stats: content.home.stats.filter((_, idx) => idx !== i),
                          },
                        })
                      }
                      className="rounded-lg border border-border p-2 text-error"
                      aria-label="Remove stat"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-4 rounded-xl border border-border bg-card p-6">
              <h2 className="font-semibold text-text-primary">Home Section Text</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <input value={content.home.aboutIntro.eyebrow} onChange={(e) => setContent({ ...content, home: { ...content.home, aboutIntro: { ...content.home.aboutIntro, eyebrow: e.target.value } } })} className={inputClass} placeholder="About eyebrow" />
                <input value={content.home.aboutIntro.title} onChange={(e) => setContent({ ...content, home: { ...content.home, aboutIntro: { ...content.home.aboutIntro, title: e.target.value } } })} className={inputClass} placeholder="About title" />
                <input value={content.home.techStack.title} onChange={(e) => setContent({ ...content, home: { ...content.home, techStack: { ...content.home.techStack, title: e.target.value } } })} className={inputClass} placeholder="Tech title" />
                <input value={content.home.servicesPreview.title} onChange={(e) => setContent({ ...content, home: { ...content.home, servicesPreview: { ...content.home.servicesPreview, title: e.target.value } } })} className={inputClass} placeholder="Services title" />
                <input value={content.home.whyChooseMe.title} onChange={(e) => setContent({ ...content, home: { ...content.home, whyChooseMe: { ...content.home.whyChooseMe, title: e.target.value } } })} className={inputClass} placeholder="Why choose title" />
                <input value={content.home.cta.title} onChange={(e) => setContent({ ...content, home: { ...content.home, cta: { ...content.home.cta, title: e.target.value } } })} className={inputClass} placeholder="CTA title" />
              </div>
              <textarea value={content.home.cta.description} onChange={(e) => setContent({ ...content, home: { ...content.home, cta: { ...content.home.cta, description: e.target.value } } })} rows={3} className={textareaClass} placeholder="CTA description" />
            </section>

            {/* ===== About Intro (full) ===== */}
            <section className="space-y-4 rounded-xl border border-border bg-card p-6">
              <h2 className="font-semibold text-text-primary">About Intro Section</h2>
              <textarea value={content.home.aboutIntro.paragraph1} onChange={(e) => setContent({ ...content, home: { ...content.home, aboutIntro: { ...content.home.aboutIntro, paragraph1: e.target.value } } })} rows={3} className={textareaClass} placeholder="Paragraph 1" />
              <textarea value={content.home.aboutIntro.paragraph2} onChange={(e) => setContent({ ...content, home: { ...content.home, aboutIntro: { ...content.home.aboutIntro, paragraph2: e.target.value } } })} rows={3} className={textareaClass} placeholder="Paragraph 2" />

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <ImageUploader
                    label="Main photo"
                    value={content.home.aboutIntro.mainPhoto.src}
                    onChange={(url) => setContent({ ...content, home: { ...content.home, aboutIntro: { ...content.home.aboutIntro, mainPhoto: { ...content.home.aboutIntro.mainPhoto, src: url } } } })}
                    aspect="aspect-[4/5]"
                  />
                  <input value={content.home.aboutIntro.mainPhoto.alt} onChange={(e) => setContent({ ...content, home: { ...content.home, aboutIntro: { ...content.home.aboutIntro, mainPhoto: { ...content.home.aboutIntro.mainPhoto, alt: e.target.value } } } })} className={inputClass} placeholder="Main photo alt" />
                </div>
                <div className="space-y-2">
                  <ImageUploader
                    label="Accent photo 1"
                    value={content.home.aboutIntro.accentPhoto1.src}
                    onChange={(url) => setContent({ ...content, home: { ...content.home, aboutIntro: { ...content.home.aboutIntro, accentPhoto1: { ...content.home.aboutIntro.accentPhoto1, src: url } } } })}
                    aspect="aspect-square"
                  />
                  <input value={content.home.aboutIntro.accentPhoto1.alt} onChange={(e) => setContent({ ...content, home: { ...content.home, aboutIntro: { ...content.home.aboutIntro, accentPhoto1: { ...content.home.aboutIntro.accentPhoto1, alt: e.target.value } } } })} className={inputClass} placeholder="Accent 1 alt" />
                </div>
                <div className="space-y-2">
                  <ImageUploader
                    label="Accent photo 2"
                    value={content.home.aboutIntro.accentPhoto2.src}
                    onChange={(url) => setContent({ ...content, home: { ...content.home, aboutIntro: { ...content.home.aboutIntro, accentPhoto2: { ...content.home.aboutIntro.accentPhoto2, src: url } } } })}
                    aspect="aspect-square"
                  />
                  <input value={content.home.aboutIntro.accentPhoto2.alt} onChange={(e) => setContent({ ...content, home: { ...content.home, aboutIntro: { ...content.home.aboutIntro, accentPhoto2: { ...content.home.aboutIntro.accentPhoto2, alt: e.target.value } } } })} className={inputClass} placeholder="Accent 2 alt" />
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 pt-2">
                <h3 className="text-sm font-medium text-text-primary">Highlights</h3>
                <button
                  type="button"
                  onClick={() =>
                    setContent({
                      ...content,
                      home: {
                        ...content.home,
                        aboutIntro: {
                          ...content.home.aboutIntro,
                          highlights: [
                            ...content.home.aboutIntro.highlights,
                            { id: crypto.randomUUID(), label: "New highlight", iconKey: "star" },
                          ],
                        },
                      },
                    })
                  }
                  className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs text-text-secondary hover:text-text-primary"
                >
                  <Plus className="h-4 w-4" /> Add highlight
                </button>
              </div>
              <div className="grid gap-3">
                {content.home.aboutIntro.highlights.map((h, i) => (
                  <div key={h.id} className="grid gap-3 rounded-lg border border-border bg-surface p-3 sm:grid-cols-[1fr_150px_auto]">
                    <input
                      value={h.label}
                      onChange={(e) => {
                        const highlights = [...content.home.aboutIntro.highlights];
                        highlights[i] = { ...highlights[i]!, label: e.target.value };
                        setContent({ ...content, home: { ...content.home, aboutIntro: { ...content.home.aboutIntro, highlights } } });
                      }}
                      className={inputClass}
                      placeholder="Highlight label"
                    />
                    <select
                      value={h.iconKey}
                      onChange={(e) => {
                        const highlights = [...content.home.aboutIntro.highlights];
                        highlights[i] = { ...highlights[i]!, iconKey: e.target.value };
                        setContent({ ...content, home: { ...content.home, aboutIntro: { ...content.home.aboutIntro, highlights } } });
                      }}
                      className={inputClass}
                    >
                      {ICON_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => {
                        const highlights = content.home.aboutIntro.highlights.filter((_, idx) => idx !== i);
                        setContent({ ...content, home: { ...content.home, aboutIntro: { ...content.home.aboutIntro, highlights } } });
                      }}
                      className="rounded-lg border border-border p-2 text-error"
                      aria-label="Remove highlight"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* ===== Tech Stack items ===== */}
            <section className="space-y-4 rounded-xl border border-border bg-card p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="font-semibold text-text-primary">Technologies I Use</h2>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (
                        !window.confirm(
                          "This will replace the current list with: React.js, Next.js, TypeScript, Node.js, Tailwind CSS, WordPress, HTML5, CSS3, Figma, AI Video, Video Editing, Canva, Graphic Design, Git, GitHub. Continue?"
                        )
                      )
                        return;
                      setContent({
                        ...content,
                        home: {
                          ...content.home,
                          techStack: {
                            ...content.home.techStack,
                            items: [
                              { id: crypto.randomUUID(), name: "React.js", slug: "react" },
                              { id: crypto.randomUUID(), name: "Next.js", slug: "nextjs" },
                              { id: crypto.randomUUID(), name: "TypeScript", slug: "typescript" },
                              { id: crypto.randomUUID(), name: "Node.js", slug: "nodejs" },
                              { id: crypto.randomUUID(), name: "Tailwind CSS", slug: "tailwind" },
                              { id: crypto.randomUUID(), name: "WordPress", slug: "wordpress" },
                              { id: crypto.randomUUID(), name: "HTML5", slug: "html" },
                              { id: crypto.randomUUID(), name: "CSS3", slug: "css" },
                              { id: crypto.randomUUID(), name: "Figma", slug: "figma" },
                              { id: crypto.randomUUID(), name: "AI Video", slug: "aivideo" },
                              { id: crypto.randomUUID(), name: "Video Editing", slug: "video-editing" },
                              { id: crypto.randomUUID(), name: "Canva", slug: "canva" },
                              { id: crypto.randomUUID(), name: "Graphic Design", slug: "graphic-designer" },
                              { id: crypto.randomUUID(), name: "Git", slug: "git" },
                              { id: crypto.randomUUID(), name: "GitHub", slug: "github" },
                            ],
                          },
                        },
                      });
                    }}
                    className="flex items-center gap-2 rounded-lg border border-primary/40 bg-primary/10 px-3 py-2 text-xs font-medium text-primary hover:bg-primary/20"
                  >
                    Load recommended list
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setContent({
                        ...content,
                        home: {
                          ...content.home,
                          techStack: {
                            ...content.home.techStack,
                            items: [
                              ...content.home.techStack.items,
                              { id: crypto.randomUUID(), name: "New Technology", slug: "" },
                            ],
                          },
                        },
                      })
                    }
                    className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs text-text-secondary hover:text-text-primary"
                  >
                    <Plus className="h-4 w-4" /> Add technology
                  </button>
                </div>
              </div>
              <p className="text-xs text-text-muted">
                &ldquo;Load recommended list&rdquo; replaces everything below with React.js, Next.js, TypeScript, Node.js, Tailwind CSS, WordPress, HTML5, CSS3, Figma, AI Video, Video Editing, Canva, Graphic Design, Git, GitHub in one click — remember to click Save after.
              </p>
              <textarea value={content.home.techStack.description} onChange={(e) => setContent({ ...content, home: { ...content.home, techStack: { ...content.home.techStack, description: e.target.value } } })} rows={2} className={textareaClass} placeholder="Tech stack description" />
              <div className="grid gap-3 sm:grid-cols-2">
                {content.home.techStack.items.map((tech, i) => (
                  <div key={tech.id} className="flex gap-3 rounded-lg border border-border bg-surface p-3">
                    <TechIconUploader
                      slug={tech.slug}
                      iconUrl={tech.iconUrl}
                      onChange={(iconUrl) => {
                        const items = [...content.home.techStack.items];
                        items[i] = { ...items[i]!, iconUrl };
                        setContent({ ...content, home: { ...content.home, techStack: { ...content.home.techStack, items } } });
                      }}
                    />
                    <div className="grid flex-1 grid-cols-1 gap-2">
                      <input
                        value={tech.name}
                        onChange={(e) => {
                          const items = [...content.home.techStack.items];
                          items[i] = { ...items[i]!, name: e.target.value };
                          setContent({ ...content, home: { ...content.home, techStack: { ...content.home.techStack, items } } });
                        }}
                        className={inputClass}
                        placeholder="Name (e.g. Canva)"
                      />
                      <div className="flex gap-2">
                        <input
                          value={tech.slug}
                          onChange={(e) => {
                            const items = [...content.home.techStack.items];
                            items[i] = { ...items[i]!, slug: e.target.value };
                            setContent({ ...content, home: { ...content.home, techStack: { ...content.home.techStack, items } } });
                          }}
                          className={inputClass}
                          placeholder="Icon slug (e.g. canva)"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const items = content.home.techStack.items.filter((_, idx) => idx !== i);
                            setContent({ ...content, home: { ...content.home, techStack: { ...content.home.techStack, items } } });
                          }}
                          className="shrink-0 rounded-lg border border-border p-2 text-error"
                          aria-label="Remove technology"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-text-muted">
                Built-in icons already exist for: html, css, react, nextjs, typescript, nodejs, tailwind, bootstrap, wordpress, figma, aivideo, video-editing, canva, graphic-designer, git, github — just type that slug and the logo shows automatically. For any other technology, upload its own logo (SVG/PNG) using the small icon box on the left — the uploaded logo always takes priority over the slug.
              </p>
            </section>

            {/* ===== Services Preview items ===== */}
            <section className="space-y-4 rounded-xl border border-border bg-card p-6">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-semibold text-text-primary">Services Preview</h2>
                <button
                  type="button"
                  onClick={() =>
                    setContent({
                      ...content,
                      home: {
                        ...content.home,
                        servicesPreview: {
                          ...content.home.servicesPreview,
                          items: [
                            ...content.home.servicesPreview.items,
                            { id: crypto.randomUUID(), title: "New Service", description: "", features: [], iconKey: "globe", href: "/services" },
                          ],
                        },
                      },
                    })
                  }
                  className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs text-text-secondary hover:text-text-primary"
                >
                  <Plus className="h-4 w-4" /> Add service
                </button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <input value={content.home.servicesPreview.eyebrow} onChange={(e) => setContent({ ...content, home: { ...content.home, servicesPreview: { ...content.home.servicesPreview, eyebrow: e.target.value } } })} className={inputClass} placeholder="Eyebrow" />
                <input value={content.home.servicesPreview.title} onChange={(e) => setContent({ ...content, home: { ...content.home, servicesPreview: { ...content.home.servicesPreview, title: e.target.value } } })} className={inputClass} placeholder="Title" />
              </div>
              <textarea value={content.home.servicesPreview.description} onChange={(e) => setContent({ ...content, home: { ...content.home, servicesPreview: { ...content.home.servicesPreview, description: e.target.value } } })} rows={2} className={textareaClass} placeholder="Description" />

              <div className="space-y-3">
                {content.home.servicesPreview.items.map((svc, i) => (
                  <div key={svc.id} className="space-y-2 rounded-lg border border-border bg-surface p-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-medium text-text-muted">Service {i + 1}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const items = content.home.servicesPreview.items.filter((_, idx) => idx !== i);
                          setContent({ ...content, home: { ...content.home, servicesPreview: { ...content.home.servicesPreview, items } } });
                        }}
                        className="rounded-lg border border-border p-1.5 text-error"
                        aria-label="Remove service"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="grid gap-2 sm:grid-cols-[1fr_150px]">
                      <input
                        value={svc.title}
                        onChange={(e) => {
                          const items = [...content.home.servicesPreview.items];
                          items[i] = { ...items[i]!, title: e.target.value };
                          setContent({ ...content, home: { ...content.home, servicesPreview: { ...content.home.servicesPreview, items } } });
                        }}
                        className={inputClass}
                        placeholder="Service title"
                      />
                      <select
                        value={svc.iconKey}
                        onChange={(e) => {
                          const items = [...content.home.servicesPreview.items];
                          items[i] = { ...items[i]!, iconKey: e.target.value };
                          setContent({ ...content, home: { ...content.home, servicesPreview: { ...content.home.servicesPreview, items } } });
                        }}
                        className={inputClass}
                      >
                        {ICON_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>
                    <textarea
                      value={svc.description}
                      onChange={(e) => {
                        const items = [...content.home.servicesPreview.items];
                        items[i] = { ...items[i]!, description: e.target.value };
                        setContent({ ...content, home: { ...content.home, servicesPreview: { ...content.home.servicesPreview, items } } });
                      }}
                      rows={2}
                      className={textareaClass}
                      placeholder="Service description"
                    />
                    <input
                      value={svc.features.join(", ")}
                      onChange={(e) => {
                        const items = [...content.home.servicesPreview.items];
                        items[i] = { ...items[i]!, features: e.target.value.split(",").map((f) => f.trim()).filter(Boolean) };
                        setContent({ ...content, home: { ...content.home, servicesPreview: { ...content.home.servicesPreview, items } } });
                      }}
                      className={inputClass}
                      placeholder="Features, comma-separated"
                    />
                    <input
                      value={svc.href}
                      onChange={(e) => {
                        const items = [...content.home.servicesPreview.items];
                        items[i] = { ...items[i]!, href: e.target.value };
                        setContent({ ...content, home: { ...content.home, servicesPreview: { ...content.home.servicesPreview, items } } });
                      }}
                      className={inputClass}
                      placeholder="Link (e.g. /services)"
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* ===== Why Choose Me items ===== */}
            <section className="space-y-4 rounded-xl border border-border bg-card p-6">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-semibold text-text-primary">Why Choose Me</h2>
                <button
                  type="button"
                  onClick={() =>
                    setContent({
                      ...content,
                      home: {
                        ...content.home,
                        whyChooseMe: {
                          ...content.home.whyChooseMe,
                          items: [
                            ...content.home.whyChooseMe.items,
                            { id: crypto.randomUUID(), title: "New Reason", description: "", iconKey: "star" },
                          ],
                        },
                      },
                    })
                  }
                  className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs text-text-secondary hover:text-text-primary"
                >
                  <Plus className="h-4 w-4" /> Add reason
                </button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <input value={content.home.whyChooseMe.eyebrow} onChange={(e) => setContent({ ...content, home: { ...content.home, whyChooseMe: { ...content.home.whyChooseMe, eyebrow: e.target.value } } })} className={inputClass} placeholder="Eyebrow" />
                <input value={content.home.whyChooseMe.title} onChange={(e) => setContent({ ...content, home: { ...content.home, whyChooseMe: { ...content.home.whyChooseMe, title: e.target.value } } })} className={inputClass} placeholder="Title" />
              </div>
              <textarea value={content.home.whyChooseMe.description} onChange={(e) => setContent({ ...content, home: { ...content.home, whyChooseMe: { ...content.home.whyChooseMe, description: e.target.value } } })} rows={2} className={textareaClass} placeholder="Description" />

              <div className="grid gap-3 sm:grid-cols-2">
                {content.home.whyChooseMe.items.map((item, i) => (
                  <div key={item.id} className="space-y-2 rounded-lg border border-border bg-surface p-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-medium text-text-muted">Reason {i + 1}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const items = content.home.whyChooseMe.items.filter((_, idx) => idx !== i);
                          setContent({ ...content, home: { ...content.home, whyChooseMe: { ...content.home.whyChooseMe, items } } });
                        }}
                        className="rounded-lg border border-border p-1.5 text-error"
                        aria-label="Remove reason"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <input
                      value={item.title}
                      onChange={(e) => {
                        const items = [...content.home.whyChooseMe.items];
                        items[i] = { ...items[i]!, title: e.target.value };
                        setContent({ ...content, home: { ...content.home, whyChooseMe: { ...content.home.whyChooseMe, items } } });
                      }}
                      className={inputClass}
                      placeholder="Title"
                    />
                    <select
                      value={item.iconKey}
                      onChange={(e) => {
                        const items = [...content.home.whyChooseMe.items];
                        items[i] = { ...items[i]!, iconKey: e.target.value };
                        setContent({ ...content, home: { ...content.home, whyChooseMe: { ...content.home.whyChooseMe, items } } });
                      }}
                      className={inputClass}
                    >
                      {ICON_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                    <textarea
                      value={item.description}
                      onChange={(e) => {
                        const items = [...content.home.whyChooseMe.items];
                        items[i] = { ...items[i]!, description: e.target.value };
                        setContent({ ...content, home: { ...content.home, whyChooseMe: { ...content.home.whyChooseMe, items } } });
                      }}
                      rows={2}
                      className={textareaClass}
                      placeholder="Description"
                    />
                  </div>
                ))}
              </div>
            </section>
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
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="font-semibold text-text-primary">About Gallery Images</h2>
                <button
                  type="button"
                  onClick={() =>
                    setContent({
                      ...content,
                      about: {
                        ...content.about,
                        galleryPhotos: [
                          ...content.about.galleryPhotos,
                          { id: crypto.randomUUID(), src: "", alt: "Sameer Malik photo" },
                        ],
                      },
                    })
                  }
                  className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs text-text-secondary hover:text-text-primary"
                >
                  <Plus className="h-4 w-4" /> Add image
                </button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {content.about.galleryPhotos.map((photo, i) => (
                  <div key={photo.id} className="space-y-3 rounded-lg border border-border bg-surface p-4">
                    <ImageUploader
                      label={`Gallery image ${i + 1}`}
                      value={photo.src}
                      onChange={(url) => {
                        const galleryPhotos = [...content.about.galleryPhotos];
                        galleryPhotos[i] = { ...galleryPhotos[i]!, src: url };
                        setContent({ ...content, about: { ...content.about, galleryPhotos } });
                      }}
                      aspect="aspect-[4/5]"
                    />
                    <input
                      value={photo.alt}
                      onChange={(e) => {
                        const galleryPhotos = [...content.about.galleryPhotos];
                        galleryPhotos[i] = { ...galleryPhotos[i]!, alt: e.target.value };
                        setContent({ ...content, about: { ...content.about, galleryPhotos } });
                      }}
                      className={inputClass}
                      placeholder="Image alt text"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setContent({
                          ...content,
                          about: {
                            ...content.about,
                            galleryPhotos: content.about.galleryPhotos.filter((_, idx) => idx !== i),
                          },
                        })
                      }
                      className="flex items-center gap-2 text-xs text-error"
                    >
                      <Trash2 className="h-4 w-4" /> Remove image
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="mb-3 font-semibold text-text-primary">Skills & Client Points</h2>
              <textarea
                value={content.about.skills.join(", ")}
                onChange={(e) =>
                  setContent({
                    ...content,
                    about: {
                      ...content.about,
                      skills: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                    },
                  })
                }
                rows={3}
                className={textareaClass}
                placeholder="Skills, comma separated"
              />
              <textarea
                value={content.about.whyClientsChooseMe.join("\n")}
                onChange={(e) =>
                  setContent({
                    ...content,
                    about: {
                      ...content.about,
                      whyClientsChooseMe: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean),
                    },
                  })
                }
                rows={5}
                className={`${textareaClass} mt-3`}
                placeholder="One client point per line"
              />
            </div>
            {content.services.map((service, i) => (
              <div key={service.id} className="rounded-xl border border-border bg-card p-6">
                <h2 className="mb-3 font-semibold text-text-primary">Service: {service.title}</h2>
                <input value={service.title} onChange={(e) => { const s = [...content.services]; s[i] = { ...s[i]!, title: e.target.value }; setContent({ ...content, services: s }); }} className={`${inputClass} mb-3`} />
                <textarea value={service.shortDescription} onChange={(e) => { const s = [...content.services]; s[i] = { ...s[i]!, shortDescription: e.target.value }; setContent({ ...content, services: s }); }} rows={3} className={textareaClass} />
                <input
                  value={service.startingPrice}
                  onChange={(e) => { const s = [...content.services]; s[i] = { ...s[i]!, startingPrice: e.target.value }; setContent({ ...content, services: s }); }}
                  className={`${inputClass} mt-3`}
                  placeholder='Pricing (e.g. "Starting from $299" or "Custom quote — message me to discuss")'
                />
              </div>
            ))}

            {/* ===== Why Work With Me (Services page) ===== */}
            <section className="space-y-4 rounded-xl border border-border bg-card p-6">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-semibold text-text-primary">Why Work With Me (Services page)</h2>
                <button
                  type="button"
                  onClick={() =>
                    setContent({
                      ...content,
                      whyWorkWithMe: [
                        ...content.whyWorkWithMe,
                        { id: crypto.randomUUID(), title: "New Point", description: "" },
                      ],
                    })
                  }
                  className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs text-text-secondary hover:text-text-primary"
                >
                  <Plus className="h-4 w-4" /> Add point
                </button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {content.whyWorkWithMe.map((item, i) => (
                  <div key={item.id} className="space-y-2 rounded-lg border border-border bg-surface p-3">
                    <div className="flex items-center gap-2">
                      <input
                        value={item.title}
                        onChange={(e) => {
                          const items = [...content.whyWorkWithMe];
                          items[i] = { ...items[i]!, title: e.target.value };
                          setContent({ ...content, whyWorkWithMe: items });
                        }}
                        className={inputClass}
                        placeholder="Title"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const items = content.whyWorkWithMe.filter((_, idx) => idx !== i);
                          setContent({ ...content, whyWorkWithMe: items });
                        }}
                        className="shrink-0 rounded-lg border border-border p-2 text-error"
                        aria-label="Remove point"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <textarea
                      value={item.description}
                      onChange={(e) => {
                        const items = [...content.whyWorkWithMe];
                        items[i] = { ...items[i]!, description: e.target.value };
                        setContent({ ...content, whyWorkWithMe: items });
                      }}
                      rows={2}
                      className={textareaClass}
                      placeholder="Description"
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* ===== Development Process (About + Services pages) ===== */}
            <section className="space-y-4 rounded-xl border border-border bg-card p-6">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-semibold text-text-primary">Development Process (About & Services pages)</h2>
                <button
                  type="button"
                  onClick={() =>
                    setContent({
                      ...content,
                      developmentProcess: [
                        ...content.developmentProcess,
                        { id: crypto.randomUUID(), step: "New Step", description: "" },
                      ],
                    })
                  }
                  className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs text-text-secondary hover:text-text-primary"
                >
                  <Plus className="h-4 w-4" /> Add step
                </button>
              </div>
              <div className="space-y-3">
                {content.developmentProcess.map((step, i) => (
                  <div key={step.id} className="flex items-start gap-3 rounded-lg border border-border bg-surface p-3">
                    <span className="mt-2.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      {i + 1}
                    </span>
                    <div className="flex-1 space-y-2">
                      <input
                        value={step.step}
                        onChange={(e) => {
                          const items = [...content.developmentProcess];
                          items[i] = { ...items[i]!, step: e.target.value };
                          setContent({ ...content, developmentProcess: items });
                        }}
                        className={inputClass}
                        placeholder="Step name (e.g. Discover)"
                      />
                      <textarea
                        value={step.description}
                        onChange={(e) => {
                          const items = [...content.developmentProcess];
                          items[i] = { ...items[i]!, description: e.target.value };
                          setContent({ ...content, developmentProcess: items });
                        }}
                        rows={2}
                        className={textareaClass}
                        placeholder="Description"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const items = content.developmentProcess.filter((_, idx) => idx !== i);
                        setContent({ ...content, developmentProcess: items });
                      }}
                      className="mt-1 shrink-0 rounded-lg border border-border p-2 text-error"
                      aria-label="Remove step"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {tab === "portfolio" && (
          <div className="space-y-4">
            <button onClick={addProject} className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm text-text-secondary hover:text-text-primary">
              <Plus className="h-4 w-4" /> Add Project
            </button>
            {content.portfolio.map((project, i) => (
              <div key={project.slug} className="rounded-xl border border-border bg-card p-6">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="font-semibold text-text-primary">{project.title || "Untitled project"}</h2>
                  <button
                    onClick={() => {
                      if (confirm(`Delete project "${project.title || project.slug}"? This cannot be undone.`)) {
                        removeProject(i);
                      }
                    }}
                    className="text-error"
                    aria-label="Delete project"
                    title="Delete project"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="grid gap-6 sm:grid-cols-[220px_1fr]">
                  <ImageUploader
                    label="Project image"
                    value={project.image}
                    onChange={(url) => {
                      const p = [...content.portfolio];
                      p[i] = { ...p[i]!, image: url };
                      setContent({ ...content, portfolio: p });
                    }}
                    aspect="aspect-[4/3]"
                  />
                  <div className="space-y-3">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <input value={project.title} onChange={(e) => { const p = [...content.portfolio]; p[i] = { ...p[i]!, title: e.target.value }; setContent({ ...content, portfolio: p }); }} className={inputClass} placeholder="Title" />
                      <input
                        value={project.slug}
                        onChange={(e) => {
                          const p = [...content.portfolio];
                          p[i] = { ...p[i]!, slug: slugify(e.target.value) };
                          setContent({ ...content, portfolio: p });
                        }}
                        className={inputClass}
                        placeholder="URL slug (e.g. my-project)"
                      />
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <input value={project.subtitle} onChange={(e) => { const p = [...content.portfolio]; p[i] = { ...p[i]!, subtitle: e.target.value }; setContent({ ...content, portfolio: p }); }} className={inputClass} placeholder="Subtitle" />
                      <input value={project.projectUrl} onChange={(e) => { const p = [...content.portfolio]; p[i] = { ...p[i]!, projectUrl: e.target.value }; setContent({ ...content, portfolio: p }); }} className={inputClass} placeholder="Live URL (https://...)" />
                    </div>
                    <input
                      value={project.role}
                      onChange={(e) => { const p = [...content.portfolio]; p[i] = { ...p[i]!, role: e.target.value }; setContent({ ...content, portfolio: p }); }}
                      className={inputClass}
                      placeholder='Your role (e.g. "Developed while working at PascalineSoft" or "Freelance project — independent client")'
                    />
                    <textarea value={project.description} onChange={(e) => { const p = [...content.portfolio]; p[i] = { ...p[i]!, description: e.target.value }; setContent({ ...content, portfolio: p }); }} rows={2} className={textareaClass} placeholder="Short description (used for SEO/cards)" />
                    <textarea value={project.overview} onChange={(e) => { const p = [...content.portfolio]; p[i] = { ...p[i]!, overview: e.target.value }; setContent({ ...content, portfolio: p }); }} rows={2} className={textareaClass} placeholder="Overview" />
                    <textarea value={project.problem} onChange={(e) => { const p = [...content.portfolio]; p[i] = { ...p[i]!, problem: e.target.value }; setContent({ ...content, portfolio: p }); }} rows={2} className={textareaClass} placeholder="The Challenge / Problem" />
                    <textarea value={project.solution} onChange={(e) => { const p = [...content.portfolio]; p[i] = { ...p[i]!, solution: e.target.value }; setContent({ ...content, portfolio: p }); }} rows={2} className={textareaClass} placeholder="Solution" />
                    <textarea value={project.results} onChange={(e) => { const p = [...content.portfolio]; p[i] = { ...p[i]!, results: e.target.value }; setContent({ ...content, portfolio: p }); }} rows={2} className={textareaClass} placeholder="Results" />
                    <input
                      value={project.technologies.join(", ")}
                      onChange={(e) => {
                        const p = [...content.portfolio];
                        p[i] = {
                          ...p[i]!,
                          technologies: e.target.value
                            .split(",")
                            .map((t) => t.trim())
                            .filter(Boolean),
                        };
                        setContent({ ...content, portfolio: p });
                      }}
                      className={inputClass}
                      placeholder="Technologies (comma separated, e.g. Next.js, Tailwind, Stripe)"
                    />
                  </div>
                </div>
              </div>
            ))}
            {content.portfolio.length === 0 && (
              <p className="text-sm text-text-muted">No projects yet — click &ldquo;Add Project&rdquo; to create one.</p>
            )}
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
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="mb-1 text-sm font-semibold text-text-primary">
                Reviews carousel speed
              </h3>
              <p className="mb-3 text-xs text-text-muted">
                Only 3 reviews show on the homepage at a time. Once there are
                more than 3, they auto-scroll — choose how many seconds each
                set stays on screen before moving to the next (visitors can
                also use the arrow buttons to move back/forward manually).
              </p>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={2}
                  max={60}
                  value={content.settings.testimonialAutoScrollSeconds}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      settings: {
                        ...content.settings,
                        testimonialAutoScrollSeconds: Math.max(
                          2,
                          Number(e.target.value) || 6
                        ),
                      },
                    })
                  }
                  className={`${inputClass} max-w-[120px]`}
                />
                <span className="text-xs text-text-muted">seconds</span>
              </div>
            </div>

            {pendingReviews.length > 0 && (
              <div className="space-y-3 rounded-xl border border-accent/40 bg-accent/5 p-5">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-text-primary">
                  <Star className="h-4 w-4 text-accent" /> Pending reviews ({pendingReviews.length})
                </h3>
                <p className="text-xs text-text-muted">
                  Submitted from the &quot;Leave a Review&quot; page. Approve to publish, or reject to discard.
                </p>
                {pendingReviews.map((r) => (
                  <div key={r.id} className="rounded-lg border border-border bg-card p-4">
                    <div className="mb-2 flex items-center gap-1">
                      {Array.from({ length: r.rating }).map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-accent text-accent" />
                      ))}
                    </div>
                    <p className="text-sm text-text-secondary">&ldquo;{r.quote}&rdquo;</p>
                    <p className="mt-2 text-xs font-medium text-text-primary">
                      {r.author}
                      {r.role ? <span className="text-text-muted"> — {r.role}</span> : null}
                    </p>
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => approveReview(r.id)}
                        disabled={pendingBusyId === r.id}
                        className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white disabled:opacity-60"
                      >
                        Approve & publish
                      </button>
                      <button
                        onClick={() => rejectReview(r.id)}
                        disabled={pendingBusyId === r.id}
                        className="rounded-lg border border-border px-3 py-1.5 text-xs text-error disabled:opacity-60"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button onClick={addTestimonial} className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm text-text-secondary hover:text-text-primary">
              <Plus className="h-4 w-4" /> Add Testimonial
            </button>
            {content.testimonials.map((item, i) => (
              <div key={item.id} className="rounded-xl border border-border bg-card p-6">
                <div className="mb-3 flex justify-between">
                  <span className="text-sm font-medium text-text-muted">Testimonial {i + 1}</span>
                  <button onClick={() => setContent({ ...content, testimonials: content.testimonials.filter((t) => t.id !== item.id) })} className="text-error"><Trash2 className="h-4 w-4" /></button>
                </div>
                <div className="grid gap-6 sm:grid-cols-[140px_1fr]">
                  <ImageUploader
                    label="Client photo"
                    value={item.image ?? ""}
                    onChange={(url) => { const t = [...content.testimonials]; t[i] = { ...t[i]!, image: url }; setContent({ ...content, testimonials: t }); }}
                    aspect="aspect-square"
                  />
                  <div className="space-y-3">
                    <textarea value={item.quote} onChange={(e) => { const t = [...content.testimonials]; t[i] = { ...t[i]!, quote: e.target.value }; setContent({ ...content, testimonials: t }); }} rows={3} className={textareaClass} placeholder="Quote" />
                    <div className="grid gap-3 sm:grid-cols-3">
                      <input value={item.author} onChange={(e) => { const t = [...content.testimonials]; t[i] = { ...t[i]!, author: e.target.value }; setContent({ ...content, testimonials: t }); }} className={inputClass} placeholder="Author name" />
                      <input value={item.role} onChange={(e) => { const t = [...content.testimonials]; t[i] = { ...t[i]!, role: e.target.value }; setContent({ ...content, testimonials: t }); }} className={inputClass} placeholder="Role / Company" />
                      <input type="number" min={1} max={5} value={item.rating} onChange={(e) => { const t = [...content.testimonials]; t[i] = { ...t[i]!, rating: Number(e.target.value) }; setContent({ ...content, testimonials: t }); }} className={inputClass} placeholder="Rating 1-5" />
                    </div>
                  </div>
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
                Upload a logo image, or replace/delete the current one.
              </p>
              <div className="grid gap-4 sm:grid-cols-[160px_1fr]">
                <ImageUploader
                  value={content.settings.branding.logoSrc}
                  onChange={(url) =>
                    setContent({
                      ...content,
                      settings: {
                        ...content.settings,
                        branding: {
                          ...content.settings.branding,
                          logoSrc: url,
                        },
                      },
                    })
                  }
                  aspect="aspect-square"
                />
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
                  <label className="mb-1 mt-4 block text-sm text-text-secondary">
                    Logo size — {content.settings.branding.logoWidth ?? 104}px wide
                  </label>
                  <input
                    type="range"
                    min={60}
                    max={280}
                    step={5}
                    value={content.settings.branding.logoWidth ?? 104}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        settings: {
                          ...content.settings,
                          branding: {
                            ...content.settings.branding,
                            logoWidth: Number(e.target.value),
                          },
                        },
                      })
                    }
                    className="w-full accent-primary"
                  />
                  <p className="mt-1 text-xs text-text-muted">
                    Drag to make the logo bigger or smaller across the whole site. Save to apply.
                  </p>
                </div>
              </div>
            </section>

            <section className="space-y-4 rounded-xl border border-border bg-card p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="font-semibold text-text-primary">Header Navigation</h2>
                  <p className="mt-1 text-xs text-text-muted">These links show in the top menu and footer quick links.</p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setContent({
                      ...content,
                      settings: {
                        ...content.settings,
                        navLinks: [...content.settings.navLinks, { label: "New Link", href: "/" }],
                      },
                    })
                  }
                  className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs text-text-secondary hover:text-text-primary"
                >
                  <Plus className="h-4 w-4" /> Add link
                </button>
              </div>
              <div className="space-y-3">
                {content.settings.navLinks.map((link, i) => (
                  <div key={`${link.href}-${i}`} className="grid gap-3 rounded-lg border border-border bg-surface p-4 sm:grid-cols-[1fr_1fr_auto]">
                    <input
                      value={link.label}
                      onChange={(e) => {
                        const navLinks = [...content.settings.navLinks];
                        navLinks[i] = { ...navLinks[i]!, label: e.target.value };
                        setContent({ ...content, settings: { ...content.settings, navLinks } });
                      }}
                      className={inputClass}
                      placeholder="Label"
                    />
                    <input
                      value={link.href}
                      onChange={(e) => {
                        const navLinks = [...content.settings.navLinks];
                        navLinks[i] = { ...navLinks[i]!, href: e.target.value };
                        setContent({ ...content, settings: { ...content.settings, navLinks } });
                      }}
                      className={inputClass}
                      placeholder="/about"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setContent({
                          ...content,
                          settings: {
                            ...content.settings,
                            navLinks: content.settings.navLinks.filter((_, idx) => idx !== i),
                          },
                        })
                      }
                      className="rounded-lg border border-border p-2 text-error"
                      aria-label="Remove navigation link"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-4 rounded-xl border border-border bg-card p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="font-semibold text-text-primary">Footer Content</h2>
                  <p className="mt-1 text-xs text-text-muted">Edit the footer intro and legal/utility links.</p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setContent({
                      ...content,
                      settings: {
                        ...content.settings,
                        footerLinks: [...content.settings.footerLinks, { label: "New Footer Link", href: "/" }],
                      },
                    })
                  }
                  className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs text-text-secondary hover:text-text-primary"
                >
                  <Plus className="h-4 w-4" /> Add footer link
                </button>
              </div>
              <textarea
                value={content.settings.footerDescription}
                onChange={(e) =>
                  setContent({
                    ...content,
                    settings: { ...content.settings, footerDescription: e.target.value },
                  })
                }
                rows={3}
                className={textareaClass}
                placeholder="Footer description"
              />
              <div className="space-y-3">
                {content.settings.footerLinks.map((link, i) => (
                  <div key={`${link.href}-${i}`} className="grid gap-3 rounded-lg border border-border bg-surface p-4 sm:grid-cols-[1fr_1fr_auto]">
                    <input
                      value={link.label}
                      onChange={(e) => {
                        const footerLinks = [...content.settings.footerLinks];
                        footerLinks[i] = { ...footerLinks[i]!, label: e.target.value };
                        setContent({ ...content, settings: { ...content.settings, footerLinks } });
                      }}
                      className={inputClass}
                      placeholder="Label"
                    />
                    <input
                      value={link.href}
                      onChange={(e) => {
                        const footerLinks = [...content.settings.footerLinks];
                        footerLinks[i] = { ...footerLinks[i]!, href: e.target.value };
                        setContent({ ...content, settings: { ...content.settings, footerLinks } });
                      }}
                      className={inputClass}
                      placeholder="/privacy-policy"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setContent({
                          ...content,
                          settings: {
                            ...content.settings,
                            footerLinks: content.settings.footerLinks.filter((_, idx) => idx !== i),
                          },
                        })
                      }
                      className="rounded-lg border border-border p-2 text-error"
                      aria-label="Remove footer link"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="font-semibold text-text-primary">Page Header Backgrounds</h2>
              <p className="text-xs text-text-muted">
                Each page header uses a background image. Upload one, or replace/delete the current one.
              </p>
              {(Object.keys(pageHeaderLabels) as PageHeaderKey[]).map((key) => (
                <div key={key} className="rounded-xl border border-border bg-card p-5">
                  <h3 className="mb-3 text-sm font-medium text-text-primary">
                    {pageHeaderLabels[key]}
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-[220px_1fr]">
                    <ImageUploader
                      value={content.settings.pageHeaders[key].src}
                      onChange={(url) => {
                        const pageHeaders = { ...content.settings.pageHeaders };
                        pageHeaders[key] = {
                          ...pageHeaders[key],
                          src: url,
                        };
                        setContent({
                          ...content,
                          settings: { ...content.settings, pageHeaders },
                        });
                      }}
                      aspect="aspect-video"
                    />
                    <div>
                      <label className="mb-1 block text-sm text-text-secondary">Image description (SEO)</label>
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
                  </div>
                </div>
              ))}
            </section>

            <section className="space-y-4">
              <h2 className="font-semibold text-text-primary">Page Header Text</h2>
              <p className="text-xs text-text-muted">
                The eyebrow, title, and description shown in the banner at the top of each page.
              </p>
              {(Object.keys(pageHeroTextLabels) as PageHeroTextKey[]).map((key) => (
                <div key={key} className="space-y-2 rounded-xl border border-border bg-card p-5">
                  <h3 className="text-sm font-medium text-text-primary">
                    {pageHeroTextLabels[key]}
                  </h3>
                  <input
                    value={content.settings.pageHeroText[key].eyebrow}
                    onChange={(e) => {
                      const pageHeroText = { ...content.settings.pageHeroText };
                      pageHeroText[key] = { ...pageHeroText[key], eyebrow: e.target.value };
                      setContent({ ...content, settings: { ...content.settings, pageHeroText } });
                    }}
                    className={inputClass}
                    placeholder="Eyebrow (small label above the title, optional)"
                  />
                  <input
                    value={content.settings.pageHeroText[key].title}
                    onChange={(e) => {
                      const pageHeroText = { ...content.settings.pageHeroText };
                      pageHeroText[key] = { ...pageHeroText[key], title: e.target.value };
                      setContent({ ...content, settings: { ...content.settings, pageHeroText } });
                    }}
                    className={inputClass}
                    placeholder="Title"
                  />
                  <textarea
                    value={content.settings.pageHeroText[key].description}
                    onChange={(e) => {
                      const pageHeroText = { ...content.settings.pageHeroText };
                      pageHeroText[key] = { ...pageHeroText[key], description: e.target.value };
                      setContent({ ...content, settings: { ...content.settings, pageHeroText } });
                    }}
                    rows={2}
                    className={textareaClass}
                    placeholder="Description"
                  />
                </div>
              ))}
            </section>
          </div>
        )}

        {tab === "social" && (
          <div className="space-y-4">
            <section className="rounded-xl border border-border bg-card p-6">
              <h2 className="mb-1 font-semibold text-text-primary">Social Links</h2>
              <p className="mb-5 text-xs text-text-muted">
                These show up as icon buttons in the footer. Pick a platform (sets
                the icon), then set the URL it should link to.
              </p>

              <div className="space-y-4">
                {content.settings.socialLinks.map((link, i) => (
                  <div
                    key={link.id}
                    className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-4 sm:flex-row sm:items-center"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border text-text-secondary">
                      <SocialIcon platform={link.platform} className="h-[18px] w-[18px]" />
                    </div>
                    <select
                      value={link.platform}
                      onChange={(e) => {
                        const links = [...content.settings.socialLinks];
                        links[i] = { ...links[i]!, platform: e.target.value };
                        setContent({
                          ...content,
                          settings: { ...content.settings, socialLinks: links },
                        });
                      }}
                      className={`${inputClass} sm:w-40`}
                    >
                      {SOCIAL_PLATFORMS.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.label}
                        </option>
                      ))}
                    </select>
                    <input
                      value={link.label}
                      onChange={(e) => {
                        const links = [...content.settings.socialLinks];
                        links[i] = { ...links[i]!, label: e.target.value };
                        setContent({
                          ...content,
                          settings: { ...content.settings, socialLinks: links },
                        });
                      }}
                      className={`${inputClass} sm:w-40`}
                      placeholder="Label (e.g. GitHub)"
                    />
                    <input
                      value={link.href}
                      onChange={(e) => {
                        const links = [...content.settings.socialLinks];
                        links[i] = { ...links[i]!, href: e.target.value };
                        setContent({
                          ...content,
                          settings: { ...content.settings, socialLinks: links },
                        });
                      }}
                      className={`${inputClass} flex-1`}
                      placeholder="https://..."
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const links = content.settings.socialLinks.filter(
                          (_, idx) => idx !== i
                        );
                        setContent({
                          ...content,
                          settings: { ...content.settings, socialLinks: links },
                        });
                      }}
                      className="rounded-lg border border-border p-2 text-error"
                      aria-label="Remove social link"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => {
                  const newLink: SocialLink = {
                    id: crypto.randomUUID(),
                    platform: "custom",
                    label: "New Link",
                    href: "",
                  };
                  setContent({
                    ...content,
                    settings: {
                      ...content.settings,
                      socialLinks: [...content.settings.socialLinks, newLink],
                    },
                  });
                }}
                className="mt-4 flex items-center gap-2 rounded-lg border border-dashed border-border px-4 py-2.5 text-sm text-text-secondary hover:border-primary hover:text-primary"
              >
                <Plus className="h-4 w-4" /> Add social link
              </button>
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

        {tab === "settings" && (
          <div className="space-y-4 rounded-xl border border-border bg-card p-6">
            <h2 className="font-semibold text-text-primary">SEO & Search Console</h2>
            <p className="text-xs text-text-muted">
              These connect your site to Google Search Console, Bing Webmaster Tools, and (optionally) Google Tag Manager — so the site can rank and be tracked properly. Paste only the verification code itself, not the full HTML tag.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm text-text-secondary">Google Search Console verification code</label>
                <input
                  value={content.settings.seo.googleSiteVerification}
                  onChange={(e) => setContent({ ...content, settings: { ...content.settings, seo: { ...content.settings.seo, googleSiteVerification: e.target.value } } })}
                  className={inputClass}
                  placeholder="e.g. Y4snnMZUcOQAHqt3d7Q5..."
                />
                <p className="mt-1 text-xs text-text-muted">
                  From search.google.com/search-console → Settings → Ownership verification → HTML tag → copy just the &ldquo;content&rdquo; value.
                </p>
              </div>
              <div>
                <label className="mb-1 block text-sm text-text-secondary">Bing Webmaster Tools verification code</label>
                <input
                  value={content.settings.seo.bingSiteVerification}
                  onChange={(e) => setContent({ ...content, settings: { ...content.settings, seo: { ...content.settings.seo, bingSiteVerification: e.target.value } } })}
                  className={inputClass}
                  placeholder="From bing.com/webmasters"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-text-secondary">Google Tag Manager ID (optional)</label>
                <input
                  value={content.settings.seo.googleTagManagerId}
                  onChange={(e) => setContent({ ...content, settings: { ...content.settings, seo: { ...content.settings.seo, googleTagManagerId: e.target.value } } })}
                  className={inputClass}
                  placeholder="GTM-XXXXXXX"
                />
                <p className="mt-1 text-xs text-text-muted">Only needed if you use GTM instead of / alongside plain GA4.</p>
              </div>
              <div>
                <label className="mb-1 block text-sm text-text-secondary">Pinterest domain verification (optional)</label>
                <input
                  value={content.settings.seo.pinterestVerification}
                  onChange={(e) => setContent({ ...content, settings: { ...content.settings, seo: { ...content.settings.seo, pinterestVerification: e.target.value } } })}
                  className={inputClass}
                  placeholder="From Pinterest business account"
                />
              </div>
            </div>
          </div>
        )}

        {tab === "account" && (
          <div className="space-y-6">
            <div className="space-y-4 rounded-xl border border-border bg-card p-6">
              <h2 className="font-semibold text-text-primary">Your profile</h2>
              <div className="grid gap-4 sm:grid-cols-[160px_1fr]">
                <ImageUploader
                  label="Profile picture"
                  value={myAvatar}
                  onChange={setMyAvatar}
                  aspect="aspect-square"
                />
                <div className="space-y-3">
                  <div>
                    <label className="mb-1 block text-sm text-text-secondary">Email (used for 2FA codes)</label>
                    <input
                      type="email"
                      value={myEmail}
                      onChange={(e) => setMyEmail(e.target.value)}
                      className={inputClass}
                      placeholder="you@example.com"
                    />
                  </div>
                  {profileMessage && <p className="text-sm text-text-secondary">{profileMessage}</p>}
                  <button
                    onClick={saveMyProfile}
                    disabled={profileSaving}
                    className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-text-primary hover:border-primary/40 disabled:opacity-60"
                  >
                    {profileSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                    Save profile
                  </button>
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <h3 className="mb-1 text-sm font-semibold text-text-primary">Authenticator app (2FA)</h3>
                <p className="mb-3 text-xs text-text-muted">
                  Current status:{" "}
                  <span className="text-text-secondary">
                    {myTwoFactor.totpVerified ? "Connected" : "Not set up"} — required method:{" "}
                    {myTwoFactor.method === "none" ? "Not required" : myTwoFactor.method}
                  </span>
                </p>
                {!totpQr ? (
                  <button
                    onClick={startTotpSetup}
                    disabled={totpBusy}
                    className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-text-primary hover:border-primary/40 disabled:opacity-60"
                  >
                    {totpBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                    {myTwoFactor.totpVerified ? "Re-connect authenticator app" : "Set up authenticator app"}
                  </button>
                ) : (
                  <div className="max-w-xs space-y-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={totpQr} alt="Scan with your authenticator app" className="h-40 w-40 rounded-lg bg-white p-2" />
                    <p className="break-all text-xs text-text-muted">Manual key: {totpSecret}</p>
                    <input
                      inputMode="numeric"
                      maxLength={6}
                      value={totpCode}
                      onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ""))}
                      className={inputClass}
                      placeholder="Enter 6-digit code"
                    />
                    <button
                      onClick={confirmTotpSetup}
                      disabled={totpBusy || totpCode.length < 6}
                      className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white disabled:opacity-60"
                    >
                      Confirm & activate
                    </button>
                  </div>
                )}
                {totpMessage && <p className="mt-2 text-sm text-text-secondary">{totpMessage}</p>}
              </div>
            </div>

            <div className="space-y-4 rounded-xl border border-border bg-card p-6">
              <h2 className="font-semibold text-text-primary">Change your username / password</h2>
              <p className="text-xs text-text-muted">
                This updates the login you&apos;re currently signed in with.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm text-text-secondary">Current password</label>
                  <PasswordInput
                    value={accountForm.currentPassword}
                    onChange={(v) => setAccountForm({ ...accountForm, currentPassword: v })}
                    className={inputClass}
                    placeholder="Current password"
                    autoComplete="current-password"
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
                  <PasswordInput
                    value={accountForm.newPassword}
                    onChange={(v) => setAccountForm({ ...accountForm, newPassword: v })}
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
                <PasswordInput
                  value={newUserForm.password}
                  onChange={(v) => setNewUserForm({ ...newUserForm, password: v })}
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
                <input
                  type="email"
                  value={newUserForm.email}
                  onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                  className={inputClass}
                  placeholder="Email (optional, needed for email 2FA)"
                />
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
                  <p className="text-xs font-medium text-text-muted">
                    All accounts — set who needs two-factor login here
                  </p>
                  {users.map((u) => (
                    <div key={u.username} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border px-4 py-3 text-sm">
                      <div className="flex items-center gap-3">
                        {u.avatarUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={u.avatarUrl} alt="" className="h-8 w-8 rounded-full object-cover" />
                        ) : (
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs text-primary">
                            {u.username.slice(0, 1).toUpperCase()}
                          </div>
                        )}
                        <span className="text-text-primary">
                          {u.username} <span className="text-text-muted">— {u.role}{u.isBuiltin ? " · built-in" : ""}</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <select
                          value={u.twoFactor.method}
                          onChange={(e) => updateUserTwoFactor(u.username, e.target.value as TwoFactorInfo["method"])}
                          className="rounded-lg border border-border bg-surface px-2 py-1.5 text-xs text-text-primary"
                        >
                          <option value="none">2FA: off</option>
                          <option value="email">2FA: email code</option>
                          <option value="totp">2FA: authenticator app</option>
                          <option value="both">2FA: both (user&apos;s choice)</option>
                        </select>
                        {!u.isBuiltin && (
                          <button onClick={() => removeUser(u.username)} className="text-text-muted hover:text-error">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
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
              <BlogPostEditor
                value={newPost}
                onChange={setNewPost}
                inputClass={inputClass}
                textareaClass={textareaClass}
              />
              <label className="mt-4 flex items-center gap-2 text-sm text-text-secondary">
                <input type="checkbox" checked={newPost.published} onChange={(e) => setNewPost({ ...newPost, published: e.target.checked })} /> Publish
              </label>
              <button onClick={createPost} disabled={saving} className="mt-4 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white">Create Post</button>
            </section>
            {posts.map((post) => (
              <div key={post.id} className="rounded-xl border border-border bg-card p-5">
                {editingPost?.id === post.id && editingForm ? (
                  <div className="space-y-3">
                    <BlogPostEditor
                      value={editingForm}
                      onChange={setEditingForm}
                      postId={post.id}
                      inputClass={inputClass}
                      textareaClass={textareaClass}
                    />
                    <label className="flex items-center gap-2 text-sm text-text-secondary">
                      <input type="checkbox" checked={editingForm.published} onChange={(e) => setEditingForm({ ...editingForm, published: e.target.checked })} /> Published
                    </label>
                    <div className="flex gap-2">
                      <button onClick={() => updatePost(post, editingForm)} className="rounded-lg bg-primary px-4 py-2 text-sm text-white">Save</button>
                      <button onClick={() => { setEditingPost(null); setEditingForm(null); }} className="rounded-lg border border-border px-4 py-2 text-sm">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-text-primary">{post.title}</h3>
                      <p className="text-xs text-text-muted">{post.category} · {post.published ? "Live" : "Draft"} · /{post.slug}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { setEditingPost(post); setEditingForm(blogPostToForm(post)); }} className="rounded-lg border border-border p-2"><Edit3 className="h-4 w-4" /></button>
                      <button onClick={() => deletePost(post.id)} className="rounded-lg border border-border p-2 text-error"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {tab === "media" && <MediaLibraryTab inputClass={inputClass} />}

        {tab === "pages" && (
          <CustomPagesTab inputClass={inputClass} textareaClass={textareaClass} />
        )}
        </div>
      </div>
    </div>
  );
}
