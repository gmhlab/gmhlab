import { useMediaQuery } from "@gmhlab/ui";
import { IconShoppingBag } from "@gmhlab/ui";
import { Flex, FlexItem, Section } from "@gmhlab/ui";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Badge,
  Button,
  Image,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Text,
  TextHeading,
  TextPrice,
} from "@gmhlab/ui";

export function ProductDetails() {
  const { isMobile, isDesktop } = useMediaQuery();
  const flexGap = isMobile ? "600" : "1200";
  const sectionPadding = isMobile ? "600" : "1600";

  return (
    <Section padding={sectionPadding} variant="stroke">
      <Flex container type="half" wrap gap={flexGap}>
        <Image
          src="https://picsum.photos/seed/Modern office/1200/900"
          alt="Modern office chair in black"
          size="large"
          aspectRatio="4-3"
        />
        <FlexItem size="half">
          <Flex direction="column" gap="400" alignSecondary="stretch">
            <Flex alignSecondary="center" gap="200">
              <TextHeading>Ergonomic Office Chair </TextHeading>
              <Badge variant="secondary">30% Off</Badge>
            </Flex>
            <FlexItem>
              <Flex direction="column" gap="200">
                <TextPrice currency="$" price="129.99" />
              </Flex>
            </FlexItem>
            <Text>
              Experience all-day comfort with our Ergonomic Office Chair,
              featuring adjustable lumbar support, breathable mesh back, and
              smooth-rolling casters. Perfect for home or office use.
            </Text>
            <FlexItem>
              <Flex
                wrap
                gap="200"
                direction={isDesktop ? "row" : "column"}
                alignSecondary={isDesktop ? "end" : "stretch"}
              >
                <FlexItem size="fill">
                  <Flex direction="column" gap="100">
                    <Label>Color</Label>
                    <Select defaultValue="Black">
                      <SelectTrigger className="w-full" aria-label="Color">
                        <SelectValue placeholder="Select color..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Black">Black</SelectItem>
                        <SelectItem value="Gray">Gray</SelectItem>
                        <SelectItem value="Blue">Blue</SelectItem>
                        <SelectItem value="Red">Red</SelectItem>
                        <SelectItem value="White">White</SelectItem>
                      </SelectContent>
                    </Select>
                  </Flex>
                </FlexItem>
                <FlexItem size="fill">
                  <Flex direction="column" gap="100">
                    <Label>Quantity</Label>
                    <Select defaultValue="1">
                      <SelectTrigger className="w-full" aria-label="Quantity">
                        <SelectValue placeholder="Select quantity..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="4">4</SelectItem>
                        <SelectItem value="5">5</SelectItem>
                      </SelectContent>
                    </Select>
                  </Flex>
                </FlexItem>
                <Button onClick={() => {}} variant="default">
                  Add
                  <IconShoppingBag />
                </Button>
              </Flex>
            </FlexItem>
            <Accordion>
              <AccordionItem value="product-details">
                <AccordionTrigger>Product Details</AccordionTrigger>
                <AccordionContent>
                  <ul>
                    <li>Adjustable height and tilt</li>
                    <li>Breathable mesh backrest</li>
                    <li>360° swivel base</li>
                    <li>Weight capacity: 250 lbs</li>
                    <li>Easy assembly required</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </Flex>
        </FlexItem>
      </Flex>
    </Section>
  );
}