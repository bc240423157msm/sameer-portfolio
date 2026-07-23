"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Code2, GraduationCap, Globe2 } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { MotionReveal } from "@/components/common/MotionReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";

// PROFILE PHOTOS — drop your files in /public with these exact names:
//   /public/sameermalik.webp   → main photo (large)
//   /public/sameermalik1.webp  → small accent photo (bottom-left)
//   /public/sameermalik2.webp  → small accent photo (top-right)

const highlights = [
  {
    icon: Code2,
    label: "Full Stack Developer & AI Automation Specialist",
  },
  {
    icon: GraduationCap,
    label: "BSCS student, sharpening the fundamentals every day",
  },
  {
    icon: Globe2,
    label: "Remote — working with clients worldwide",
  },
];

export function AboutIntro() {
  return (
    <section className="border-b border-border/60 py-24">
      <Container>
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <MotionReveal
            direction="right"
            className="relative mx-auto w-full max-w-md lg:mx-0"
          >
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl border border-border/60 bg-card/40">
              <Image
                src="/sameermalik.webp"
                alt="Sameer Malik — Full Stack Web Developer"
                fill
                sizes="(max-width: 1024px) 80vw, 40vw"
                className="object-cover"
              />
            </div>

            <div className="absolute -bottom-8 -left-6 hidden h-28 w-28 overflow-hidden rounded-2xl border-4 border-background shadow-xl sm:block">
              <Image
                src="/sameermalik1.webp"
                alt="Sameer Malik at work"
                fill
                sizes="112px"
                className="object-cover"
              />
            </div>

            <div className="absolute -right-6 -top-6 hidden h-24 w-24 overflow-hidden rounded-2xl border-4 border-background shadow-xl sm:block">
              <Image
                src="/sameermalik2.webp"
                alt="Sameer Malik's development setup"
                fill
                sizes="96px"
                className="object-cover"
              />
            </div>
          </MotionReveal>

          <MotionReveal delay={0.1}>
            <SectionHeading eyebrow="Meet the Developer" title="Hi, I'm Sameer Malik" />

            <div className="mt-6 space-y-4 text-text-secondary leading-relaxed">
              <p>
                I&apos;m a Full Stack Web Developer and AI Automation Specialist
                working with clients around the world. What started as curiosity
                about how websites and apps actually work turned into a genuine
                passion for building tools that solve real business problems.
              </p>
              <p>
                Today, I help startups, agencies, and small businesses ship
                faster websites, smarter automation, and better customer
                experiences — without the headaches that usually come with
                hiring a developer.
              </p>
            </div>

            <ul className="mt-8 space-y-3">
              {highlights.map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="flex items-center gap-3 text-sm text-text-secondary"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" />
                  </span>
                  {label}
                </li>
              ))}
            </ul>

            <div className="mt-10">
              <Button href="/about" variant="secondary">
                More About Me
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </MotionReveal>
        </div>
      </Container>
    </section>
  );
}
