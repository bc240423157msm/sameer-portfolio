import { cn } from "@/utils/cn";
import { EditableText } from "@/components/common/EditableText";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
  /** When set, eyebrow/title/description render as EditableText wired to
   * `${contentPathPrefix}.eyebrow` / `.title` / `.description`, so admins can
   * edit this section's heading directly on the page. */
  contentPathPrefix?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
  contentPathPrefix,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow &&
        (contentPathPrefix ? (
          <EditableText
            contentPath={`${contentPathPrefix}.eyebrow`}
            as="p"
            className="mb-3 text-sm font-medium tracking-wide text-accent"
          >
            {eyebrow}
          </EditableText>
        ) : (
          <p className="mb-3 text-sm font-medium tracking-wide text-accent">
            {eyebrow}
          </p>
        ))}
      {contentPathPrefix ? (
        <EditableText
          contentPath={`${contentPathPrefix}.title`}
          as="h2"
          className="text-balance text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl"
        >
          {title}
        </EditableText>
      ) : (
        <h2 className="text-balance text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
          {title}
        </h2>
      )}
      {description &&
        (contentPathPrefix ? (
          <EditableText
            contentPath={`${contentPathPrefix}.description`}
            as="p"
            className="mt-4 text-lg text-text-secondary"
          >
            {description}
          </EditableText>
        ) : (
          <p className="mt-4 text-lg text-text-secondary">{description}</p>
        ))}
    </div>
  );
}
