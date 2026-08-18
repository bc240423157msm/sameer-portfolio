"use client";

import { useState } from "react";
import { ImageSpotlight } from "@/components/common/ImageSpotlight";
import { ImageLightbox } from "@/components/common/ImageLightbox";
import type { SiteContent } from "@/types/content";

type Project = SiteContent["portfolio"][number];

interface PortfolioImageProps {
  project: Project;
  allProjects: Project[];
  projectIndex: number;
}

export function PortfolioImage({
  project,
  allProjects,
  projectIndex,
}: PortfolioImageProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(projectIndex);

  const images = allProjects.map((p) => ({
    src: p.image,
    alt: `${p.title} — ${p.subtitle}`,
  }));

  return (
    <>
      <div className="relative h-56 w-full sm:h-64">
        <ImageSpotlight
          src={project.image}
          alt={`${project.title} — ${project.subtitle}`}
          sizes="100vw"
          fallbackSrc="/work.webp"
          onClick={() => {
            setLightboxIndex(projectIndex);
            setLightboxOpen(true);
          }}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/50 to-background/10" />
        <div className="pointer-events-none absolute bottom-6 left-6 right-6 sm:bottom-8 sm:left-8">
          <h2 className="text-3xl font-semibold text-text-primary drop-shadow">
            {project.title}
          </h2>
          <p className="mt-2 text-text-secondary drop-shadow">{project.subtitle}</p>
        </div>
      </div>

      {lightboxOpen && (
        <ImageLightbox
          images={images}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
          onNavigate={setLightboxIndex}
        />
      )}
    </>
  );
}
