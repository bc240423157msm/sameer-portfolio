"use client";

import { Calendar, ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { MotionReveal } from "@/components/common/MotionReveal";
import { Button } from "@/components/ui/Button";

interface CTASectionProps {
  calendlyUrl?: string;
}

export function CTASection({ calendlyUrl }: CTASectionProps) {
  return (
    <section className="py-24">
      <Container>
        <MotionReveal>
          <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/60 px-8 py-16 text-center backdrop-blur-sm sm:px-16 sm:py-20">
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10"
              aria-hidden
            />

            <div className="relative">
              <h2 className="text-balance text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
                Ready for a Website Design or Redesign?
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-lg text-text-secondary">
                Whether you need a new business website, a WordPress redesign, a
                WhatsApp bot, or an AI chatbot — let&apos;s discuss your project
                and build something that drives results.
              </p>

              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button href="/contact" size="lg">
                  Hire Me
                  <ArrowRight className="h-4 w-4" />
                </Button>
                {calendlyUrl ? (
                  <Button href={calendlyUrl} variant="secondary" size="lg">
                    <Calendar className="h-4 w-4" />
                    Schedule a Call
                  </Button>
                ) : (
                  <Button href="/contact" variant="secondary" size="lg">
                    <Calendar className="h-4 w-4" />
                    Schedule a Call
                  </Button>
                )}
              </div>
            </div>
          </div>
        </MotionReveal>
      </Container>
    </section>
  );
}
