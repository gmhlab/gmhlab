import { Section, Flex, FlexItem, Card } from "@gmhlab/ui";

export default function Demo() {
  return (
    <main>
      <Section padding="1600">
        <Flex direction="column" alignSecondary="stretch" gap="400" container>
          <Flex gap="200" wrap>
            <FlexItem className="h-4 w-4 bg-blue-300 p-8">A</FlexItem>
            <FlexItem className="h-4 w-4 bg-green-300 p-8">B</FlexItem>
            <FlexItem className="h-4 w-4 bg-yellow-300 p-8">C</FlexItem>
            <FlexItem className="h-4 w-4 bg-blue-300 p-8">D</FlexItem>
            <FlexItem className="h-4 w-4 bg-green-300 p-8">E</FlexItem>
            <FlexItem className="h-4 w-4 bg-yellow-300 p-8">F</FlexItem>
            <FlexItem className="h-4 w-4 bg-blue-300 p-8">G</FlexItem>
            <FlexItem className="h-4 w-4 bg-green-300 p-8">H</FlexItem>
            <FlexItem className="h-4 w-4 bg-yellow-300 p-8">I</FlexItem>
            <FlexItem className="h-4 w-4 bg-blue-300 p-8">J</FlexItem>
            <FlexItem className="h-4 w-4 bg-green-300 p-8">K</FlexItem>
            <FlexItem className="h-4 w-4 bg-yellow-300 p-8">L</FlexItem>
            <FlexItem className="h-4 w-4 bg-blue-300 p-8">M</FlexItem>
            <FlexItem className="h-4 w-4 bg-green-300 p-8">N</FlexItem>
          </Flex>
        </Flex>
      </Section>
      <Section padding="1600">
        <Flex gap="200" type="third" wrap>
          <FlexItem size="minor" className="bg-blue-300 p-8">A</FlexItem>
          <FlexItem size="minor" className="bg-green-300 p-8">B</FlexItem>
          <FlexItem size="minor" className="bg-yellow-300 p-8">C</FlexItem>
          <FlexItem size="major" className="bg-blue-300 p-8">D</FlexItem>
          <FlexItem size="fill" className="bg-green-300 p-8">E</FlexItem>
          <FlexItem size="minor" className="bg-yellow-300 p-8">F</FlexItem>
        </Flex>
        <Flex direction="column" alignPrimary="stretch" alignSecondary="stretch" gap="200">
          <FlexItem className="bg-blue-300 p-8">A</FlexItem>
          <FlexItem className="bg-green-300 p-8">B</FlexItem>
          <FlexItem className="bg-yellow-300 p-8">C</FlexItem>
        </Flex>
      </Section>
      <Section padding="1600">
        <Flex direction="column" alignSecondary="stretch" gap="400" container>
          <FlexItem size="full"><Card variant="stroke" padding="600">Card content</Card></FlexItem>
        </Flex>
      </Section>
    </main>
  )
}
