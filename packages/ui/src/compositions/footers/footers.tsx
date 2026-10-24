import clsx from "clsx";
import { useMediaQuery } from "../../hooks";
import { IconInstagram, IconLinkedin, IconXLogo, IconYoutube } from "../../icons";
import { Flex, FlexItem, Section, type SectionProps } from "../../layouts";
import {
  Button,
  GmhLogo,
  TextLink,
  TextLinkList,
  TextListItem,
} from "../../primitives";
import type { ReactNode } from "react";
import "./footers.css";

export type FooterLink = {
  label: string;
  href: string;
};
export type FooterColumn = {
  title: string;
  links: FooterLink[];
};

export type FooterProps = Omit<SectionProps, "variant" | "padding" | "src"> & {
  /**
   * The mark heading the first column. Defaults to GMH Lab's `<GmhLogo />`;
   * pass your own, or `null` for none. Section `brand` re-colours
   * `--logo-color` marks.
   */
  logo?: ReactNode;
  /** Link columns. None by default. */
  columns?: FooterColumn[];
  /** Rendered under the logo — e.g. {@link SocialButtons}. Omitted when unset. */
  aside?: ReactNode;
  /** The base row under the hairline — copyright and credits. Omitted when unset. */
  legal?: ReactNode;
};
export function Footer({
  className,
  logo = <GmhLogo />,
  columns = [],
  aside,
  legal,
  ...props
}: FooterProps) {
  const { isTabletDown } = useMediaQuery();
  const listDensity = isTabletDown ? "tight" : "default";
  return (
    <Section
      className={clsx("footer", className)}
      elementType="footer"
      variant="brand"
      paddingTop="1600"
      paddingBottom={legal ? "800" : "4000"}
      style={{ marginTop: "auto" }}
      {...props}
    >
      <Flex direction="column" gap="800" container>
        <Flex wrap type="quarter" gap="600" className="footer-columns">
          {(logo || aside) && (
            <FlexItem size="minor">
              <Flex direction="column" gap="600" alignSecondary="start">
                {logo && <FlexItem>{logo}</FlexItem>}
                {aside && <FlexItem>{aside}</FlexItem>}
              </Flex>
            </FlexItem>
          )}
          {columns.map((column) => (
            <TextLinkList
              key={column.title}
              density={listDensity}
              title={<span className="footer-column-title">{column.title}</span>}
            >
              {column.links.map((link) => (
                <TextListItem key={link.label}>
                  <TextLink href={link.href}>{link.label}</TextLink>
                </TextListItem>
              ))}
            </TextLinkList>
          ))}
        </Flex>
        {legal && <div className="footer-legal">{legal}</div>}
      </Flex>
    </Section>
  );
}

export type SocialNetwork = "x" | "instagram" | "youtube" | "linkedin";
export type SocialLink = {
  network: SocialNetwork;
  href: string;
};

const SOCIAL_NETWORKS: Record<
  SocialNetwork,
  { label: string; icon: ReactNode }
> = {
  x: { label: "X", icon: <IconXLogo /> },
  instagram: { label: "Instagram", icon: <IconInstagram /> },
  youtube: { label: "YouTube", icon: <IconYoutube /> },
  linkedin: { label: "LinkedIn", icon: <IconLinkedin /> },
};

/** Icon buttons for a site's social accounts, in the order given. */
export function SocialButtons({ links }: { links: SocialLink[] }) {
  return (
    <Flex alignSecondary="center" gap="100">
      {links.map(({ network, href }) => (
        <Button
          key={network}
          size="icon"
          variant="ghost"
          nativeButton={false}
          aria-label={SOCIAL_NETWORKS[network].label}
          className="rounded-full hover:[--icon-color:var(--gmh-color-on-surface)]"
          render={<a href={href} />}
        >
          {SOCIAL_NETWORKS[network].icon}
        </Button>
      ))}
    </Flex>
  );
}
