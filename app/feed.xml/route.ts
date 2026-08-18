import { getPublishedBlogPosts } from "@/lib/data";
import { siteConfig } from "@/lib/site-config";

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function cdata(value: string) {
  return `<![CDATA[${value.replaceAll("]]>", "]]]]><![CDATA[>")}]]>`;
}

export async function GET() {
  const posts = await getPublishedBlogPosts();

  const items = posts
    .map(
      (post) => `
    <item>
      <title>${cdata(post.title)}</title>
      <link>${siteConfig.url}/blog/${post.slug}</link>
      <guid isPermaLink="true">${siteConfig.url}/blog/${post.slug}</guid>
      <description>${cdata(post.excerpt)}</description>
      <pubDate>${new Date(post.createdAt).toUTCString()}</pubDate>
      <category>${escapeXml(post.category)}</category>
    </item>`
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${siteConfig.name} Blog</title>
    <link>${siteConfig.url}/blog</link>
    <description>${siteConfig.description}</description>
    <language>en-us</language>
    <atom:link href="${siteConfig.url}/feed.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}
