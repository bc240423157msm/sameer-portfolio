"use client";

import { Container } from "@/components/layout/Container";
import { EditableImage } from "@/components/common/EditableImage";
import { EditableText } from "@/components/common/EditableText";
import type { PageHeaderContent } from "@/types/content";
import type { PageHeaderKey } from "@/lib/page-headers";
import { cn } from "@/utils/cn";

export interface PageHeroCopyPaths {
  eyebrow?: string;
  title?: string;
  description?: string;
}

export interface PageHeroClientProps {
  variant: PageHeaderKey;
  header: PageHeaderContent;
  className?: string;
  priority?: boolean;
  /** Defaults to settings.pageHeaders.{variant} for each field */
  copyPaths?: PageHeroCopyPaths;
  eyebrow?: string;
  title: string;
  description: string;
}

export function PageHeroClient({
  variant,
  header,
  className,
  eyebrow,
  title,
  description,
  copyPaths,
}: PageHeroClientProps) {
  const defaultPrefix = `settings.pageHeaders.${variant}`;
  const eyebrowPath = copyPaths?.eyebrow ?? `${defaultPrefix}.eyebrow`;
  const titlePath = copyPaths?.title ?? `${defaultPrefix}.title`;
  const descriptionPath =
    copyPaths?.description ?? `${defaultPrefix}.description`;
  const displayEyebrow = eyebrow ?? header.eyebrow;

  return (
    <section
      className={cn(
        "relative flex min-h-[400px] items-center overflow-hidden border-b border-border/60 sm:min-h-[460px]",
        className
      )}
      aria-label={title}
    >
      <EditableImage
        contentPath={`${defaultPrefix}.src`}
        src={header.src}
        alt={header.alt}
        fill
        sizes="100vw"
        className="absolute inset-0"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/88 to-background/60" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-background/55" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />

      <Container className="relative z-10 py-20 sm:py-28">
        <div className="max-w-3xl">
          {displayEyebrow && (
            <EditableText
              contentPath={eyebrowPath}
              as="p"
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-4 py-1.5 text-sm font-medium text-accent backdrop-blur-md"
            >
              <span
                className="h-1.5 w-1.5 rounded-full bg-accent"
                aria-hidden
              />
              {displayEyebrow}
            </EditableText>
          )}
          <EditableText
            contentPath={titlePath}
            as="h1"
            className="text-balance text-4xl font-semibold tracking-tight text-text-primary drop-shadow-sm sm:text-5xl lg:text-6xl"
          >
            {title}
          </EditableText>
          <EditableText
            contentPath={descriptionPath}
            as="p"
            className="mt-6 max-w-2xl text-lg leading-relaxed text-text-secondary"
          >
            {description}
          </EditableText>
        </div>
      </Container>
    </section>
  );
}
