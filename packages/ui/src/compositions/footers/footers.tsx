import { useMediaQuery } from "../../hooks";
import { IconInstagram, IconLinkedin, IconXLogo, IconYoutube } from "../../icons";
import { Flex, FlexItem, Section, type SectionProps } from "../../layouts";
import {
  Button,
  GmhLogo,
  TextLink,
  TextLinkList,
  TextListItem,
  TextStrong,
} from "../../primitives";

export type FooterProps = Omit<SectionProps, "variant" | "padding" | "src">;
export function Footer({ className, ...props }: FooterProps) {
  const { isTabletDown } = useMediaQuery();
  const listDensity = isTabletDown ? "tight" : "default";
  return (
    <Section
      elementType="footer"
      variant="brand"
      paddingTop="1600"
      paddingBottom="4000"
      style={{ marginTop: "auto" }}
      {...props}
    >
      <Flex wrap type="quarter" gap="600" container>
        <FlexItem size="minor">
          <Flex direction="column" gap="600" alignSecondary="start">
            <FlexItem>
              <GmhLogo className="footer-logo" />
            </FlexItem>
            <FlexItem>
              <SocialButtons />
            </FlexItem>
          </Flex>
        </FlexItem>
        <TextLinkList
          density={listDensity}
          title={<TextStrong>Use cases</TextStrong>}
        >
          <TextListItem>
            <TextLink href="#">UI design</TextLink>
          </TextListItem>
          <TextListItem>
            <TextLink href="#">UX design</TextLink>
          </TextListItem>
          <TextListItem>
            <TextLink href="#">Wireframing</TextLink>
          </TextListItem>
          <TextListItem>
            <TextLink href="#">Diagramming</TextLink>
          </TextListItem>
          <TextListItem>
            <TextLink href="#">Brainstorming</TextLink>
          </TextListItem>
          <TextListItem>
            <TextLink href="#">Online whiteboard</TextLink>
          </TextListItem>
          <TextListItem>
            <TextLink href="#">Team collaboration</TextLink>
          </TextListItem>
        </TextLinkList>
        <TextLinkList
          density={listDensity}
          title={<TextStrong>Explore</TextStrong>}
        >
          <TextListItem>
            <TextLink href="#">Design</TextLink>
          </TextListItem>
          <TextListItem>
            <TextLink href="#">Prototyping</TextLink>
          </TextListItem>
          <TextListItem>
            <TextLink href="#">Development features</TextLink>
          </TextListItem>
          <TextListItem>
            <TextLink href="#">Design systems</TextLink>
          </TextListItem>
          <TextListItem>
            <TextLink href="#">Collaboration features</TextLink>
          </TextListItem>
          <TextListItem>
            <TextLink href="#">Design process</TextLink>
          </TextListItem>
          <TextListItem>
            <TextLink href="#">FigJam</TextLink>
          </TextListItem>
        </TextLinkList>
        <TextLinkList
          density={listDensity}
          title={<TextStrong>Resources</TextStrong>}
        >
          <TextListItem>
            <TextLink href="#">Blog</TextLink>
          </TextListItem>
          <TextListItem>
            <TextLink href="#">Best practices</TextLink>
          </TextListItem>
          <TextListItem>
            <TextLink href="#">Colors</TextLink>
          </TextListItem>
          <TextListItem>
            <TextLink href="#">Color wheel</TextLink>
          </TextListItem>
          <TextListItem>
            <TextLink href="#">Support</TextLink>
          </TextListItem>
          <TextListItem>
            <TextLink href="#">Developers</TextLink>
          </TextListItem>
          <TextListItem>
            <TextLink href="#">Resource library</TextLink>
          </TextListItem>
        </TextLinkList>
      </Flex>
    </Section>
  );
}

export function SocialButtons() {
  return (
    <Flex alignSecondary="center" gap="100">
      <Button
        size="icon"
        variant="ghost"
        nativeButton={false}
        aria-label="X"
        className="rounded-full hover:[--icon-color:var(--mfy-color-icon-default-default)]"
        render={<a href="https://www.x.com/figma" />}
      >
        <IconXLogo />
      </Button>
      <Button
        size="icon"
        variant="ghost"
        nativeButton={false}
        aria-label="Instagram"
        className="rounded-full hover:[--icon-color:var(--mfy-color-icon-default-default)]"
        render={<a href="https://instagram.com/figma" />}
      >
        <IconInstagram />
      </Button>
      <Button
        size="icon"
        variant="ghost"
        nativeButton={false}
        aria-label="YouTube"
        className="rounded-full hover:[--icon-color:var(--mfy-color-icon-default-default)]"
        render={<a href="https://www.youtube.com/@Figma" />}
      >
        <IconYoutube />
      </Button>
      <Button
        size="icon"
        variant="ghost"
        nativeButton={false}
        aria-label="LinkedIn"
        className="rounded-full hover:[--icon-color:var(--mfy-color-icon-default-default)]"
        render={<a href="https://www.linkedin.com/company/figma/" />}
      >
        <IconLinkedin />
      </Button>
    </Flex>
  );
}
