import { Container } from "@/components/layout/Container";
import { BlogCardSkeleton } from "@/components/ui/Skeleton";

export default function BlogLoading() {
  return (
    <section className="py-24">
      <Container>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <BlogCardSkeleton key={i} />
          ))}
        </div>
      </Container>
    </section>
  );
}
