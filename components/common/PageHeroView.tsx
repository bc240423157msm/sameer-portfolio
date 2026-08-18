import Image from "next/image";
import { Container } from "@/components/layout/Container";
import type { HeaderImage } from "@/lib/page-headers";
import { isLocalPublicImage, resolveImageSrc } from "@/lib/image-src";
import { cn } from "@/utils/cn";

export interface PageHeroViewProps {
  eyebrow?: string;
  title: string;
  description: string;
  image: HeaderImage;
  className?: string;
  priority?: boolean;
}

export function PageHeroView({
  eyebrow,
  title,
  description,
  image,
  className,
  priority = false,
}: PageHeroViewProps) {
  const heroSrc = resolveImageSrc(image.src);

  return (
    <section
      className={cn(
        "relative flex min-h-[400px] items-center overflow-hidden border-b border-border/60 sm:min-h-[460px]",
        className
      )}
      aria-label={title}
    >
      <Image
        src={heroSrc}
        alt={image.alt}
        fill
        priority={priority}
        loading={priority ? undefined : "lazy"}
        quality={80}
        unoptimized={isLocalPublicImage(heroSrc)}
        className="object-cover object-center scale-105"
        sizes="100vw"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/88 to-background/60" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-background/55" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />

      <Container className="relative z-10 py-20 sm:py-28">
        <div className="max-w-3xl">
          {eyebrow && (
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-4 py-1.5 text-sm font-medium text-accent backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
              {eyebrow}
            </p>
          )}
          <h1 className="text-balance text-4xl font-semibold tracking-tight text-text-primary drop-shadow-sm sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-text-secondary">
            {description}
          </p>
        </div>
      </Container>
    </section>
  );
}
