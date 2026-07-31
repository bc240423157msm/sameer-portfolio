import type { Metadata } from "next";
import Image from "next/image";
import {
  Briefcase,
  GraduationCap,
  CheckCircle2,
  Code2,
} from "lucide-react";
import { PageHero } from "@/components/common/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { CTASectionWrapper } from "@/components/sections/CTASectionWrapper";
import { developmentProcess } from "@/lib/copy";
import { getSiteContent } from "@/lib/data";
import { breadcrumbJsonLd, createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "About",
  description:
    "Learn about Sameer Malik — website design, website redesign, WordPress, WhatsApp bot & AI chatbot developer for international clients.",
  path: "/about",
  keywords: ["Website Design", "Website Redesign", "WordPress Developer"],
});

export const revalidate = 3600;

export default async function AboutPage() {
  const content = await getSiteContent();
  const { about } = content;

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ])}
      />
      <PageHero
        variant="about"
        priority
        eyebrow="About Me"
        title="The developer behind the code"
        description="A closer look at my background, experience, and the approach I bring to every project."
      />

      <section className="py-24">
        <Container>
          <div className="grid gap-16 lg:grid-cols-2">
            <div>
              <SectionHeading
                eyebrow="My Story"
                title="From curiosity to craft"
              />
              <div className="mt-6 space-y-4 text-text-secondary leading-relaxed">
                {about.personalStory.split("\n\n").map((para) => (
                  <p key={para.slice(0, 40)}>{para}</p>
                ))}
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-border/60 bg-card/40 backdrop-blur-sm">
              <div className="relative h-44 w-full">
                <Image
                  src="/about-details.webp"
                  alt="Sameer Malik — development work in detail"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
              </div>
              <div className="p-8">
              <div className="flex items-center gap-3 text-primary">
                <Briefcase className="h-5 w-5" />
                <h3 className="font-semibold text-text-primary">Experience</h3>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-text-secondary">
                {about.experience}
              </p>

              <div className="mt-8 flex items-center gap-3 text-accent">
                <GraduationCap className="h-5 w-5" />
                <h3 className="font-semibold text-text-primary">Education</h3>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-text-secondary">
                {about.education}
              </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-y border-border/60 bg-surface/50 py-24">
        <Container>
          <SectionHeading
            eyebrow="Skills"
            title="Technologies I work with"
            description="A full-stack toolkit for building modern web applications and automation systems."
            align="center"
            className="mx-auto"
          />
          <div className="mt-12 flex flex-wrap justify-center gap-3">
            {about.skills.map((skill) => (
              <Badge key={skill} className="px-4 py-2 text-sm">
                {skill}
              </Badge>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-24">
        <Container>
          <SectionHeading
            eyebrow="Why Clients Choose Me"
            title="More than just code"
            align="center"
            className="mx-auto"
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {about.whyClientsChooseMe.map((point) => (
              <div
                key={point}
                className="flex gap-4 rounded-xl border border-border/60 bg-card/40 p-6"
              >
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                <p className="text-sm leading-relaxed text-text-secondary">
                  {point}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-24">
        <Container>
          <SectionHeading
            eyebrow="Behind the Scenes"
            title="A few more moments"
            align="center"
            className="mx-auto"
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {[
              { src: "/sameermalik2.webp", alt: "Sameer Malik working" },
              { src: "/hover_image_show.webp", alt: "Sameer Malik at his desk" },
              { src: "/sameermalik7.webp", alt: "Sameer Malik — freelance developer" },
            ].map((photo) => (
              <div
                key={photo.src}
                className="group relative aspect-[4/5] overflow-hidden rounded-2xl border border-border/60 bg-card/40"
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                />
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-border/60 bg-surface/50 py-24">
        <Container>
          <SectionHeading
            eyebrow="Process"
            title="How I work"
            description="A clear, structured approach from first conversation to launch and beyond."
            align="center"
            className="mx-auto"
          />
          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {developmentProcess.map((step, i) => (
              <div
                key={step.step}
                className="relative rounded-xl border border-border/60 bg-card/40 p-6"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 font-semibold text-text-primary">
                  {step.step}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-24">
        <Container>
          <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-primary/10 to-accent/5 p-8 sm:p-12">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/20 text-primary">
                <Code2 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-text-primary">
                  Remote Web Developer — Website Design & Automation
                </h3>
                <p className="mt-3 max-w-2xl leading-relaxed text-text-secondary">
                  As a freelance developer, I work with international clients on
                  Upwork, Fiverr, and direct contracts — delivering website design,
                  website redesign, WordPress, React, Next.js, and WhatsApp bot
                  solutions with clear communication and reliable delivery.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <CTASectionWrapper />
    </>
  );
}
