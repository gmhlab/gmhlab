import { useMediaQuery } from "@gmhlab/ui";
import { Flex, Section, FlexItem } from "@gmhlab/ui";
import { Button, Field, Input, TextContentTitle } from "@gmhlab/ui";

export function WelcomeHero() {
  const { isMobile } = useMediaQuery();
  const sectionPadding = isMobile ? "600" : "1600";
  const flexGap = isMobile ? "600" : "1200";

  return (
    <Section padding={sectionPadding} variant="stroke">
      <Flex
        container
        wrap
        gap={flexGap}
        direction="column"
        alignPrimary="center"
        alignSecondary="center"
        type="third"
      >
        <TextContentTitle
          align="center"
          title="Welcome Home"
          subtitle={<>We're happy to have&nbsp;you.</>}
        />
        <FlexItem>
          <Field orientation="horizontal">
            <Input type="search" placeholder="Search..." />
            <Button>Search</Button>
          </Field>
        </FlexItem>
      </Flex>
    </Section>
  );
}