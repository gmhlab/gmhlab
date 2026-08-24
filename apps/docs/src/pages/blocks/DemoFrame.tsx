import type { ReactNode } from "react";
import { Link } from "react-router";
import { Badge, Flex, Section, Text, TextCode, TextSmall } from "@gmhlab/ui";

/**
 * The strip above every live page-block demo.
 *
 * The blocks themselves render page content only — no header, no footer, no
 * way back — because the site chrome belongs to the app that mounts them. This
 * supplies the docs app's own way back, plus the call site's props, so the demo
 * is readable as documentation rather than just as a page.
 *
 * It sits *outside* the block, never inside it: anything rendered within the
 * block's own root would inherit the page-scoped CSS it ships with.
 */
export function DemoFrame({
  component,
  blurb,
  props,
  children,
}: {
  /** The exported component name, e.g. "ProjectsPage". */
  component: string;
  blurb: string;
  /** The props this route passes, as source. */
  props: string;
  children: ReactNode;
}) {
  return (
    <>
      <Section variant="neutral" padding="600">
        <Flex container direction="column" gap="400" alignSecondary="stretch">
          <Flex gap="300" alignSecondary="center" wrap>
            <TextCode>{`<${component} />`}</TextCode>
            <Badge variant="secondary">@gmhlab/blocks</Badge>
            <Badge variant="outline">synthetic records</Badge>
            <Link to="/blocks" className="text-sm underline underline-offset-4">
              ← Back to Blocks
            </Link>
          </Flex>
          <Text>{blurb}</Text>
          <TextSmall>
            Records come from <TextCode>src/fixtures/sample-content.ts</TextCode>
            . Everything below the strip is the block, unmodified.
          </TextSmall>
          <pre className="overflow-x-auto rounded-md border border-border bg-card p-4 text-xs leading-relaxed text-card-foreground">
            <code>{props}</code>
          </pre>
        </Flex>
      </Section>
      {children}
    </>
  );
}
