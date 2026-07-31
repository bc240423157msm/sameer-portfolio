import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/JsonLd";
import { Container } from "@/components/layout/Container";
import { MotionReveal } from "@/components/common/MotionReveal";
import { getCustomPages } from "@/lib/data";
import { breadcrumbJsonLd, createPageMetadata, webPageJsonLd } from "@/lib/seo";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const pages = await getCustomPages();
  return pages.filter((p) => p.published).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const pages = await getCustomPages();
  const page = pages.find((p) => p.slug === slug && p.published);
  if (!page) return {};

  return createPageMetadata({
    title: page.title,
    description: page.metaDescription,
    path: `/pages/${slug}`,
  });
}

export const revalidate = 3600;

export default async function CustomPage({ params }: PageProps) {
  const { slug } = await params;
  const pages = await getCustomPages();
  const page = pages.find((p) => p.slug === slug && p.published);

  if (!page) notFound();

  return (
    <section className="py-24">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: page.title, path: `/pages/${page.slug}` },
          ]),
          webPageJsonLd({
            title: page.title,
            description: page.metaDescription,
            path: `/pages/${page.slug}`,
          }),
        ]}
      />
      <Container className="max-w-3xl">
        <MotionReveal>
          <h1 className="text-4xl font-semibold text-text-primary">
            {page.title}
          </h1>
        </MotionReveal>

        <div className="mt-12 space-y-8">
          {page.blocks.map((block) => (
            <MotionReveal key={block.id}>
              {block.type === "heading" && (
                <h2 className="text-2xl font-semibold text-text-primary">
                  {block.text}
                </h2>
              )}
              {block.type === "paragraph" && (
                <p className="leading-relaxed text-text-secondary">
                  {block.text}
                </p>
              )}
              {block.type === "image" && block.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={block.imageUrl}
                  alt={block.imageAlt ?? ""}
                  className="w-full rounded-2xl"
                />
              )}
            </MotionReveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
