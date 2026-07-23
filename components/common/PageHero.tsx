import { getSiteContent } from "@/lib/data";
import {
  defaultPageHeaders,
  type PageHeaderKey,
} from "@/lib/page-headers";
import { PageHeroView, type PageHeroViewProps } from "./PageHeroView";

type PageHeroProps = Omit<PageHeroViewProps, "image"> & {
  variant: PageHeaderKey;
};

export async function PageHero({ variant, ...props }: PageHeroProps) {
  const content = await getSiteContent();
  const image =
    content.settings.pageHeaders[variant] ?? defaultPageHeaders[variant];

  return <PageHeroView {...props} image={image} />;
}
