"use client";

import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { ImageSpotlight } from "@/components/common/ImageSpotlight";
import { EditableImage } from "@/components/common/EditableImage";
import { TiltCard } from "@/components/common/TiltCard";
import { Badge } from "@/components/ui/Badge";
import type { SiteContent } from "@/types/content";

type Project = SiteContent["portfolio"][number];

interface FeaturedProjectCardProps {
  project: Project;
  /** When provided, the cover image becomes admin-editable at
   * `portfolio.{projectIndex}.image` (used on the homepage's featured
   * projects grid). Omit on pages where the image shouldn't be editable
   * inline. */
  projectIndex?: number;
}

export function FeaturedProjectCard({
  project,
  projectIndex,
}: FeaturedProjectCardProps) {
  return (
    <TiltCard className="h-full">
      <Link
        href="/portfolio"
        className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/40 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
      >
        <div className="relative h-48 w-full">
          {projectIndex !== undefined ? (
            <EditableImage
              contentPath={`portfolio.${projectIndex}.image`}
              src={project.image}
              alt={`${project.title} — ${project.subtitle}`}
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          ) : (
            <ImageSpotlight
              src={project.image}
              alt={`${project.title} — ${project.subtitle}`}
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/40 to-background/10" />
          <div className="pointer-events-none absolute bottom-4 left-4 right-4">
            <p className="text-lg font-semibold text-text-primary drop-shadow">
              {project.title}
            </p>
            <p className="mt-0.5 text-sm text-text-secondary drop-shadow">
              {project.subtitle}
            </p>
          </div>
          <div className="pointer-events-none absolute right-4 top-4 rounded-lg border border-border/60 bg-background/60 p-2 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
            <ExternalLink className="h-4 w-4 text-text-secondary" />
          </div>
        </div>

        <div className="flex flex-1 flex-col p-6">
          <p className="flex-1 text-sm leading-relaxed text-text-secondary">
            {project.description}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <Badge key={tech}>{tech}</Badge>
            ))}
          </div>
          <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-accent transition-colors group-hover:text-primary">
            View Project
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </Link>
    </TiltCard>
  );
}
