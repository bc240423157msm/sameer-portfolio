import { Container } from "@/components/layout/Container";
import { PortfolioCardSkeleton } from "@/components/ui/Skeleton";

export default function PortfolioLoading() {
  return (
    <section className="py-24">
      <Container>
        <div className="space-y-16">
          {Array.from({ length: 3 }).map((_, i) => (
            <PortfolioCardSkeleton key={i} />
          ))}
        </div>
      </Container>
    </section>
  );
}
