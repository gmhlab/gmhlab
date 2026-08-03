import { useMediaQuery } from "@gmhlab/ui";
import { Flex, FlexItem, Section } from "@gmhlab/ui";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  TextContentHeading,
} from "@gmhlab/ui";

export function FAQs() {
  const { isMobile } = useMediaQuery();
  const flexGap = isMobile ? "600" : "1200";
  const sectionPadding = isMobile ? "600" : "1600";
  return (
    <Section padding={sectionPadding} variant="neutral">
      <Flex container direction="column" alignSecondary="stretch" gap={flexGap}>
        <TextContentHeading
          align="center"
          heading="Frequently Asked Questions"
          subheading="Find answers to common questions about Simple Design System"
        />
        <Flex container type="third" alignPrimary="center">
          <FlexItem size="major">
            <Accordion>
              <AccordionItem value="what-is-sds">
                <AccordionTrigger>
                  What is Simple Design System (SDS)?
                </AccordionTrigger>
                <AccordionContent>
                  SDS is a React-based design system that provides accessible,
                  production-ready UI components, design tokens, and Figma
                  integration for demonstrating how to build consistent user
                  interfaces efficiently.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="install">
                <AccordionTrigger>
                  How do I install SDS in my project?
                </AccordionTrigger>
                <AccordionContent>
                  It is not distributed yet, but you can use it directly, by
                  cloning the repository at{" "}
                  <a href="https://github.com/figma/sds">github.com/figma/sds</a>
                  . Refer to the documentation for setup instructions and usage
                  examples.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="dark-mode">
                <AccordionTrigger>Does SDS support dark mode?</AccordionTrigger>
                <AccordionContent>
                  Yes, SDS includes full support for light and dark modes using
                  CSS custom properties. It automatically adapts to the user's
                  system preferences.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="tokens">
                <AccordionTrigger>
                  Can I customize the design tokens?
                </AccordionTrigger>
                <AccordionContent>
                  Absolutely! All design tokens are defined as CSS variables in{" "}
                  <code>variables.css</code>. You can override them in your
                  application to match your brand.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="docs">
                <AccordionTrigger>
                  Where can I find component documentation?
                </AccordionTrigger>
                <AccordionContent>
                  Comprehensive documentation and usage examples are available
                  in the Storybook at{" "}
                  <a href="https://figma.github.io/sds/storybook">
                    figma.github.io/sds/storybook
                  </a>
                  .
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </FlexItem>
        </Flex>
      </Flex>
    </Section>
  );
}