import type { ReactNode } from "react";
import {
  Button,
  ButtonGroup,
  Flex,
  Grid,
  IconStar,
  Section,
  Text,
  TextCode,
  TextHeading,
  TextSmall,
  TextStrong,
  TextSubheading,
  TextTitlePage,
  cn,
} from "@gmhlab/ui";
import { useTheme } from "../components/theme-provider";

/* ------------------------------------------------------------------ */
/* Page scaffolding, built from the MFY layout + composition stack     */
/* ------------------------------------------------------------------ */

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Flex direction="column" gap="100" className="mb-4 last:mb-0">
      <TextSmall className="font-semibold tracking-wider uppercase text-[var(--mfy-color-text-default-tertiary)]">
        {label}
      </TextSmall>
      <Flex gap="300" alignSecondary="center" wrap>
        {children}
      </Flex>
    </Flex>
  );
}

function Callout({
  variant,
  children,
}: {
  variant: "bad" | "warn" | "info" | "good";
  children: ReactNode;
}) {
  const styles = {
    bad: "border-[var(--mfy-color-border-danger-tertiary)] bg-[var(--mfy-color-background-danger-tertiary)]",
    warn: "border-[var(--mfy-color-border-warning-tertiary)] bg-[var(--mfy-color-background-warning-tertiary)]",
    info: "border-[var(--mfy-color-border-default-default)] bg-[var(--mfy-color-background-default-secondary)]",
    good: "border-[var(--mfy-color-border-positive-tertiary)] bg-[var(--mfy-color-background-positive-tertiary)]",
  } as const;
  return (
    <Flex
      direction="column"
      gap="200"
      className={cn("rounded-lg border px-4.5 py-4", styles[variant])}
    >
      {children}
    </Flex>
  );
}

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="overflow-x-auto rounded-lg border border-[var(--mfy-color-border-default-default)] bg-[var(--mfy-color-background-default-secondary)] p-4 font-mono text-[0.8125rem] leading-relaxed">
      <code>{children}</code>
    </pre>
  );
}

function CmpTable({ head, rows }: { head: string[]; rows: ReactNode[][] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            {head.map((h) => (
              <th
                key={h}
                className="border-b border-[var(--mfy-color-border-default-default)] px-3 py-2 text-left text-[0.6875rem] tracking-wider uppercase text-[var(--mfy-color-text-default-secondary)]"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((cells, i) => (
            <tr key={i}>
              {cells.map((cell, j) => (
                <td
                  key={j}
                  className={cn(
                    "border-b border-[var(--mfy-color-border-default-default)] px-3 py-2 align-top",
                    j === 0 && "font-semibold whitespace-nowrap",
                  )}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MigrationSection({
  title,
  lede,
  children,
}: {
  title: string;
  lede?: ReactNode;
  children: ReactNode;
}) {
  return (
    <Section variant="stroke" paddingTop="600" paddingBottom="600">
      <Flex direction="column" gap="400" alignSecondary="stretch" container>
        <Flex direction="column" gap="200">
          <TextHeading>{title}</TextHeading>
          {lede && (
            <Text className="max-w-[72ch] text-[var(--mfy-color-text-default-secondary)]">
              {lede}
            </Text>
          )}
        </Flex>
        {children}
      </Flex>
    </Section>
  );
}

const code = (s: string) => <TextCode elementType="span">{s}</TextCode>;

/* ------------------------------------------------------------------ */
/* The page                                                            */
/* ------------------------------------------------------------------ */

export function ButtonMigrationPage() {
  const { theme, setTheme } = useTheme();
  return (
    <>
      <Section
        elementType="header"
        variant="stroke"
        paddingTop="800"
        paddingBottom="600"
      >
        <Flex direction="column" gap="400" alignSecondary="stretch" container>
          <Flex
            alignPrimary="space-between"
            alignSecondary="center"
            wrap
            gap="400"
          >
            <TextTitlePage>Button — SDS → shadcn migration</TextTitlePage>
            <ButtonGroup>
              <Button
                size="sm"
                variant={theme === "light" ? "default" : "outline"}
                onClick={() => setTheme("light")}
              >
                Light
              </Button>
              <Button
                size="sm"
                variant={theme === "dark" ? "default" : "outline"}
                onClick={() => setTheme("dark")}
              >
                Dark
              </Button>
            </ButtonGroup>
          </Flex>
          <TextSubheading className="max-w-[70ch] text-[var(--mfy-color-text-default-secondary)]">
            The react-aria SDS button has been removed from{" "}
            {code("@gmhlab/ui")}. {code("Button")} and {code("ButtonGroup")}{" "}
            now resolve to the shadcn pair (Base UI primitives, shadcn{" "}
            {code("cn-*")} styling, registry style radix-vega). This page is the
            migration record — for live specimens see{" "}
            <a className="underline" href="/components#buttons">
              Components → Buttons
            </a>
            .
          </TextSubheading>
        </Flex>
      </Section>

      <Section paddingTop="600" paddingBottom="0">
        <Flex direction="column" gap="400" alignSecondary="stretch" container>
          <Callout variant="good">
            <Text>
              <TextStrong>Migration complete.</TextStrong>{" "}
              {code("packages/ui/src/primitives/button-sds/")} is deleted. Every
              call site in {code("ui")}, {code("blocks")}, {code("apps/web")}{" "}
              and {code("apps/docs")} now uses the shadcn button. One deliberate
              exception survives — see §3.
            </Text>
          </Callout>
        </Flex>
      </Section>

      <MigrationSection
        title="1. Prop mapping"
        lede={
          <>
            The rename is mechanical, but note that {code("onPress")} →{" "}
            {code("onClick")} is a behaviour change as well as a rename: react-aria
            normalised pointer, touch and keyboard activation into one synthetic
            press event. Base UI relies on the browser's native click, which
            already fires for keyboard activation on a real {code("<button>")}.
          </>
        }
      >
        <CmpTable
          head={["SDS", "shadcn", "Notes"]}
          rows={[
            [code("variant=\"primary\""), code("variant=\"default\""), "Filled brand"],
            [
              code("variant=\"neutral\""),
              code("variant=\"outline\""),
              "Bordered, transparent fill",
            ],
            [code("variant=\"subtle\""), code("variant=\"ghost\""), "No border, no fill"],
            [
              code("<ButtonDanger>"),
              code("variant=\"destructive\""),
              "Separate component collapsed into a variant",
            ],
            [
              code("variant=\"danger-subtle\""),
              "—",
              "No equivalent. Was unused outside this page.",
            ],
            [code("size=\"small\""), code("size=\"sm\""), ""],
            [code("size=\"medium\""), code("size=\"default\""), ""],
            [code("size=\"large\""), code("size=\"lg\""), ""],
            [
              "—",
              code("size=\"icon\" | \"icon-xs\" | \"icon-sm\" | \"icon-lg\""),
              "New: square icon-only sizes",
            ],
            [code("isDisabled"), code("disabled"), "Now the native attribute"],
            [code("onPress"), code("onClick"), "See lede"],
            [
              code("href=\"…\""),
              code("render={<a href=\"…\" />}"),
              "See §4",
            ],
          ]}
        />
        <Row label="Live — variants">
          {(
            ["default", "secondary", "outline", "ghost", "destructive", "link"] as const
          ).map((variant) => (
            <Button key={variant} variant={variant}>
              {variant}
            </Button>
          ))}
        </Row>
        <Row label="Live — sizes">
          {(["xs", "sm", "default", "lg"] as const).map((size) => (
            <Button key={size} size={size} variant="outline">
              {size}
            </Button>
          ))}
          {(["icon-sm", "icon", "icon-lg"] as const).map((size) => (
            <Button key={size} size={size} variant="outline" aria-label={size}>
              <IconStar />
            </Button>
          ))}
        </Row>
      </MigrationSection>

      <MigrationSection
        title="2. ButtonGroup means something else now"
        lede={
          <>
            This is the trap. Both libraries export {code("ButtonGroup")}, but
            they are different components — the name survived the migration, the
            semantics did not.
          </>
        }
      >
        <Callout variant="warn">
          <Text>
            <TextStrong>SDS {code("ButtonGroup")} was a layout wrapper</TextStrong>{" "}
            — {code("align=\"start|center|end|justify|stack\"")}, buttons
            separated by a gap.{" "}
            <TextStrong>shadcn {code("ButtonGroup")} is a segmented control</TextStrong>{" "}
            — buttons are attached, inner radii collapse and adjacent borders
            merge. Swapping one for the other 1:1 silently glues your button
            pairs together.
          </Text>
        </Callout>
        <Grid columns="repeat(auto-fit, minmax(20rem, 1fr))" gap="400">
          <Flex direction="column" gap="200">
            <TextSmall className="font-semibold tracking-wider uppercase text-[var(--mfy-color-text-default-tertiary)]">
              ButtonGroup — for segmented controls
            </TextSmall>
            <ButtonGroup>
              <Button variant="outline">Day</Button>
              <Button variant="outline">Week</Button>
              <Button variant="outline">Month</Button>
            </ButtonGroup>
          </Flex>
          <Flex direction="column" gap="200">
            <TextSmall className="font-semibold tracking-wider uppercase text-[var(--mfy-color-text-default-tertiary)]">
              Flex — for laying buttons out
            </TextSmall>
            <Flex gap="300" alignSecondary="center">
              <Button variant="outline">Cancel</Button>
              <Button>Save</Button>
            </Flex>
          </Flex>
        </Grid>
        <Text>
          All 13 SDS {code("ButtonGroup")} call sites in this repo were layout,
          not segmented controls, so they moved to {code("Flex")}:
        </Text>
        <CmpTable
          head={["SDS", "Replacement"]}
          rows={[
            [
              code("align=\"start\""),
              code("<Flex gap=\"300\" alignSecondary=\"center\">"),
            ],
            [code("align=\"center\""), code("+ alignPrimary=\"center\"")],
            [code("align=\"end\""), code("+ alignPrimary=\"end\"")],
            [
              code("align=\"justify\""),
              <>
                {code("<Flex gap=\"300\">")} plus {code("className=\"flex-1\"")} on
                each button — {code("justify")} set {code("flex: 1")} on
                children, it was never {code("space-between")}
              </>,
            ],
            [
              code("align=\"stack\""),
              code(
                "<Flex direction=\"column\" gap=\"300\" alignSecondary=\"stretch\">",
              ),
            ],
          ]}
        />
      </MigrationSection>

      <MigrationSection
        title="3. TriggerButton is gone — overlays moved to Base UI"
        lede={
          <>
            {code("packages/ui/src/primitives/button-trigger/")} was a reduced
            react-aria button that existed only to satisfy react-aria's overlay
            triggers. Both overlays now come from shadcn, so it has been
            deleted — there is one {code("Button")} again.
          </>
        }
      >
        <Callout variant="bad">
          <Text>
            <TextStrong>Why it used to exist:</TextStrong> react-aria's{" "}
            {code("DialogTrigger")} and {code("MenuTrigger")} do not pass
            anything to their child as props. They put the trigger props (
            {code("onPress")}, {code("aria-expanded")},{" "}
            {code("aria-haspopup")}) and the popover anchor ref into{" "}
            {code("PressResponderContext")}, which is read by react-aria's{" "}
            {code("usePress")}. A Base UI button never calls {code("usePress")},
            so it type-checked, rendered correctly, and then did nothing on
            click while the popover had no element to anchor to.
          </Text>
        </Callout>
        <Callout variant="info">
          <Text>
            <TextStrong>What replaced it:</TextStrong> {code("dialog")} and{" "}
            {code("dropdown-menu")} from the shadcn {code("base-vega")} style,
            both built on {code("@base-ui/react")} — the same primitive library
            as {code("Button")}. Base UI triggers take a {code("render")} prop,
            so the regular {code("Button")} drops straight in. The old{" "}
            {code("Menu*")} exports, {code("DialogModal")}/{code("DialogBody")},
            and the token-driven {code("dialog.css")}/{code("menu.css")} went
            with them. react-aria still backs {code("accordion")},{" "}
            {code("select")}, {code("list-box")}, {code("tag")},{" "}
            {code("search")} and {code("navigation")}.
          </Text>
        </Callout>
        <Text>
          {code("IconButton")} is gone entirely — an icon-only button is just a{" "}
          {code("Button")} with {code("size=\"icon\"")} +{" "}
          {code("rounded-full")} (and {code("href")} via {code("render")}), so it
          takes {code("onClick")} like everything else:
        </Text>
        <CodeBlock>{`// Overlay triggers — Base UI render prop
<Dialog>
  <DialogTrigger render={<Button variant="ghost" />}>Open</DialogTrigger>
  <DialogContent>…</DialogContent>
</Dialog>

// Everything else — unchanged
<Button variant="ghost" onClick={open}>Open</Button>`}</CodeBlock>
      </MigrationSection>

      <MigrationSection
        title="4. Polymorphism: href sniffing → render prop"
        lede={
          <>
            SDS inspected its own props and swapped element: pass {code("href")}{" "}
            and you got a react-aria {code("Link")} instead of a{" "}
            {code("Button")}. Base UI takes the element from you explicitly via{" "}
            {code("render")}.
          </>
        }
      >
        <CodeBlock>{`// Before — element chosen by prop sniffing
<Button href="/pricing">Pricing</Button>

// After — element passed in
<Button render={<a href="/pricing" />}>Pricing</Button>

// With a router link
<Button render={<Link to="/pricing" />}>Pricing</Button>`}</CodeBlock>
        <Callout variant="info">
          <Text>
            The explicit form is worth the extra characters: the rendered
            element is now visible at the call site instead of being a
            consequence of which props happen to be set. {code("SocialButtons")}{" "}
            in {code("footers.tsx")} follows the same explicit form — a{" "}
            {code("Button")} with {code("render={<a href=… />}")}.
          </Text>
        </Callout>
        <Row label="Live — rendered as an anchor">
          <Button render={<a href="/components#buttons" />}>
            Go to components
          </Button>
          <Button variant="ghost" render={<a href="/tokens" />}>
            Browse tokens
          </Button>
        </Row>
      </MigrationSection>
    </>
  );
}
