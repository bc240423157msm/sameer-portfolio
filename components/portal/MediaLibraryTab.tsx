"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Loader2, Trash2 } from "lucide-react";

interface MediaLibraryTabProps {
  inputClass: string;
}

type MediaItem = {
  url: string;
  uploadedAt: string;
  usedIn: string[];
};

export function MediaLibraryTab({ inputClass }: MediaLibraryTabProps) {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  async function load() {
    setLoading(true);
    const res = await fetch("/api/media");
    const data = res.ok ? await res.json() : { media: [] };
    setMedia(data.media ?? []);
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);

  async function remove(url: string) {
    if (!confirm("Remove from media library?")) return;
    await fetch(`/api/media?url=${encodeURIComponent(url)}`, { method: "DELETE" });
    setMedia((prev) => prev.filter((m) => m.url !== url));
  }

  const filtered = media.filter((m) =>
    m.url.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search images…"
        className={inputClass}
      />
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-text-muted">
          No uploads yet. Images appear here when uploaded from the blog editor or portfolio tab.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <div
              key={item.url}
              className="overflow-hidden rounded-xl border border-border bg-card"
            >
              <div className="relative aspect-video">
                <Image src={item.url} alt="" fill sizes="300px" className="object-cover" />
              </div>
              <div className="space-y-2 p-3">
                <p className="truncate text-xs text-text-muted">{item.url}</p>
                {item.usedIn.length > 0 && (
                  <p className="text-xs text-text-secondary">
                    Used in: {item.usedIn.join(", ")}
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => remove(item.url)}
                  className="flex items-center gap-1 text-xs text-error"
                >
                  <Trash2 className="h-3 w-3" /> Remove from library
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
