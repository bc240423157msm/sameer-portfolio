"use client";

import { Container } from "@/components/layout/Container";
import { MotionReveal } from "@/components/common/MotionReveal";
import { AnimatedCounter } from "@/components/common/AnimatedCounter";
import { SectionHeading } from "@/components/ui/SectionHeading";

const stats = [
  { value: 3, suffix: "+", label: "Years Experience" },
  { value: 25, suffix: "+", label: "Projects Delivered" },
  { value: 15, suffix: "+", label: "Happy Clients" },
  { value: 10, suffix: "+", label: "Technologies" },
];

export function StatsSection() {
  return (
    <section className="border-b border-border/60 py-16">
      <Container>
        <MotionReveal>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-primary sm:text-4xl">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="mt-2 text-sm text-text-secondary">{stat.label}</p>
              </div>
            ))}
          </div>
        </MotionReveal>
      </Container>
    </section>
  );
}
