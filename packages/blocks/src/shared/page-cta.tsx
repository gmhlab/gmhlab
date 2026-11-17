import {
  Button,
  FigureBand,
  Flex,
  Section,
  TextSubheading,
  TextTitlePage,
} from "@gmhlab/ui";
import { Aurora } from "./lit";
import type { PageAction, PageCta } from "./page-copy";
import "./page-cta.css";

/* Internal to @gmhlab/blocks — the barrel exports only the copy types. */

/** `nativeButton={false}` is required whenever `render` swaps the element —
 *  Base UI otherwise keeps native button semantics and logs on every render.
 *
 *  `lit` sets the actions for a lit (navy) surface: the primary becomes the
 *  gold accent with the workspace's sweep of light, the others glass. */
export function PageActions({
  actions,
  align,
  lit = false,
}: {
  actions: PageAction[];
  align?: "center";
  lit?: boolean;
}) {
  if (!actions.length) return null;
  return (
    <Flex wrap gap="400" alignPrimary={align === "center" ? "center" : undefined}>
      {actions.map((action) => {
        const primary = (action.variant ?? "default") === "default";
        return (
          <Button
            key={action.label}
            size={lit ? "lg" : undefined}
            variant={lit ? (primary ? "accent" : "outline") : action.variant}
            className={
              lit ? (primary ? "lit-cta-button lit-shine" : "page-cta-glass") : undefined
            }
            nativeButton={false}
            render={<a href={action.href} />}
          >
            {action.label}
          </Button>
        );
      })}
    </Flex>
  );
}

/**
 * The closing CTA every page block ends on: a lit card — the workspace's
 * navy, aurora light and grain — on a stage inset from the viewport edges,
 * so every page closes on the same light the home page does.
 *
 * TextTitlePage (3rem), not TextContentTitle — that resolves to TextTitleHero
 * (4.5rem) on desktop, which would match the page's H1 and make the CTA read
 * as a second page title. Paired with TextSubheading (1.25rem) rather than
 * TextSubtitle (2rem), which at this size competes with the heading.
 *
 * It opens on the graphics kit's figure band — a short row of people, one in
 * three in gold — so every page ends on the people the work is for.
 *
 * `variant` is the stage's ground: the band the card floats on, so it can
 * continue the section above it (`neutral`, `tint`) or sit on the page
 * (the default). `brand` puts it on a lit navy band.
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
    <div className="lit-stage page-cta-stage" data-ground={variant ?? "paper"}>
      <Section variant="brand" padding="1600" className="page-cta lit-hero">
        <Aurora />
        <Flex
          container
          direction="column"
          alignPrimary="center"
          alignSecondary="center"
          gap="800"
        >
          <FigureBand className="page-cta-figures" />
          <Flex direction="column" alignSecondary="center" gap="200">
            <TextTitlePage className="text-align-center">{heading}</TextTitlePage>
            {body ? (
              <TextSubheading
                className={[copyClassName, "page-cta-copy", "text-align-center"]
                  .filter(Boolean)
                  .join(" ")}
              >
                {body}
              </TextSubheading>
            ) : null}
          </Flex>
          <PageActions actions={actions} align="center" lit />
        </Flex>
      </Section>
    </div>
  );
}
