import { useState, type ReactNode } from "react";
import {
  // layouts
  Flex,
  FlexItem,
  Grid,
  GridItem,
  Section,
  // compositions
  Card,
  CardGrid,
  Footer,
  FormBox,
  Header,
  Hero,
  Panel,
  PricingCard,
  PricingCardSkeleton,
  ProductInfoCard,
  ProductInfoCardSkeleton,
  ReviewCard,
  StatsCard,
  TestimonialCard,
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
  GmhLogo,
  Image,
  Logo,
  Logo2,
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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Badge,
  Checkbox,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
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
  Label,
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  Separator,
  Slider,
  Switch,
  Textarea,
  // icons + hooks
  IconCheck,
  IconChevronDown,
  IconChevronRight,
  IconChevronUp,
  IconInstagram,
  IconLinkedin,
  IconMenu,
  IconMinus,
  IconSearch,
  IconShoppingBag,
  IconStar,
  IconTwitter,
  IconX,
  IconXLogo,
  IconYoutube,
  useMediaQuery,
  type IconSize,
} from "@gmhlab/ui";
import { SlideFooter, SlideHeader } from "@gmhlab/blocks";

const ICON_SIZES: IconSize[] = ["14", "16", "20", "24", "32", "40", "48"];

const ICONS = [
  { name: "IconCheck", Component: IconCheck },
  { name: "IconChevronDown", Component: IconChevronDown },
  { name: "IconChevronRight", Component: IconChevronRight },
  { name: "IconChevronUp", Component: IconChevronUp },
  { name: "IconMenu", Component: IconMenu },
  { name: "IconMinus", Component: IconMinus },
  { name: "IconSearch", Component: IconSearch },
  { name: "IconShoppingBag", Component: IconShoppingBag },
  { name: "IconStar", Component: IconStar },
  { name: "IconX", Component: IconX },
  { name: "IconInstagram", Component: IconInstagram },
  { name: "IconLinkedin", Component: IconLinkedin },
  { name: "IconTwitter", Component: IconTwitter },
  { name: "IconXLogo", Component: IconXLogo },
  { name: "IconYoutube", Component: IconYoutube },
];

const SECTIONS = [
  { id: "typography", label: "Typography" },
  { id: "buttons", label: "Buttons" },
  { id: "badges", label: "Badges" },
  { id: "avatars", label: "Avatars" },
  { id: "forms", label: "Forms" },
  { id: "overlays", label: "Overlays" },
  { id: "icons", label: "Icons" },
  { id: "logos", label: "Logos" },
  { id: "images", label: "Images" },
  { id: "layouts", label: "Layouts" },
  { id: "cards", label: "Cards" },
  { id: "vanity-cards", label: "Vanity cards" },
  { id: "compositions", label: "Compositions" },
];

const img = (seed: string, w: number, h: number) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

/* ————— page scaffolding, built from the design system itself ————— */

/**
 * One gallery section. `variant` alternates so adjacent sections separate
 * without a hand-rolled divider, and every section is a real `Section` so the
 * gallery exercises the same padding/background tokens the apps use.
 */
function Demo({
  id,
  title,
  description,
  variant = "subtle",
  bleed = false,
  children,
}: {
  id: string;
  title: string;
  description?: string;
  variant?: "subtle" | "neutral";
  bleed?: boolean;
  children: ReactNode;
}) {
  return (
    <div id={id} className="scroll-mt-28">
      <Section
        variant={variant}
        paddingTop="1600"
        paddingBottom={bleed ? "800" : "1600"}
      >
        <Flex container direction="column" gap="1200" alignSecondary="stretch">
          <TextContentHeading heading={title} subheading={description} />
          {bleed ? null : (
            <Flex direction="column" gap="800" alignSecondary="stretch">
              {children}
            </Flex>
          )}
        </Flex>
      </Section>
      {bleed ? children : null}
    </div>
  );
}

/**
 * A single specimen. `Card` forces `.card-content > *` to full width, so the
 * label is wrapped in a Flex row to keep the TextCode pill intrinsically sized.
 */
function Spec({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Card variant="stroke" padding="600" className={`h-full ${className ?? ""}`}>
      <Flex gap="200" alignSecondary="center" wrap>
        <TextCode>{label}</TextCode>
      </Flex>
      {children}
    </Card>
  );
}

/**
 * A row of specimens. Column count comes from Flex's grid `type`, which
 * collapses to a single column on mobile via the responsive ratio tokens.
 */
function SpecRow({
  type = "half",
  children,
}: {
  type?: "half" | "third" | "quarter";
  children: ReactNode;
}) {
  return (
    <Flex type={type} wrap gap="600" alignSecondary="stretch">
      {children}
    </Flex>
  );
}

/** A specimen cell. `size="minor"` only resolves under a sized parent Flex. */
function SpecCell({ children }: { children: ReactNode }) {
  return <FlexItem size="minor">{children}</FlexItem>;
}

/** A neutral swatch used to make layout boxes visible without inventing chrome. */
function Tile({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-md bg-accent px-4 py-3 text-center text-sm text-accent-foreground">
      {children}
    </div>
  );
}

/** Full-bleed compositions get a caption instead of a Card wrapper. */
function BleedSpec({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Flex direction="column" gap="400" alignSecondary="stretch">
      <Section variant="subtle" paddingTop="0" paddingBottom="0">
        <Flex container>
          <TextCode>{label}</TextCode>
        </Flex>
      </Section>
      {children}
    </Flex>
  );
}

export function ComponentsPage() {
  const [signedIn, setSignedIn] = useState(false);
  const { isMobile, isTablet, isDesktop } = useMediaQuery();
  const breakpoint = isMobile
    ? "mobile"
    : isTablet
      ? "tablet"
      : isDesktop
        ? "desktop"
        : "unknown";

  return (
    <main>
      <Hero variant="brand" padding="1600">
        <GmhLogo />
        <TextContentTitle
          align="center"
          title="Component gallery"
          subtitle="Every primitive, layout, and composition exported from @gmhlab/ui, rendered with the design system's own Section, Flex, Card, and Text components. If something here looks broken, the package is broken."
        />
        <Flex gap="300" alignPrimary="center" wrap>
          <Badge variant="secondary">{breakpoint}</Badge>
          <Badge variant="outline">press d for dark mode</Badge>
        </Flex>
      </Hero>

      {/* Sticky section nav. The sticky wrapper is a plain div rather than the
          Section itself — `.section` sets `position: relative`, which would
          race a Tailwind `sticky` utility at equal specificity. */}
      <div className="sticky top-14 z-40">
        <Section variant="neutral" padding="400">
          <Flex container>
            {/* The nav scrolls sideways rather than wrapping — thirteen ghost
                buttons wrapping would make the sticky bar tall enough to eat a
                phone viewport. `w-max` keeps the row at its natural width so
                the wrapper has something to scroll, and `min-w-0` lets the
                wrapper shrink below that width as a flex item. */}
            <div className="w-full min-w-0 overflow-x-auto">
              <Flex gap="100" alignSecondary="center" className="w-max">
                {SECTIONS.map((section) => (
                  <Button
                    key={section.id}
                    size="sm"
                    variant="ghost"
                    nativeButton={false}
                    render={<a href={`#${section.id}`} />}
                  >
                    {section.label}
                  </Button>
                ))}
              </Flex>
            </div>
          </Flex>
        </Section>
      </div>

      <Demo
        id="typography"
        title="Typography"
        description="The Text family — titles, body copy, lists, price, and the content groupings that pair them."
      >
        <Spec label="TextTitleHero / TextTitlePage / TextSubtitle / TextHeading / TextSubheading">
          <Flex direction="column" gap="300" alignSecondary="stretch">
            <TextTitleHero>Title hero</TextTitleHero>
            <TextTitlePage>Title page</TextTitlePage>
            <TextSubtitle>Subtitle — supporting copy under a title</TextSubtitle>
            <TextHeading>Heading</TextHeading>
            <TextSubheading>Subheading</TextSubheading>
          </Flex>
        </Spec>

        <SpecRow>
          <SpecCell>
            <Spec label="Text / TextStrong / TextEmphasis / TextSmall / TextCode">
              <Flex direction="column" gap="200" alignSecondary="stretch">
                <Text>
                  Body text with <TextStrong>strong</TextStrong>,{" "}
                  <TextEmphasis>emphasis</TextEmphasis>, and{" "}
                  <TextCode>code()</TextCode> inline.
                </Text>
                <TextSmall>
                  Small body text with{" "}
                  <TextSmallStrong>small strong</TextSmallStrong>.
                </TextSmall>
                <Text lineHeight="single">
                  Body text with lineHeight="single" for tighter leading.
                </Text>
              </Flex>
            </Spec>
          </SpecCell>
          <SpecCell>
            <Spec label="Text lineClamp={2}">
              <Text lineClamp={2}>
                This paragraph is intentionally long so that the two-line clamp
                can be verified. It keeps going and going past the point where
                two lines of text would normally end, and then a bit further
                still, so the ellipsis has something to truncate.
              </Text>
            </Spec>
          </SpecCell>
          <SpecCell>
            <Spec label='TextPrice size="large" / size="small"'>
              <Flex gap="800" alignSecondary="center" wrap>
                <TextPrice currency="$" price="29" label="/ mo" size="large" />
                <TextPrice currency="$" price="290" label="/ yr" size="small" />
              </Flex>
            </Spec>
          </SpecCell>
          <SpecCell>
            <Spec label="TextList (default + tight) / TextLinkList">
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
                    <TextLink href="#typography">Documentation</TextLink>
                  </TextListItem>
                  <TextListItem>
                    <TextLink href="#typography">Changelog</TextLink>
                  </TextListItem>
                </TextLinkList>
              </Flex>
            </Spec>
          </SpecCell>
          <SpecCell>
            <Spec label='TextContentHeading align="start" / "center"'>
              <Flex direction="column" gap="600" alignSecondary="stretch">
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
            </Spec>
          </SpecCell>
          <SpecCell>
            <Spec label="TextContentTitle (hero on desktop, page on mobile)">
              <TextContentTitle
                title="Content title"
                subtitle="Swaps TextTitleHero for TextTitlePage below the tablet breakpoint"
              />
            </Spec>
          </SpecCell>
        </SpecRow>

        <Spec label="TextLink / Separator (horizontal + vertical)">
          <Flex direction="column" gap="400" alignSecondary="stretch">
            <Text>
              Body copy with an inline{" "}
              <TextLink href="#typography">TextLink</TextLink> running through
              it.
            </Text>
            <Separator />
            <Flex gap="400" alignSecondary="center" className="h-6">
              <TextSmall>Docs</TextSmall>
              <Separator orientation="vertical" />
              <TextSmall>Blog</TextSmall>
              <Separator orientation="vertical" />
              <TextSmall>Source</TextSmall>
            </Flex>
          </Flex>
        </Spec>
      </Demo>

      <Demo
        id="buttons"
        title="Buttons"
        description="Base UI button primitives with shadcn styling. Every button here reports to the event log in the nav bar."
        variant="neutral"
      >
        <Spec label="Button variants × sizes">
          <Flex direction="column" gap="400" alignSecondary="stretch">
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
                  >
                    {variant} {size}
                  </Button>
                ))}
              </Flex>
            ))}
          </Flex>
        </Spec>

        <SpecRow type="third">
          <SpecCell>
            <Spec label="Button disabled">
              <Flex gap="300" wrap>
                <Button disabled>default</Button>
                <Button variant="outline" disabled>
                  outline
                </Button>
                <Button variant="ghost" disabled>
                  ghost
                </Button>
              </Flex>
            </Spec>
          </SpecCell>
          <SpecCell>
            {/* `nativeButton={false}` is required whenever `render` swaps in a
                non-<button> element — Base UI otherwise keeps native button
                semantics it can no longer rely on, and warns at runtime. */}
            <Spec label="Button render={<a />} (render prop)">
              <Flex gap="300" wrap>
                <Button
                  variant="outline"
                  nativeButton={false}
                  render={<a href="#buttons" />}
                >
                  Anchor button
                </Button>
                <Button
                  variant="link"
                  nativeButton={false}
                  render={<a href="#buttons" />}
                >
                  Link button
                </Button>
              </Flex>
            </Spec>
          </SpecCell>
          <SpecCell>
            <Spec label='size="icon-sm" / "icon" / "icon-lg"'>
              <Flex gap="300" wrap alignSecondary="center">
                {(["icon-sm", "icon", "icon-lg"] as const).map((size) => (
                  <Button
                    key={size}
                    size={size}
                    variant="outline"
                    aria-label={`Star (${size})`}
                  >
                    <IconStar />
                  </Button>
                ))}
              </Flex>
            </Spec>
          </SpecCell>
        </SpecRow>

        <SpecRow>
          <SpecCell>
            <Spec label="ButtonGroup (segmented — attached buttons)">
              <Flex direction="column" gap="400" alignSecondary="start">
                {(["horizontal", "vertical"] as const).map((orientation) => (
                  <ButtonGroup key={orientation} orientation={orientation}>
                    {["Day", "Week", "Month"].map((span) => (
                      <Button
                        key={span}
                        variant="outline"
                      >
                        {span}
                      </Button>
                    ))}
                  </ButtonGroup>
                ))}
              </Flex>
            </Spec>
          </SpecCell>
          <SpecCell>
            <Spec label="ButtonGroupText + ButtonGroupSeparator">
              <ButtonGroup>
                <Button
                  variant="outline"
                >
                  Prev
                </Button>
                <ButtonGroupSeparator />
                <ButtonGroupText>Page 2</ButtonGroupText>
                <ButtonGroupSeparator />
                <Button
                  variant="outline"
                >
                  Next
                </Button>
              </ButtonGroup>
            </Spec>
          </SpecCell>
        </SpecRow>

        <Spec label="Laying buttons out — use Flex, not ButtonGroup">
          <Flex direction="column" gap="400" alignSecondary="stretch">
            <Flex gap="300" alignSecondary="center">
              <Button variant="outline">
                Cancel
              </Button>
              <Button>Save</Button>
            </Flex>
            <Flex gap="300" alignSecondary="center">
              <Button
                className="flex-1"
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
              >
                Save
              </Button>
            </Flex>
            <Flex direction="column" gap="300" alignSecondary="stretch">
              <Button
                variant="outline"
              >
                Cancel
              </Button>
              <Button>Save</Button>
            </Flex>
          </Flex>
        </Spec>
      </Demo>

      <Demo
        id="badges"
        title="Badges"
        description="All nine variants, including the three status tones (info / warning / success) that alias the MFY semantic token pairs."
      >
        <SpecRow>
          <SpecCell>
            <Spec label="Badge: core variants">
              <Flex gap="200" wrap alignSecondary="center">
                <Badge>default</Badge>
                <Badge variant="secondary">secondary</Badge>
                <Badge variant="destructive">destructive</Badge>
                <Badge variant="outline">outline</Badge>
                <Badge variant="ghost">ghost</Badge>
                <Badge variant="link">link</Badge>
              </Flex>
            </Spec>
          </SpecCell>
          <SpecCell>
            <Spec label="Badge: status tones + icon + link">
              <Flex direction="column" gap="400" alignSecondary="stretch">
                <Flex gap="200" wrap alignSecondary="center">
                  <Badge variant="info">info</Badge>
                  <Badge variant="warning">warning</Badge>
                  <Badge variant="success">success</Badge>
                </Flex>
                <Flex gap="200" wrap alignSecondary="center">
                  <Badge variant="success">
                    <IconCheck /> verified
                  </Badge>
                  <Badge render={<a href="#badges" />}>badge link</Badge>
                </Flex>
              </Flex>
            </Spec>
          </SpecCell>
        </SpecRow>
      </Demo>

      <Demo
        id="avatars"
        title="Avatars"
        description="Image with fallback across three sizes, the AvatarBadge status dot, and AvatarGroup overflow."
        variant="neutral"
      >
        <SpecRow type="third">
          <SpecCell>
            <Spec label='size="sm" / default / "lg" — fallback & image'>
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
            </Spec>
          </SpecCell>
          <SpecCell>
            <Spec label="AvatarBadge (status dot)">
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
            </Spec>
          </SpecCell>
          <SpecCell>
            <Spec label="AvatarGroup + AvatarGroupCount">
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
            </Spec>
          </SpecCell>
        </SpecRow>
      </Demo>

      <Demo
        id="forms"
        title="Forms"
        description="Field composition, the full control set — Checkbox, Switch, RadioGroup, Select, Slider, Textarea — plus InputGroup and Kbd."
      >
        <SpecRow type="third">
          <SpecCell>
            <Spec label="Field + FieldLabel + Input + FieldDescription">
              <Field>
                <FieldLabel htmlFor="demo-email">Email</FieldLabel>
                <Input
                  id="demo-email"
                  name="email"
                  placeholder="you@example.com"
                />
                <FieldDescription>We never share your email.</FieldDescription>
              </Field>
            </Spec>
          </SpecCell>
          <SpecCell>
            <Spec label="Invalid Field + FieldError">
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
            </Spec>
          </SpecCell>
          <SpecCell>
            <Spec label="Disabled Field / bare Input / Label">
              <Flex direction="column" gap="400" alignSecondary="stretch">
                <Field data-disabled={true}>
                  <FieldLabel htmlFor="demo-disabled">Disabled</FieldLabel>
                  <Input
                    id="demo-disabled"
                    disabled
                    placeholder="Can't touch this"
                  />
                </Field>
                <Label htmlFor="demo-bare">Bare Label + Input</Label>
                <Input id="demo-bare" placeholder="Bare Input primitive" />
              </Flex>
            </Spec>
          </SpecCell>
        </SpecRow>

        <SpecRow>
          <SpecCell>
            <Spec label="FieldSet + FieldLegend + FieldGroup">
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
            </Spec>
          </SpecCell>
          <SpecCell>
            <Spec label="Checkbox / Switch / RadioGroup / Textarea">
              <Flex direction="column" gap="600" alignSecondary="stretch">
                <Field orientation="horizontal">
                  <Checkbox id="demo-terms" defaultChecked />
                  <FieldLabel htmlFor="demo-terms" className="font-normal">
                    Accept terms and conditions
                  </FieldLabel>
                </Field>
                <Field orientation="horizontal">
                  <Switch id="demo-notifications" defaultChecked />
                  <FieldLabel
                    htmlFor="demo-notifications"
                    className="font-normal"
                  >
                    Email notifications
                  </FieldLabel>
                </Field>
                <RadioGroup defaultValue="comfortable">
                  <Field orientation="horizontal">
                    <RadioGroupItem value="compact" id="demo-radio-compact" />
                    <FieldLabel
                      htmlFor="demo-radio-compact"
                      className="font-normal"
                    >
                      Compact
                    </FieldLabel>
                  </Field>
                  <Field orientation="horizontal">
                    <RadioGroupItem
                      value="comfortable"
                      id="demo-radio-comfortable"
                    />
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
            </Spec>
          </SpecCell>
        </SpecRow>

        <SpecRow type="third">
          <SpecCell>
            <Spec label="Select (grouped, with separator)">
              <Field>
                <FieldLabel>Deployment region</FieldLabel>
                <Select defaultValue="us-east">
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Americas</SelectLabel>
                      <SelectItem value="us-east">US East</SelectItem>
                      <SelectItem value="us-west">US West</SelectItem>
                    </SelectGroup>
                    <SelectSeparator />
                    <SelectGroup>
                      <SelectLabel>Europe</SelectLabel>
                      <SelectItem value="eu-west">EU West</SelectItem>
                      <SelectItem value="eu-north">EU North</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            </Spec>
          </SpecCell>
          <SpecCell>
            <Spec label="Slider (single value + range)">
              <Flex direction="column" gap="800" alignSecondary="stretch">
                <Slider defaultValue={40} />
                <Slider defaultValue={[20, 70]} />
                <Slider defaultValue={50} disabled />
              </Flex>
            </Spec>
          </SpecCell>
          <SpecCell>
            <Spec label="InputGroup + Kbd">
              <Flex direction="column" gap="600" alignSecondary="stretch">
                <InputGroup>
                  <InputGroupAddon>
                    <IconSearch />
                  </InputGroupAddon>
                  <InputGroupInput
                    type="search"
                    placeholder="Search components…"
                    aria-label="Search"
                  />
                </InputGroup>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                  }}
                >
                  <InputGroup>
                    <InputGroupInput
                      type="email"
                      placeholder="you@example.com"
                      aria-label="Email"
                    />
                    <InputGroupAddon align="inline-end">
                      <InputGroupButton type="submit">
                        Subscribe
                      </InputGroupButton>
                    </InputGroupAddon>
                  </InputGroup>
                </form>
                <Text>
                  Save with <Kbd>⌘S</Kbd>, search with <Kbd>⌘K</Kbd>
                </Text>
              </Flex>
            </Spec>
          </SpecCell>
        </SpecRow>
      </Demo>

      <Demo
        id="overlays"
        title="Overlays & menus"
        description="Dialog, DropdownMenu, Menubar, NavigationMenu, and Accordion — the Base UI portalled primitives."
        variant="neutral"
      >
        <SpecRow type="third">
          <SpecCell>
            <Spec label="Dialog">
              <Dialog>
                <DialogTrigger render={<Button variant="outline" />}>
                  Open dialog
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete workspace</DialogTitle>
                    <DialogDescription>
                      This removes every project in the workspace. It cannot be
                      undone.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <DialogClose render={<Button variant="outline" />}>
                      Cancel
                    </DialogClose>
                    <Button
                      variant="destructive"
                    >
                      Delete
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </Spec>
          </SpecCell>
          <SpecCell>
            <Spec label="DropdownMenu (labels, shortcuts, checkbox items)">
              <DropdownMenu>
                <DropdownMenuTrigger render={<Button variant="outline" />}>
                  Open menu <IconChevronDown />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuLabel>My account</DropdownMenuLabel>
                  <DropdownMenuItem>
                    Profile
                    <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Settings
                    <DropdownMenuShortcut>⌘,</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem defaultChecked>
                    Show hidden files
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant="destructive"
                  >
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </Spec>
          </SpecCell>
          <SpecCell>
            <Spec label="Menubar">
              <Menubar>
                <MenubarMenu>
                  <MenubarTrigger>File</MenubarTrigger>
                  <MenubarContent>
                    <MenubarItem>
                      New tab
                      <MenubarShortcut>⌘T</MenubarShortcut>
                    </MenubarItem>
                    <MenubarItem>
                      New window
                    </MenubarItem>
                    <MenubarSeparator />
                    <MenubarItem>
                      Print…
                      <MenubarShortcut>⌘P</MenubarShortcut>
                    </MenubarItem>
                  </MenubarContent>
                </MenubarMenu>
                <MenubarMenu>
                  <MenubarTrigger>View</MenubarTrigger>
                  <MenubarContent>
                    <MenubarCheckboxItem defaultChecked>
                      Show sidebar
                    </MenubarCheckboxItem>
                    <MenubarCheckboxItem>Show ruler</MenubarCheckboxItem>
                  </MenubarContent>
                </MenubarMenu>
              </Menubar>
            </Spec>
          </SpecCell>
        </SpecRow>

        <SpecRow>
          <SpecCell>
            <Spec label="NavigationMenu">
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>Products</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <Flex direction="column" gap="100" className="w-64">
                        <NavigationMenuLink href="#overlays">
                          <IconShoppingBag /> Storefront
                        </NavigationMenuLink>
                        <NavigationMenuLink href="#overlays">
                          <IconStar /> Reviews
                        </NavigationMenuLink>
                        <NavigationMenuLink href="#overlays">
                          <IconSearch /> Discovery
                        </NavigationMenuLink>
                      </Flex>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>Company</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <Flex direction="column" gap="100" className="w-64">
                        <NavigationMenuLink href="#overlays">
                          About
                        </NavigationMenuLink>
                        <NavigationMenuLink href="#overlays">
                          Careers
                        </NavigationMenuLink>
                      </Flex>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </Spec>
          </SpecCell>
          <SpecCell>
            <Spec label="Accordion">
              <Accordion defaultValue={["item-1"]}>
                <AccordionItem value="item-1">
                  <AccordionTrigger>
                    What ships in @gmhlab/ui?
                  </AccordionTrigger>
                  <AccordionContent>
                    Primitives, layouts, and compositions — plus the tokens CSS,
                    inlined into a single stylesheet at build time.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>Which styling system?</AccordionTrigger>
                  <AccordionContent>
                    Two coexist: shadcn primitives on Tailwind utilities, and
                    MFY layout components on co-located CSS driven by --mfy-*
                    tokens.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>How does theming work?</AccordionTrigger>
                  <AccordionContent>
                    Both systems key off the same .dark class on the html
                    element, so they switch together.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </Spec>
          </SpecCell>
        </SpecRow>
      </Demo>

      <Demo
        id="icons"
        title="Icons"
        description="The exported icon set, and the Icon size scale. Stroke colour comes from --svg-stroke-color; IconXLogo is the one filled glyph."
      >
        <Spec label={`Icon size scale: ${ICON_SIZES.join(" / ")}`}>
          <Flex gap="600" alignSecondary="end" wrap>
            {ICON_SIZES.map((size) => (
              <Flex
                key={size}
                direction="column"
                gap="200"
                alignSecondary="center"
              >
                <IconStar size={size} />
                <TextSmall>{size}</TextSmall>
              </Flex>
            ))}
          </Flex>
        </Spec>

        <Spec label="Exported icons (size 24)">
          <Grid
            columns="repeat(auto-fill, minmax(120px, 1fr))"
            gap="600"
            justifyItems="center"
          >
            {ICONS.map(({ name, Component }) => (
              <GridItem key={name}>
                <Flex direction="column" gap="200" alignSecondary="center">
                  <Component size="24" />
                  <TextSmall>{name}</TextSmall>
                </Flex>
              </GridItem>
            ))}
          </Grid>
        </Spec>
      </Demo>

      <Demo
        id="logos"
        title="Logos"
        description="All three marks. GmhLogo is the one in use — the landscape brand mark, sized by height. All three default to href='/' and render as links; that default is currently not overridable to a non-navigating button (see GmhLogoProps)."
        variant="neutral"
      >
        <SpecRow type="third">
          <SpecCell>
            <Spec label="GmhLogo (in use — headers & footers)">
              <Flex alignPrimary="center" alignSecondary="center">
                <GmhLogo />
              </Flex>
            </Spec>
          </SpecCell>
          <SpecCell>
            <Spec label="Logo (stroked, portrait — unreferenced)">
              <Flex alignPrimary="center" alignSecondary="center">
                <Logo />
              </Flex>
            </Spec>
          </SpecCell>
          <SpecCell>
            <Spec label="Logo2 (filled, portrait — unreferenced)">
              <Flex alignPrimary="center" alignSecondary="center">
                <Logo2 />
              </Flex>
            </Spec>
          </SpecCell>
        </SpecRow>

        <Spec label="--logo-color inverts inside .section-variant-brand">
          <Section variant="brand" padding="800" className="rounded-md">
            <Flex alignPrimary="center" alignSecondary="center" gap="800" wrap>
              <GmhLogo aria-label="GMH Lab on brand" />
              <Logo2 aria-label="Logo 2 on brand" />
            </Flex>
          </Section>
        </Spec>
      </Demo>

      <Demo
        id="images"
        title="Images"
        description="Aspect ratios, sizes, variants, and the built-in loading placeholder."
      >
        <SpecRow type="third">
          <SpecCell>
            <Spec label='aspectRatio="1-1"'>
              <Image
                src={img("sq", 400, 400)}
                alt="Square"
                aspectRatio="1-1"
                size="medium"
              />
            </Spec>
          </SpecCell>
          <SpecCell>
            <Spec label='aspectRatio="16-9"'>
              <Image
                src={img("wide", 640, 360)}
                alt="Wide"
                aspectRatio="16-9"
                size="medium"
              />
            </Spec>
          </SpecCell>
          <SpecCell>
            <Spec label='aspectRatio="4-3"'>
              <Image
                src={img("std", 640, 480)}
                alt="Standard"
                aspectRatio="4-3"
                size="medium"
              />
            </Spec>
          </SpecCell>
          <SpecCell>
            <Spec label='variant="default" (no radius)'>
              <Image
                src={img("sharp", 640, 360)}
                alt="Sharp corners"
                aspectRatio="16-9"
                size="medium"
                variant="default"
              />
            </Spec>
          </SpecCell>
          <SpecCell>
            <Spec label='size="small"'>
              <Image
                src={img("small", 320, 240)}
                alt="Small"
                aspectRatio="4-3"
                size="small"
              />
            </Spec>
          </SpecCell>
          <SpecCell>
            <Spec label="no src (loading placeholder)">
              <Image alt="Placeholder" aspectRatio="16-9" size="medium" />
            </Spec>
          </SpecCell>
        </SpecRow>
      </Demo>

      <Demo
        id="layouts"
        title="Layouts"
        description="Flex and Grid sizing, and the Section variants. The /flex page carries the deeper Flex sizing matrix."
        variant="neutral"
      >
        <SpecRow>
          <SpecCell>
            <Spec label='Flex type="quarter" wrap + FlexItem size="minor"'>
              <Flex type="quarter" wrap gap="400">
                {["A", "B", "C", "D"].map((label) => (
                  <FlexItem key={label} size="minor">
                    <Tile>{label}</Tile>
                  </FlexItem>
                ))}
              </Flex>
            </Spec>
          </SpecCell>
          <SpecCell>
            <Spec label='Flex type="third" — major / minor split'>
              <Flex type="third" wrap gap="400">
                <FlexItem size="major">
                  <Tile>major (2/3)</Tile>
                </FlexItem>
                <FlexItem size="minor">
                  <Tile>minor (1/3)</Tile>
                </FlexItem>
              </Flex>
            </Spec>
          </SpecCell>
        </SpecRow>

        <Spec label='Grid columns="repeat(4, 1fr)" + GridItem column spans'>
          <Grid columns="repeat(4, 1fr)" gap="400">
            <GridItem column="span 4">
              <Tile>span 4</Tile>
            </GridItem>
            <GridItem column="span 2">
              <Tile>span 2</Tile>
            </GridItem>
            <GridItem column="span 2">
              <Tile>span 2</Tile>
            </GridItem>
            {["1", "2", "3", "4"].map((label) => (
              <GridItem key={label}>
                <Tile>{label}</Tile>
              </GridItem>
            ))}
          </Grid>
        </Spec>

        <Spec label='Section variants (padding="600")'>
          <Flex direction="column" gap="400" alignSecondary="stretch">
            {(["subtle", "neutral", "stroke", "brand"] as const).map(
              (variant) => (
                <Section
                  key={variant}
                  variant={variant}
                  padding="600"
                  className="rounded-md"
                >
                  <Flex container>
                    <Text>Section variant="{variant}"</Text>
                  </Flex>
                </Section>
              ),
            )}
            <Section
              variant="image"
              src={img("section", 1200, 300)}
              padding="600"
              className="rounded-md"
            >
              <Flex container>
                <Text>Section variant="image"</Text>
              </Flex>
            </Section>
          </Flex>
        </Spec>
      </Demo>

      <Demo
        id="cards"
        title="Cards"
        description="The generic Card — variants, padding, direction, assets, and the whole-card press target."
      >
        <SpecRow type="third">
          {(["default", "stroke", "brand"] as const).map((variant) => (
            <SpecCell key={variant}>
              <Spec label={`Card variant="${variant}"`}>
                <Card variant={variant} padding="600">
                  <TextHeading>{variant}</TextHeading>
                  <Text>Card body content sits inside card-content.</Text>
                </Card>
              </Spec>
            </SpecCell>
          ))}
        </SpecRow>

        <SpecRow>
          <SpecCell>
            <Spec label='Card direction="horizontal" with an Image asset'>
              <Card
                variant="stroke"
                padding="600"
                direction="horizontal"
                asset={
                  <Image
                    src={img("cardh", 640, 480)}
                    alt=""
                    aspectRatio="4-3"
                    size="fill"
                  />
                }
              >
                <TextHeading>Horizontal card</TextHeading>
                <Text>
                  The asset renders beside the content on desktop and stacks on
                  mobile.
                </Text>
              </Card>
            </Spec>
          </SpecCell>
          <SpecCell>
            <Spec label='Card interactionProps + align="center"'>
              <Card
                variant="brand"
                padding="800"
                align="center"
                interactionProps={{ onPress: () => {} }}
              >
                <TextHeading>Pressable card</TextHeading>
                <Text>Click anywhere on this card.</Text>
              </Card>
            </Spec>
          </SpecCell>
        </SpecRow>

        <Spec label="CardGrid (heading + responsive card row)">
          <CardGrid
            heading="CardGrid"
            subheading="Column count comes from the Flex grid type; section chrome is left to the caller."
            type="third"
            gap="400"
          >
            {["Discovery", "Delivery", "Support"].map((title) => (
              <FlexItem key={title} size="minor">
                <Card variant="stroke" padding="600">
                  <TextHeading>{title}</TextHeading>
                  <Text>A card inside a CardGrid.</Text>
                </Card>
              </FlexItem>
            ))}
          </CardGrid>
        </Spec>
      </Demo>

      <Demo
        id="vanity-cards"
        title="Vanity cards"
        description="PricingCard, ProductInfoCard, ReviewCard, StatsCard, TestimonialCard — and the two skeletons."
        variant="neutral"
      >
        <Spec label='PricingCard size="large" (stroke / brand) + PricingCardSkeleton'>
          <Flex type="third" wrap gap="400" alignSecondary="stretch">
            <FlexItem size="minor">
              <PricingCard
                sku="1-basic"
                interval="month"
                heading="Basic"
                price="9"
                priceCurrency="$"
                priceLabel="/ mo"
                action="Select Basic"
                onAction={() => {}}
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
                actionIcon={<IconChevronRight />}
                onAction={() => {}}
                list={[
                  "Unlimited projects",
                  "Priority support",
                  "100 GB storage",
                ]}
              />
            </FlexItem>
            <FlexItem size="minor">
              <PricingCardSkeleton size="large" />
            </FlexItem>
          </Flex>
        </Spec>

        <Spec label='PricingCard size="small" / actionDisabled'>
          <Flex type="third" wrap gap="400" alignSecondary="stretch">
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
                onAction={() => {}}
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
                onAction={() => {}}
                list={["You are on this plan"]}
              />
            </FlexItem>
          </Flex>
        </Spec>

        <Spec label="ProductInfoCard + ProductInfoCardSkeleton">
          <Flex type="third" wrap gap="400" alignSecondary="stretch">
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
        </Spec>

        <Spec label="ReviewCard / StatsCard / TestimonialCard">
          <Flex type="third" wrap gap="400" alignSecondary="stretch">
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
        </Spec>
      </Demo>

      <Demo
        id="compositions"
        title="Page compositions"
        description="The page-scale pieces, rendered full-bleed at the width they are designed for."
        bleed
      >
        <Flex direction="column" gap="1200" alignSecondary="stretch">
          <BleedSpec label="Header — logged out / logged in (toggle below)">
            <Flex direction="column" gap="400" alignSecondary="stretch">
              <Header
                user={signedIn ? { name: "Ada Lovelace" } : null}
                onLogin={() => setSignedIn(true)}
                onRegister={() => setSignedIn(true)}
                onLogout={() => setSignedIn(false)}
              />
              <Section variant="subtle" paddingTop="0" paddingBottom="0">
                <Flex container gap="300" alignSecondary="center">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSignedIn((value) => !value)}
                  >
                    {signedIn ? "Sign out" : "Sign in"}
                  </Button>
                  <TextSmall>
                    HeaderAuth swaps the auth buttons for an avatar menu, and
                    collapses to a hamburger below 600px.
                  </TextSmall>
                </Flex>
              </Section>
            </Flex>
          </BleedSpec>

          <BleedSpec label='Hero variant="stroke" with TextContentTitle + actions'>
            <Hero variant="stroke">
              <TextContentTitle
                align="center"
                title="Build with gmhlab"
                subtitle="A hero composition: Section plus a centered Flex container"
              />
              <Flex gap="300" alignPrimary="center" alignSecondary="center">
                <Button variant="outline">
                  Learn more
                </Button>
                <Button>Get started</Button>
              </Flex>
            </Hero>
          </BleedSpec>

          <BleedSpec label="Panel holding StatsCards">
            <Section variant="neutral" padding="1200">
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
            </Section>
          </BleedSpec>

          <BleedSpec label="SlideHeader / SlideFooter (default chrome)">
            <div>
              <SlideHeader
                start="VERSION 1.0"
                center="©2026 GMH LAB"
                end="PAGE 01"
              />
              <SlideFooter
                start="GMH LAB"
                center="COMPONENT GALLERY"
                end="AUGUST 2026"
              />
            </div>
          </BleedSpec>

          <BleedSpec label="SlideHeader / SlideFooter bare, on a brand Section">
            <Section variant="brand" padding="800">
              <Flex
                container
                direction="column"
                gap="800"
                alignSecondary="stretch"
              >
                <SlideHeader
                  bare
                  start="BARE HEADER"
                  center="ON A BRAND SURFACE"
                  end="NO CHROME"
                />
                <TextHeading>Brand surface content</TextHeading>
                <SlideFooter
                  bare
                  start="BARE FOOTER"
                  center="SAME SURFACE"
                  end="FLUSH"
                />
              </Flex>
            </Section>
          </BleedSpec>

          <BleedSpec label="FormBox (boxed form) with Fields">
            <Section variant="subtle" paddingTop="0" paddingBottom="800">
              <Flex container>
                <FormBox
                  onSubmit={(e) => {
                    e.preventDefault();
                  }}
                >
                  <TextHeading>Create account</TextHeading>
                  <Field>
                    <FieldLabel htmlFor="signup-name">Name</FieldLabel>
                    <Input
                      id="signup-name"
                      name="name"
                      placeholder="Ada Lovelace"
                    />
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
                  <Button type="submit">Sign up</Button>
                </FormBox>
              </Flex>
            </Section>
          </BleedSpec>

          <BleedSpec label="Footer (brand surface, quarter columns)">
            <Footer />
          </BleedSpec>
        </Flex>
      </Demo>
    </main>
  );
}
