import {
  Button,
  Flex,
  Section,
  TextSubheading,
  TextTitlePage,
} from "@gmhlab/ui";
import type { PageAction, PageCta } from "./page-copy";

/* Internal to @gmhlab/blocks — the barrel exports only the copy types. */

/** `nativeButton={false}` is required whenever `render` swaps the element —
 *  Base UI otherwise keeps native button semantics and logs on every render. */
export function PageActions({
  actions,
  align,
}: {
  actions: PageAction[];
  align?: "center";
}) {
  if (!actions.length) return null;
  return (
    <Flex wrap gap="400" alignPrimary={align === "center" ? "center" : undefined}>
      {actions.map((action) => (
        <Button
          key={action.label}
          variant={action.variant}
          nativeButton={false}
          render={<a href={action.href} />}
        >
          {action.label}
        </Button>
      ))}
    </Flex>
  );
}

/**
 * The closing CTA band every page block ends on.
 *
 * TextTitlePage (3rem), not TextContentTitle — that resolves to TextTitleHero
 * (4.5rem) on desktop, which would match the page's H1 and make the CTA read
 * as a second page title. Paired with TextSubheading (1.25rem) rather than
 * TextSubtitle (2rem), which at this size competes with the heading.
 *
 * `copyClassName` is the page's own measure cap for the paragraph — only the
 * paragraph is capped, since capping the wrapper would break the heading onto
 * two lines.
 */
export function PageCtaSection({
  cta,
  variant,
  copyClassName,
}: {
  cta: PageCta;
  variant?: "brand" | "neutral" | "subtle" | "tint";
  copyClassName?: string;
}) {
  const { heading, body, actions = [] } = cta;
  return (
    <Section variant={variant} padding="1600">
      <Flex
        container
        direction="column"
        alignPrimary="center"
        alignSecondary="center"
        gap="800"
      >
        <Flex direction="column" alignSecondary="center" gap="200">
          <TextTitlePage className="text-align-center">{heading}</TextTitlePage>
          {body ? (
            <TextSubheading
              className={[copyClassName, "text-align-center"]
                .filter(Boolean)
                .join(" ")}
            >
              {body}
            </TextSubheading>
          ) : null}
        </Flex>
        <PageActions actions={actions} align="center" />
      </Flex>
    </Section>
  );
}
