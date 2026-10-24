import { Section, Flex, FlexItem } from "@gmhlab/ui";
import {
  TokenGallery,
  TokenGalleryHero,
  TokenFamilySection,
  TokenPairingRecipes,
  TokenPairingLab,
} from "../components/token-gallery/token-gallery";

const items = [
  { title: "Logo", body: "Primary mark and clear-space rules." },
  { title: "Color", body: "Core palette and accessible pairings." },
  { title: "Type", body: "Display, heading, and body scales." },
  { title: "Grid", body: "Column ratios across breakpoints." },
  { title: "Iconography", body: "Stroke weight and sizing tokens." },
  { title: "Imagery", body: "Art direction and treatment." },
  { title: "Motion", body: "Easing curves and durations." },
  { title: "Voice", body: "Tone, do's, and don'ts." },
];

export function TokensPage() {
  return (
    <TokenGallery>
      <TokenGalleryHero />
      <TokenPairingLab />
      <Section padding="1600">
        <Flex direction="column" alignSecondary="stretch" gap="400" container>
          <Flex direction="column" alignPrimary="center" gap="200">
            <h1 className="text-4xl font-bold">Foundations</h1>
            <p className="text-lg text-muted-foreground">
              Quarter columns on desktop, thirds on tablet, single column on mobile.
            </p>
          </Flex>
          {/* type="quarter" + wrap drives the responsive columns straight from
              the responsive tokens: 4-up desktop, 2-up tablet, single column mobile.
              Every item uses size="minor" so the flex quarter math applies. */}
          <Flex type="quarter" alignPrimary="center" alignSecondary="center" wrap gap="400">
            {items.map((item) => (
              <FlexItem key={item.title} size="minor">
                <div className="h-full rounded-lg border bg-card p-6 text-card-foreground">
                  <h2 className="text-xl font-semibold">{item.title}</h2>
                  <p className="mt-2 text-sm text-muted-foreground">{item.body}</p>
                </div>
              </FlexItem>
            ))}
          </Flex>
        </Flex>
      </Section>
      <TokenPairingRecipes />

      {/* ——— Colour roles: --gmh-color-*, grouped by M3 family ———
          The atlas discovers every role from the loaded stylesheets at runtime,
          so it stays comprehensive as the token set grows. Press `d` to watch
          every section re-answer in dark. */}

      <TokenFamilySection
        title="Surfaces"
        verb="what everything sits on"
        blurb="Hover a fill — the shift is its state layer, not a filter. Content roles are shown on the fill they were minted for."
        families={["surface"]}
        variant="stroke"
      />
      <TokenFamilySection
        title="Brand"
        verb="navy and gold"
        blurb="Primary is GW navy, tertiary is GW gold, pinned into M3's roles. The brand band roles are GMH's own."
        families={["primary", "secondary", "tertiary", "brand"]}
        variant="subtle"
      />
      <TokenFamilySection
        title="Status"
        verb="what just happened"
        blurb="Error is M3's; success, warning and info are GMH custom colours generated in the same shape."
        families={["error", "success", "warning", "info"]}
        variant="stroke"
      />
    </TokenGallery>
  );
}
