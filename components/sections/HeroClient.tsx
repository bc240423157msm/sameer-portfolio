"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { MotionReveal } from "@/components/common/MotionReveal";
import { RotatingCube } from "@/components/common/RotatingCube";
import type { HeaderImage } from "@/lib/page-headers";
import type { SiteBranding } from "@/types/content";

interface HeroClientProps {
  hero: {
    tagline: string;
    headline: string;
    description: string;
  };
  headerImage: HeaderImage;
  branding: SiteBranding;
}

export function HeroClient({ hero, headerImage, branding }: HeroClientProps) {
  return (
    <section className="relative overflow-hidden border-b border-border/60 py-24 sm:py-32 lg:py-40">
      <Image
        src={headerImage.src}
        alt={headerImage.alt}
        fill
        priority
        quality={80}
        className="object-cover object-center"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/70" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-background/50" />
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -right-32 top-1/4 h-64 w-64 rounded-full bg-primary/15 blur-[100px]" />
        <div className="absolute bottom-0 left-1/4 h-48 w-48 rounded-full bg-accent/10 blur-[80px]" />
      </div>

      <Container className="relative z-10">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <MotionReveal>
              <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-4 py-1.5 text-sm font-medium text-accent backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                {hero.tagline}
              </p>
            </MotionReveal>

            <MotionReveal delay={0.1}>
              <h1 className="text-balance text-4xl font-semibold tracking-tight text-text-primary sm:text-5xl lg:text-6xl">
                {hero.headline.split(" ").length > 4 ? (
                  <>
                    {hero.headline.split(" ").slice(0, -2).join(" ")}{" "}
                    <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      {hero.headline.split(" ").slice(-2).join(" ")}
                    </span>
                  </>
                ) : (
                  hero.headline
                )}
              </h1>
            </MotionReveal>

            <MotionReveal delay={0.2}>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-text-secondary">
                {hero.description}
              </p>
            </MotionReveal>

            <MotionReveal delay={0.3}>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Button href="/contact" size="lg">
                  Hire Me
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button href="/portfolio" variant="secondary" size="lg">
                  View Portfolio
                </Button>
              </div>
            </MotionReveal>

            <MotionReveal delay={0.4}>
              <p className="mt-8 text-sm text-text-muted">
                Freelance website design, WordPress development, and WhatsApp bot
                specialist trusted by startups, agencies, and businesses worldwide.
              </p>
            </MotionReveal>
          </div>

          <MotionReveal delay={0.2} direction="left" className="flex justify-center lg:justify-end">
            <div className="relative flex flex-col items-center">
              <motion.div
                className="absolute -inset-10 rounded-full bg-gradient-to-br from-primary/20 via-violet/10 to-accent/20 blur-3xl"
                animate={{ opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                aria-hidden
              />
              <div className="relative">
                <RotatingCube />

                <div className="absolute -bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full border border-border/60 bg-card/90 px-4 py-2 shadow-xl shadow-primary/10 backdrop-blur-sm">
                  <Image
                    src={branding.logoSrc}
                    alt={branding.logoAlt}
                    width={20}
                    height={20}
                    className="h-5 w-5"
                  />
                  <span className="text-xs font-medium text-text-secondary">
                    Website Design · WordPress · WhatsApp Bots
                  </span>
                </div>
              </div>
            </div>
          </MotionReveal>
        </div>
      </Container>
    </section>
  );
}
