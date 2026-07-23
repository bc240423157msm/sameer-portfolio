import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="flex min-h-[60vh] items-center py-24">
      <Container className="text-center">
        <p className="text-sm font-medium text-accent">404</p>
        <h1 className="mt-4 text-4xl font-semibold text-text-primary sm:text-5xl">
          Page not found
        </h1>
        <p className="mx-auto mt-4 max-w-md text-text-secondary">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button href="/">Go Home</Button>
          <Link
            href="/contact"
            className="text-sm font-medium text-accent transition-colors hover:text-primary"
          >
            Contact Support
          </Link>
        </div>
      </Container>
    </section>
  );
}
