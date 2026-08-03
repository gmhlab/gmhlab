import { Section, Flex, FlexItem } from "@gmhlab/ui";

// The titled quarter-column grid concept, themed to the flex features it
// demonstrates. type="quarter" + wrap + size="minor" drives the responsive
// columns straight from the MFY tokens: 4-up desktop, 2-up tablet, 1-up mobile.
const features = [
  { title: "Wrap", body: "Items flow onto new rows when they run out of horizontal space." },
  { title: "Quarter", body: 'type="quarter" sizes each minor item to a 4 / 2 / 1 responsive column grid.' },
  { title: "Thirds", body: 'type="third" splits the row into three tracks — mix minor, major, and fill.' },
  { title: "Fill", body: 'size="fill" lets an item expand to eat the remaining space in the row.' },
  { title: "Minor / Major", body: "Relative sizes that resolve against the flex type's column math." },
  { title: "Direction", body: 'direction="column" stacks items vertically with the same gap tokens.' },
  { title: "Gap", body: 'gap="200"…"600" pulls straight from the --mfy spacing scale.' },
  { title: "Align", body: "alignPrimary / alignSecondary control main- and cross-axis placement." },
];

export function FlexPage() {
  return (
    <>
      <Section padding="1600">
        <Flex direction="column" alignSecondary="stretch" gap="400" container>
          <Flex direction="column" alignPrimary="center" gap="200">
            <h1 className="text-4xl font-bold">Flex</h1>
            <p className="text-lg text-muted-foreground">
              Quarter columns on desktop, thirds on tablet, single column on mobile.
            </p>
          </Flex>
          <Flex type="quarter" alignPrimary="center" alignSecondary="center" wrap gap="400">
            {features.map((feature) => (
              <FlexItem key={feature.title} size="minor">
                <div className="h-full rounded-lg border bg-card p-6 text-card-foreground">
                  <h2 className="text-xl font-semibold">{feature.title}</h2>
                  <p className="mt-2 text-sm text-muted-foreground">{feature.body}</p>
                </div>
              </FlexItem>
            ))}
          </Flex>
        </Flex>
      </Section>

      {/* ——— Mechanics: the raw sizing demos, now labelled for context ——— */}
      <Section padding="1600">
        <Flex direction="column" alignSecondary="stretch" gap="400" container>
          <h2 className="text-2xl font-semibold">Wrap</h2>
          <Flex gap="200" wrap>
            <FlexItem className="bg-blue-300 p-8">A</FlexItem>
            <FlexItem className="bg-green-300 p-8">B</FlexItem>
            <FlexItem className="bg-yellow-300 p-8">C</FlexItem>
            <FlexItem className="bg-blue-300 p-8">D</FlexItem>
            <FlexItem className="bg-green-300 p-8">E</FlexItem>
            <FlexItem className="bg-yellow-300 p-8">F</FlexItem>
            <FlexItem className="bg-blue-300 p-8">G</FlexItem>
            <FlexItem className="bg-green-300 p-8">H</FlexItem>
            <FlexItem className="bg-yellow-300 p-8">I</FlexItem>
            <FlexItem className="bg-blue-300 p-8">J</FlexItem>
            <FlexItem className="bg-green-300 p-8">K</FlexItem>
            <FlexItem className="bg-yellow-300 p-8">L</FlexItem>
            <FlexItem className="bg-blue-300 p-8">M</FlexItem>
            <FlexItem className="bg-green-300 p-8">N</FlexItem>
          </Flex>

          <h2 className="text-2xl font-semibold">Thirds with mixed sizes</h2>
          <Flex gap="200" type="third" wrap>
            <FlexItem size="minor" className="bg-blue-300 p-8">A</FlexItem>
            <FlexItem size="minor" className="bg-green-300 p-8">B</FlexItem>
            <FlexItem size="minor" className="bg-yellow-300 p-8">C</FlexItem>
            <FlexItem size="major" className="bg-blue-300 p-8">D</FlexItem>
            <FlexItem size="fill" className="bg-green-300 p-8">E</FlexItem>
            <FlexItem size="minor" className="bg-yellow-300 p-8">F</FlexItem>
          </Flex>

          <h2 className="text-2xl font-semibold">Column stretch</h2>
          <Flex direction="column" alignPrimary="stretch" alignSecondary="stretch" gap="200">
            <FlexItem className="bg-blue-300 p-8">A</FlexItem>
            <FlexItem className="bg-green-300 p-8">B</FlexItem>
            <FlexItem className="bg-yellow-300 p-8">C</FlexItem>
          </Flex>
        </Flex>
      </Section>
    </>
  );
}
