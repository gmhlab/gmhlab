import { useState, type ReactNode } from "react";
import {
  // MFY primitives
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
  Button,
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
  Image,
  Text,
  TextCode,
  TextContentHeading,
  TextContentTitle,
  TextEmphasis,
  TextHeading,
  TextLink,
  TextLinkList,
  TextList,
  TextListItem,
  TextPrice,
  TextSmall,
  TextSmallStrong,
  TextStrong,
  TextSubheading,
  TextSubtitle,
  TextTitleHero,
  TextTitlePage,
  // shadcn primitives

  Badge,
  Checkbox,
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  Kbd,
  RadioGroup,
  RadioGroupItem,
  Separator,
  Switch,
  Textarea,

  // layouts
  Flex,
  FlexItem,
  Grid,
  GridItem,
  Section,
  // compositions
  Card,
  FormBox,
  Hero,
  Panel,
  PricingCard,
  PricingCardSkeleton,
  ProductInfoCard,
  ProductInfoCardSkeleton,
  ReviewCard,
  StatsCard,
  TestimonialCard,
  // icons + hooks
  IconStar,
  useMediaQuery,
} from "@gmhlab/ui";
import { SlideFooter, SlideHeader } from "@gmhlab/blocks";
import { ArrowRight, Check, SearchIcon } from "lucide-react";

const ICON_SIZES = ["14", "16", "20", "24", "32", "40", "48"] as const;

const img = (seed: string, w: number, h: number) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

/* ————— page scaffolding (not under test) ————— */

function DemoSection({
  id,
  title,
  description,
  fullBleed = false,
  children,
}: {
  id: string;
  title: string;
  description?: string;
  fullBleed?: boolean;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-20 py-10">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <div
        className={
          fullBleed
            ? "mt-6 flex flex-col gap-8"
            : "mx-auto mt-6 flex max-w-6xl flex-col gap-6 px-4"
        }
      >
        {children}
      </div>
    </section>
  );
}

function Specimen({
  label,
  children,
  className = "",
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-lg border border-dashed border-border p-4 ${className}`}
    >
      <p className="mb-3 font-mono text-xs text-muted-foreground">{label}</p>
      {children}
    </div>
  );
}

function SpecimenGrid({
  children,
  cols = 3,
}: {
  children: ReactNode;
  cols?: 2 | 3 | 4;
}) {
  const colClass = {
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-2 lg:grid-cols-3",
    4: "sm:grid-cols-2 lg:grid-cols-4",
  }[cols];
  return <div className={`grid gap-4 ${colClass}`}>{children}</div>;
}

const toc = [
  { id: "typography", label: "Typography" },
  { id: "buttons", label: "Buttons (MFY)" },
  { id: "badges", label: "Badges" },
  { id: "avatars", label: "Avatars" },
  { id: "forms", label: "Inputs & Forms" },
  { id: "links", label: "Links & Separators" },
  { id: "icons", label: "Icons" },
  { id: "images", label: "Images" },
  { id: "layouts", label: "Layouts" },
  { id: "cards", label: "Cards" },
  { id: "vanity-cards", label: "Vanity Cards" },
  { id: "compositions", label: "Hero, Panel, SlideHeader, SlideFooter" },
];

export function ComponentsPage() {
  const [lastEvent, setLastEvent] = useState("nothing yet");
  const { isMobile, isTablet, isDesktop } = useMediaQuery();
  const breakpoint = isMobile ? "mobile" : isTablet ? "tablet" : isDesktop ? "desktop" : "unknown";
  const log = (message: string) => setLastEvent(message);

  return (
    <main className="pb-24">
      {/* intro + table of contents */}
      <div className="mx-auto max-w-6xl px-4 pt-16">
        <TextContentTitle
          title="Component gallery"
          subtitle="Every primitive and composition from @gmhlab/ui, with variants. If something here looks broken, the package is broken."
        />
        <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
          {toc.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              style={{ textDecoration: "none" }}
            >
              {item.label}
            </a>
          ))}
        </div>
        <p className="mt-4 font-mono text-xs text-muted-foreground">
          useMediaQuery: {breakpoint} · press{" "}
          <span className="font-semibold">d</span> to toggle dark mode
        </p>
      </div>

      {/* interaction log — verifies onPress wiring across the page */}
      <div className="fixed bottom-4 right-4 z-50 rounded-full border border-border bg-background/90 px-4 py-2 font-mono text-xs shadow-lg backdrop-blur">
        last event: <span className="font-semibold">{lastEvent}</span>
      </div>

      <DemoSection
        id="typography"
        title="Typography"
        description="The Text family — titles, body, lists, price, and content groupings."
      >
        <Specimen label="TextTitleHero / TextTitlePage / TextSubtitle / TextHeading / TextSubheading">
          <Flex direction="column" gap="300">
            <TextTitleHero>Title hero</TextTitleHero>
            <TextTitlePage>Title page</TextTitlePage>
            <TextSubtitle>Subtitle — supporting copy under a title</TextSubtitle>
            <TextHeading>Heading</TextHeading>
            <TextSubheading>Subheading</TextSubheading>
          </Flex>
        </Specimen>
        <SpecimenGrid cols={2}>
          <Specimen label="Text / TextStrong / TextEmphasis / TextSmall / TextSmallStrong / TextCode">
            <Flex direction="column" gap="200">
              <Text>
                Body text with <TextStrong>strong</TextStrong>,{" "}
                <TextEmphasis>emphasis</TextEmphasis>, and{" "}
                <TextCode>code()</TextCode> inline.
              </Text>
              <TextSmall>
                Small body text with <TextSmallStrong>small strong</TextSmallStrong>.
              </TextSmall>
              <Text lineHeight="single">
                Body text with lineHeight="single" for tighter leading.
              </Text>
            </Flex>
          </Specimen>
          <Specimen label='Text lineClamp={2} (truncation)'>
            <Text lineClamp={2}>
              This paragraph is intentionally long so that the two-line clamp
              can be verified. It keeps going and going past the point where
              two lines of text would normally end, and then a bit further
              still, so the ellipsis has something to truncate.
            </Text>
          </Specimen>
          <Specimen label='TextPrice size="large" / size="small"'>
            <Flex gap="800" alignSecondary="center">
              <TextPrice currency="$" price="29" label="/ mo" size="large" />
              <TextPrice currency="$" price="290" label="/ yr" size="small" />
            </Flex>
          </Specimen>
          <Specimen label="TextList (default + tight) / TextLinkList">
            <Flex gap="800" wrap>
              <TextList title="Default density">
                <TextListItem>Unlimited projects</TextListItem>
                <TextListItem>Priority support</TextListItem>
              </TextList>
              <TextList title="Tight density" density="tight">
                <TextListItem>Unlimited projects</TextListItem>
                <TextListItem>Priority support</TextListItem>
              </TextList>
              <TextLinkList title="Link list">
                <TextListItem>
                  <TextLink href="#links">Documentation</TextLink>
                </TextListItem>
                <TextListItem>
                  <TextLink href="#links">Changelog</TextLink>
                </TextListItem>
              </TextLinkList>
            </Flex>
          </Specimen>
          <Specimen label='TextContentHeading align="start" / align="center"'>
            <Flex direction="column" gap="600">
              <TextContentHeading
                heading="Content heading"
                subheading="With a subheading, aligned start"
              />
              <TextContentHeading
                align="center"
                heading="Content heading"
                subheading="With a subheading, aligned center"
              />
            </Flex>
          </Specimen>
          <Specimen label="TextContentTitle (responsive: hero on desktop, page on mobile)">
            <TextContentTitle
              title="Content title"
              subtitle="Swaps TextTitleHero for TextTitlePage below the tablet breakpoint"
            />
          </Specimen>
        </SpecimenGrid>
      </DemoSection>

      <DemoSection
        id="buttons"
        title="Buttons"
        description="Button and ButtonGroup — Base UI primitives with shadcn cn-* styling. Every button reports to the event log."
      >
        <Specimen label="Button variants × sizes">
          <Flex direction="column" gap="400">
            {(["default", "sm"] as const).map((size) => (
              <Flex key={size} gap="300" wrap alignSecondary="center">
                {(
                  [
                    "default",
                    "secondary",
                    "outline",
                    "ghost",
                    "destructive",
                    "link",
                  ] as const
                ).map((variant) => (
                  <Button
                    key={variant}
                    variant={variant}
                    size={size}
                    onClick={() => log(`Button ${variant} ${size}`)}
                  >
                    {variant} {size}
                  </Button>
                ))}
              </Flex>
            ))}
          </Flex>
        </Specimen>
        <SpecimenGrid cols={3}>
          <Specimen label="Button disabled">
            <Flex gap="300" wrap>
              <Button disabled>default</Button>
              <Button variant="outline" disabled>
                outline
              </Button>
              <Button variant="ghost" disabled>
                ghost
              </Button>
            </Flex>
          </Specimen>
          <Specimen label="Button as an anchor (render prop)">
            <Button variant="outline" render={<a href="#buttons" />}>
              Anchor button
            </Button>
          </Specimen>
          <Specimen label="Icon sizes">
            <Flex gap="300" wrap alignSecondary="center">
              {(["icon-sm", "icon", "icon-lg"] as const).map((size) => (
                <Button
                  key={size}
                  size={size}
                  variant="outline"
                  aria-label={`Star (${size})`}
                  onClick={() => log(`Button ${size}`)}
                >
                  <IconStar />
                </Button>
              ))}
            </Flex>
          </Specimen>
        </SpecimenGrid>
        <SpecimenGrid cols={2}>
          <Specimen label="ButtonGroup (segmented — attached buttons)">
            <Flex direction="column" gap="400" alignSecondary="start">
              {(["horizontal", "vertical"] as const).map((orientation) => (
                <ButtonGroup key={orientation} orientation={orientation}>
                  {["Day", "Week", "Month"].map((span) => (
                    <Button
                      key={span}
                      variant="outline"
                      onClick={() => log(`ButtonGroup ${orientation} · ${span}`)}
                    >
                      {span}
                    </Button>
                  ))}
                </ButtonGroup>
              ))}
            </Flex>
          </Specimen>
          <Specimen label="ButtonGroup with text and separator">
            <ButtonGroup>
              <Button variant="outline" onClick={() => log("ButtonGroup prev")}>
                Prev
              </Button>
              <ButtonGroupSeparator />
              <ButtonGroupText>Page 2</ButtonGroupText>
              <ButtonGroupSeparator />
              <Button variant="outline" onClick={() => log("ButtonGroup next")}>
                Next
              </Button>
            </ButtonGroup>
          </Specimen>
        </SpecimenGrid>
        <Specimen label="Laying buttons out — use Flex, not ButtonGroup">
          <Flex direction="column" gap="400" alignSecondary="stretch">
            <Flex gap="300" alignSecondary="center">
              <Button variant="outline" onClick={() => log("Flex row · cancel")}>
                Cancel
              </Button>
              <Button onClick={() => log("Flex row · save")}>Save</Button>
            </Flex>
            <Flex gap="300" alignSecondary="center">
              <Button
                className="flex-1"
                variant="outline"
                onClick={() => log("Flex justify · cancel")}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={() => log("Flex justify · save")}
              >
                Save
              </Button>
            </Flex>
            <Flex direction="column" gap="300" alignSecondary="stretch">
              <Button
                variant="outline"
                onClick={() => log("Flex stack · cancel")}
              >
                Cancel
              </Button>
              <Button onClick={() => log("Flex stack · save")}>Save</Button>
            </Flex>
          </Flex>
        </Specimen>
      </DemoSection>

      <DemoSection
        id="badges"
        title="Badges"
        description="Badge variants, with and without icons."
      >
        <Specimen label="Badge: variants">
          <div className="flex flex-wrap gap-2">
            <Badge>default</Badge>
            <Badge variant="secondary">secondary</Badge>
            <Badge variant="destructive">destructive</Badge>
            <Badge variant="outline">outline</Badge>
            <Badge variant="ghost">ghost</Badge>
            <Badge variant="link">link</Badge>
          </div>
        </Specimen>
        <Specimen label="Badge: icon, interactive">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">
              <Check /> with icon
            </Badge>
            <Badge render={<a href="#badges" />}>badge link</Badge>
          </div>
        </Specimen>
      </DemoSection>

      <DemoSection
        id="avatars"
        title="Avatars"
        description="shadcn Avatar (image + fallback, sizes sm / default / lg), AvatarBadge status dot, AvatarGroup + AvatarGroupCount."
      >
        <SpecimenGrid cols={2}>
          <Specimen label="Sizes (sm / default / lg) — fallback & image">
            <Flex gap="400" alignSecondary="center" wrap>
              <Avatar size="sm">
                <AvatarFallback>SM</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarFallback>MD</AvatarFallback>
              </Avatar>
              <Avatar size="lg">
                <AvatarFallback>LG</AvatarFallback>
              </Avatar>
              <Avatar size="sm">
                <AvatarImage src={img("ava1", 96, 96)} alt="Small" />
                <AvatarFallback>S</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarImage src={img("ava2", 96, 96)} alt="Medium" />
                <AvatarFallback>M</AvatarFallback>
              </Avatar>
              <Avatar size="lg">
                <AvatarImage src={img("ava3", 96, 96)} alt="Large" />
                <AvatarFallback>L</AvatarFallback>
              </Avatar>
            </Flex>
          </Specimen>
          <Specimen label="AvatarBadge (status dot)">
            <Flex gap="400" alignSecondary="center" wrap>
              <Avatar size="lg">
                <AvatarImage src={img("ava4", 96, 96)} alt="Online" />
                <AvatarFallback>ON</AvatarFallback>
                <AvatarBadge />
              </Avatar>
              <Avatar size="lg">
                <AvatarFallback>JY</AvatarFallback>
                <AvatarBadge />
              </Avatar>
            </Flex>
          </Specimen>
          <Specimen label="AvatarGroup + AvatarGroupCount (overflow)">
            <AvatarGroup>
              <Avatar>
                <AvatarImage src={img("ava6", 96, 96)} alt="" />
                <AvatarFallback>A</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarImage src={img("ava7", 96, 96)} alt="" />
                <AvatarFallback>B</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarImage src={img("ava8", 96, 96)} alt="" />
                <AvatarFallback>C</AvatarFallback>
              </Avatar>
              <AvatarGroupCount>+3</AvatarGroupCount>
            </AvatarGroup>
          </Specimen>
        </SpecimenGrid>
      </DemoSection>

      <DemoSection
        id="forms"
        title="Inputs & Forms"
        description="Field composition (label, description, error), Checkbox, Switch & RadioGroup, Textarea, InputGroup, and Kbd."
      >
        <SpecimenGrid cols={3}>
          <Specimen label="Field + FieldLabel + Input + FieldDescription">
            <Field>
              <FieldLabel htmlFor="demo-email">Email</FieldLabel>
              <Input id="demo-email" name="email" placeholder="you@example.com" />
              <FieldDescription>We never share your email.</FieldDescription>
            </Field>
          </Specimen>
          <Specimen label="Invalid Field + FieldError">
            <Field data-invalid={true}>
              <FieldLabel htmlFor="demo-username">Username</FieldLabel>
              <Input
                id="demo-username"
                name="username"
                placeholder="username"
                aria-invalid
              />
              <FieldError>That username is taken.</FieldError>
            </Field>
          </Specimen>
          <Specimen label="Disabled Field / bare Input">
            <Flex direction="column" gap="400" alignSecondary="stretch">
              <Field data-disabled={true}>
                <FieldLabel htmlFor="demo-disabled">Disabled</FieldLabel>
                <Input id="demo-disabled" disabled placeholder="Can't touch this" />
              </Field>
              <Input placeholder="Bare Input primitive" aria-label="Bare input" />
            </Flex>
          </Specimen>
        </SpecimenGrid>
        <SpecimenGrid cols={2}>
          <Specimen label="FieldSet + FieldLegend + FieldGroup + FieldDescription">
            <FieldSet>
              <FieldLegend>Shipping details</FieldLegend>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="demo-name">Full name</FieldLabel>
                  <Input id="demo-name" placeholder="Ada Lovelace" />
                </Field>
                <Field>
                  <FieldLabel htmlFor="demo-city">City</FieldLabel>
                  <Input id="demo-city" placeholder="London" />
                  <FieldDescription>
                    Where the package should arrive.
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </FieldSet>
          </Specimen>
          <Specimen label="Checkbox / Switch / RadioGroup / Textarea">
            <Flex direction="column" gap="600" alignSecondary="stretch">
              <Field orientation="horizontal">
                <Checkbox id="demo-terms" defaultChecked />
                <FieldLabel htmlFor="demo-terms" className="font-normal">
                  Accept terms and conditions
                </FieldLabel>
              </Field>
              <Field orientation="horizontal">
                <Switch id="demo-notifications" defaultChecked />
                <FieldLabel htmlFor="demo-notifications" className="font-normal">
                  Email notifications
                </FieldLabel>
              </Field>
              <RadioGroup defaultValue="comfortable">
                <Field orientation="horizontal">
                  <RadioGroupItem value="compact" id="demo-radio-compact" />
                  <FieldLabel htmlFor="demo-radio-compact" className="font-normal">
                    Compact
                  </FieldLabel>
                </Field>
                <Field orientation="horizontal">
                  <RadioGroupItem value="comfortable" id="demo-radio-comfortable" />
                  <FieldLabel
                    htmlFor="demo-radio-comfortable"
                    className="font-normal"
                  >
                    Comfortable
                  </FieldLabel>
                </Field>
              </RadioGroup>
              <Field>
                <FieldLabel htmlFor="demo-notes">Notes</FieldLabel>
                <Textarea
                  id="demo-notes"
                  placeholder="Anything else we should know?"
                />
              </Field>
            </Flex>
          </Specimen>
        </SpecimenGrid>
        <SpecimenGrid cols={2}>
          <Specimen label="InputGroup: search with icon addon">
            <InputGroup>
              <InputGroupAddon>
                <SearchIcon />
              </InputGroupAddon>
              <InputGroupInput
                type="search"
                placeholder="Search components…"
                aria-label="Search"
              />
            </InputGroup>
          </Specimen>
          <Specimen label="InputGroup: inline submit / Kbd">
            <Flex direction="column" gap="600" alignSecondary="stretch">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  log("inline InputGroup form submitted");
                }}
              >
                <InputGroup>
                  <InputGroupInput
                    type="email"
                    placeholder="you@example.com"
                    aria-label="Email"
                  />
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton type="submit">Subscribe</InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
              </form>
              <Text>
                Save with <Kbd>⌘S</Kbd>
              </Text>
            </Flex>
          </Specimen>
        </SpecimenGrid>
      </DemoSection>

      <DemoSection
        id="links"
        title="Links & Separators"
        description="TextLink and the shadcn Separator."
      >
        <SpecimenGrid cols={2}>
          <Specimen label="TextLink">
            <Flex direction="column" gap="200">
              <TextLink href="#links">A standalone TextLink</TextLink>
              <Text>
                Body copy with an inline <TextLink href="#links">TextLink</TextLink>{" "}
                running through it.
              </Text>
            </Flex>
          </Specimen>
          <Specimen label='Separator horizontal / orientation="vertical"'>
            <div className="flex flex-col gap-4">
              <div>
                <Text>Above the line</Text>
                <Separator className="my-3" />
                <Text>Below the line</Text>
              </div>
              <div className="flex h-6 items-center gap-4 text-sm">
                <span>Docs</span>
                <Separator orientation="vertical" />
                <span>Blog</span>
                <Separator orientation="vertical" />
                <span>Source</span>
              </div>
            </div>
          </Specimen>
        </SpecimenGrid>
      </DemoSection>

      <DemoSection
        id="icons"
        title="Icons"
        description="IconStar at every Icon size step. Stroke color comes from --svg-stroke-color."
      >
        <Specimen label={`IconStar size: ${ICON_SIZES.join(" / ")}`}>
          <Flex gap="600" alignSecondary="end" wrap>
            {ICON_SIZES.map((size) => (
              <Flex key={size} direction="column" gap="200" alignSecondary="center">
                <IconStar size={size} />
                <TextSmall>{size}</TextSmall>
              </Flex>
            ))}
          </Flex>
        </Specimen>
      </DemoSection>

      <DemoSection
        id="images"
        title="Images"
        description="Aspect ratios, sizes, variants, and the built-in loading placeholder."
      >
        <SpecimenGrid cols={3}>
          <Specimen label='aspectRatio="1-1"'>
            <Image src={img("sq", 400, 400)} alt="Square" aspectRatio="1-1" size="medium" />
          </Specimen>
          <Specimen label='aspectRatio="16-9"'>
            <Image src={img("wide", 640, 360)} alt="Wide" aspectRatio="16-9" size="medium" />
          </Specimen>
          <Specimen label='aspectRatio="4-3"'>
            <Image src={img("std", 640, 480)} alt="Standard" aspectRatio="4-3" size="medium" />
          </Specimen>
          <Specimen label='variant="default" (no radius)'>
            <Image src={img("sharp", 640, 360)} alt="Sharp corners" aspectRatio="16-9" size="medium" variant="default" />
          </Specimen>
          <Specimen label='size="small"'>
            <Image src={img("small", 320, 240)} alt="Small" aspectRatio="4-3" size="small" />
          </Specimen>
          <Specimen label="no src (permanent loading placeholder)">
            <Image alt="Placeholder" aspectRatio="16-9" size="medium" />
          </Specimen>
        </SpecimenGrid>
      </DemoSection>

      <DemoSection
        id="layouts"
        title="Layouts"
        description="Flex, Grid, and the Section variants. The /flex page has deeper Flex sizing demos."
      >
        <Specimen label='Flex type="quarter" wrap gap="400" with FlexItem size="minor"'>
          <Flex type="quarter" wrap gap="400">
            {["A", "B", "C", "D"].map((label) => (
              <FlexItem key={label} size="minor">
                <div className="rounded-md bg-accent p-4 text-center text-sm text-accent-foreground">
                  {label}
                </div>
              </FlexItem>
            ))}
          </Flex>
        </Specimen>
        <Specimen label='Grid columns="repeat(4, 1fr)" gap="400" with GridItem column spans'>
          <Grid columns="repeat(4, 1fr)" gap="400">
            <GridItem column="span 4">
              <div className="rounded-md bg-accent p-4 text-center text-sm">span 4</div>
            </GridItem>
            <GridItem column="span 2">
              <div className="rounded-md bg-accent p-4 text-center text-sm">span 2</div>
            </GridItem>
            <GridItem column="span 2">
              <div className="rounded-md bg-accent p-4 text-center text-sm">span 2</div>
            </GridItem>
            {["1", "2", "3", "4"].map((label) => (
              <GridItem key={label}>
                <div className="rounded-md bg-accent p-4 text-center text-sm">{label}</div>
              </GridItem>
            ))}
          </Grid>
        </Specimen>
        <Specimen label='Section variants: subtle / neutral / stroke / brand / image (padding="600")'>
          <Flex direction="column" gap="400" alignSecondary="stretch">
            {(["subtle", "neutral", "stroke", "brand"] as const).map(
              (variant) => (
                <Section key={variant} variant={variant} padding="600">
                  <Flex container>
                    <Text>Section variant="{variant}"</Text>
                  </Flex>
                </Section>
              ),
            )}
            <Section variant="image" src={img("section", 1200, 300)} padding="600">
              <Flex container>
                <Text>Section variant="image"</Text>
              </Flex>
            </Section>
          </Flex>
        </Specimen>
      </DemoSection>

      <DemoSection
        id="cards"
        title="Cards"
        description="The generic Card — variants, padding, direction, assets, and pressable cards."
      >
        <SpecimenGrid cols={3}>
          {(["default", "stroke", "brand"] as const).map((variant) => (
            <Specimen key={variant} label={`Card variant="${variant}" padding="600"`}>
              <Card variant={variant} padding="600">
                <TextHeading>{variant}</TextHeading>
                <Text>Card body content sits inside card-content.</Text>
              </Card>
            </Specimen>
          ))}
        </SpecimenGrid>
        <SpecimenGrid cols={2}>
          <Specimen label='Card direction="horizontal" with Image asset (vertical on mobile)'>
            <Card
              variant="stroke"
              padding="600"
              direction="horizontal"
              asset={<Image src={img("cardh", 640, 480)} alt="" aspectRatio="4-3" size="fill" />}
            >
              <TextHeading>Horizontal card</TextHeading>
              <Text>The asset renders beside the content on desktop.</Text>
            </Card>
          </Specimen>
          <Specimen label="Card interactionProps (whole card pressable) · padding=&quot;800&quot; align=&quot;center&quot;">
            <Card
              variant="brand"
              padding="800"
              align="center"
              interactionProps={{ onPress: () => log("Card pressed") }}
            >
              <TextHeading>Pressable card</TextHeading>
              <Text>Click anywhere on this card.</Text>
            </Card>
          </Specimen>
        </SpecimenGrid>
      </DemoSection>

      <DemoSection
        id="vanity-cards"
        title="Vanity Cards"
        description="PricingCard, ProductInfoCard, ReviewCard, StatsCard, TestimonialCard — and their skeletons."
      >
        <Specimen label='PricingCard size="large" (stroke / brand) + PricingCardSkeleton'>
          <Flex type="third" wrap gap="400">
            <FlexItem size="minor">
              <PricingCard
                sku="1-basic"
                interval="month"
                heading="Basic"
                price="9"
                priceCurrency="$"
                priceLabel="/ mo"
                action="Select Basic"
                onAction={() => log("PricingCard Basic")}
                list={["1 project", "Community support", "1 GB storage"]}
              />
            </FlexItem>
            <FlexItem size="minor">
              <PricingCard
                sku="2-pro"
                interval="month"
                heading="Pro"
                price="29"
                priceCurrency="$"
                priceLabel="/ mo"
                variant="brand"
                actionVariant="outline"
                action="Select Pro"
                actionIcon={<ArrowRight size={16} />}
                onAction={() => log("PricingCard Pro")}
                list={["Unlimited projects", "Priority support", "100 GB storage"]}
              />
            </FlexItem>
            <FlexItem size="minor">
              <PricingCardSkeleton size="large" />
            </FlexItem>
          </Flex>
        </Specimen>
        <Specimen label='PricingCard size="small" / actionDisabled (current plan)'>
          <Flex type="third" wrap gap="400">
            <FlexItem size="minor">
              <PricingCard
                sku="1-basic"
                interval="year"
                size="small"
                heading="Basic"
                price="90"
                priceCurrency="$"
                priceLabel="/ yr"
                action="Go Annual"
                onAction={() => log("PricingCard small")}
                list={["1 project", "Community support"]}
              />
            </FlexItem>
            <FlexItem size="minor">
              <PricingCard
                sku="2-pro"
                interval="month"
                size="small"
                heading="Current"
                price="29"
                priceCurrency="$"
                action="Current Plan"
                actionDisabled
                onAction={() => log("should not fire")}
                list={["You are on this plan"]}
              />
            </FlexItem>
          </Flex>
        </Specimen>
        <Specimen label="ProductInfoCard + ProductInfoCardSkeleton">
          <Flex type="third" wrap gap="400">
            <FlexItem size="minor">
              <ProductInfoCard
                heading="Studio Headphones"
                price="249"
                rating={4.8}
                description="Closed-back reference headphones with a flat response curve and a detachable cable."
                asset={
                  <Image
                    src={img("product", 640, 480)}
                    alt="Studio Headphones"
                    aspectRatio="4-3"
                    className="product-info-card-asset"
                  />
                }
              />
            </FlexItem>
            <FlexItem size="minor">
              <ProductInfoCardSkeleton />
            </FlexItem>
          </Flex>
        </Specimen>
        <Specimen label="ReviewCard / StatsCard / TestimonialCard">
          <Flex type="third" wrap gap="400">
            <FlexItem size="minor">
              <ReviewCard
                stars={4}
                title="Does what it says"
                body="Setup took five minutes and the defaults were right. The star row above renders one IconStar per star."
                name="Riley Chen"
                date="July 2026"
              />
            </FlexItem>
            <FlexItem size="minor">
              <StatsCard
                icon={<IconStar size="32" />}
                stat="12,480"
                description="Weekly active users"
              />
            </FlexItem>
            <FlexItem size="minor">
              <TestimonialCard
                heading="“We shipped our redesign in a week.”"
                name="Sam Okafor"
                username="samokafor"
                initials="SO"
              />
            </FlexItem>
          </Flex>
        </Specimen>
      </DemoSection>

      <DemoSection
        id="compositions"
        title="Hero, Panel, SlideHeader, SlideFooter & FormBox"
        description="Page-scale compositions rendered full-bleed."
        fullBleed
      >
        <div>
          <p className="mx-auto mb-3 max-w-6xl px-4 font-mono text-xs text-muted-foreground">
            Hero variant="stroke" with TextContentTitle + ButtonGroup
          </p>
          <div className="border-y border-dashed border-border">
            <Hero variant="stroke">
              <TextContentTitle
                align="center"
                title="Build with monofly"
                subtitle="A hero composition: Section + centered Flex container"
              />
              <Flex gap="300" alignPrimary="center" alignSecondary="center">
                <Button variant="outline" onClick={() => log("Hero secondary")}>
                  Learn more
                </Button>
                <Button onClick={() => log("Hero primary")}>Get started</Button>
              </Flex>
            </Hero>
          </div>
        </div>
        <div>
          <p className="mx-auto mb-3 max-w-6xl px-4 font-mono text-xs text-muted-foreground">
            Panel (container Flex with wrap) holding StatsCards
          </p>
          <div className="border-y border-dashed border-border py-6">
            <Panel type="third" gap="400">
              <FlexItem size="minor">
                <StatsCard stat="99.98%" description="Uptime" />
              </FlexItem>
              <FlexItem size="minor">
                <StatsCard stat="4.9/5" description="Average rating" />
              </FlexItem>
              <FlexItem size="minor">
                <StatsCard stat="120+" description="Countries served" />
              </FlexItem>
            </Panel>
          </div>
        </div>
        <div>
          <p className="mx-auto mb-3 max-w-6xl px-4 font-mono text-xs text-muted-foreground">
            SlideHeader (default chrome) and SlideFooter (default chrome)
          </p>
          <div className="border-y border-dashed border-border">
            <SlideHeader start="VERSION 1.0" center="©2026 MONOFLY DESIGN" end="PAGE 01" />
            <SlideFooter start="MONOFLY" center="COMPONENT GALLERY" end="JULY 2026" />
          </div>
        </div>
        <div>
          <p className="mx-auto mb-3 max-w-6xl px-4 font-mono text-xs text-muted-foreground">
            SlideHeader bare + SlideFooter bare, embedded in a brand Section
          </p>
          <div className="border-y border-dashed border-border">
            <Section variant="brand" padding="800">
              <Flex container direction="column" gap="800" alignSecondary="stretch">
                <SlideHeader bare start="BARE HEADER" center="ON A BRAND SURFACE" end="NO CHROME" />
                <TextHeading>Brand surface content</TextHeading>
                <SlideFooter bare start="BARE FOOTER" center="SAME SURFACE" end="FLUSH" />
              </Flex>
            </Section>
          </div>
        </div>
        <div className="mx-auto w-full max-w-6xl px-4">
          <Specimen label="FormBox composition (boxed form) with Fields">
            <FormBox
              onSubmit={(e) => {
                e.preventDefault();
                log("FormBox submitted");
              }}
            >
              <TextHeading>Create account</TextHeading>
              <Field>
                <FieldLabel htmlFor="signup-name">Name</FieldLabel>
                <Input id="signup-name" name="name" placeholder="Ada Lovelace" />
              </Field>
              <Field>
                <FieldLabel htmlFor="signup-email">Email</FieldLabel>
                <Input
                  id="signup-email"
                  name="signup-email"
                  placeholder="you@example.com"
                />
                <FieldDescription>
                  We'll send a confirmation link.
                </FieldDescription>
              </Field>
              <Flex gap="300" alignSecondary="center">
                <Button className="flex-1" type="submit">
                  Sign up
                </Button>
              </Flex>
            </FormBox>
          </Specimen>
        </div>
      </DemoSection>
    </main>
  );
}
