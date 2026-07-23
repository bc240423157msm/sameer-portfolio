import { Container } from "@/components/layout/Container";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description: string;
}

export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <section className="border-b border-border/60 py-24">
      <Container>
        <div className="max-w-2xl">
          {eyebrow && (
            <p className="mb-4 text-sm font-medium tracking-wide text-accent">
              {eyebrow}
            </p>
          )}
          <h1 className="text-balance text-4xl font-semibold text-text-primary sm:text-5xl">
            {title}
          </h1>
          <p className="mt-5 text-lg text-text-secondary">{description}</p>
        </div>
      </Container>
    </section>
  );
}
