import { Link } from "react-router";
import { Card, Flex, Section, Text, TextCode, TextHeading } from "@gmhlab/ui";

/**
 * What a `:slug` route renders when the fixture has no record for it.
 *
 * This is the failure the `detailSlugs` prop exists to prevent: an index that
 * links every card into a detail route it has no record for. `InnovationsPage`
 * and `ProjectDetailPage` take that prop and link selectively; `ProjectsPage`
 * does not, so its cards all link and five of the six land here.
 */
export function MissingDetail({
  slug,
  kind,
  indexPath,
}: {
  slug: string;
  /** "project" | "innovation" — used in the prose. */
  kind: string;
  indexPath: string;
}) {
  return (
    <Section variant="subtle" padding="1600">
      <Flex container direction="column" gap="600" alignSecondary="stretch">
        <Card variant="stroke" padding="800">
          <TextHeading>No detail record for “{slug}”</TextHeading>
          <Text>
            The docs fixture carries one {kind} detail record, and this is not
            it. That is the point of the demo rather than a broken link: a
            detail page is a record plus a route, so a slug with no record has
            no page — which is why{" "}
            <TextCode>InnovationsPage</TextCode> and{" "}
            <TextCode>ProjectDetailPage</TextCode> take a{" "}
            <TextCode>detailSlugs</TextCode> prop and link only the slugs in it.
          </Text>
          <Text>
            <TextCode>ProjectsPage</TextCode> has no such prop — every card
            links — so an app mounting it either writes a record for every
            project or accepts this page.
          </Text>
          <Flex gap="400" wrap>
            <Link to={indexPath} className="text-sm underline underline-offset-4">
              ← Back to the index
            </Link>
            <Link to="/blocks" className="text-sm underline underline-offset-4">
              Back to Blocks
            </Link>
          </Flex>
        </Card>
      </Flex>
    </Section>
  );
}
