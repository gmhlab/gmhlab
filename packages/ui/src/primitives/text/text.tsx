import { clsx } from "clsx";
import { useMediaQuery } from "../../hooks";
import { Flex } from "../../layouts";
import { ComponentPropsWithoutRef, ReactNode } from "react";
import {
  Text as RACText,
  type TextProps as RACTextProps,
} from "react-aria-components";
import "./text.css";

type TextLineHeightProps = { lineHeight?: "body" | "single" };

type TextTruncateProps = { lineClamp?: number };

export type TextProps = TextTruncateProps & RACTextProps & TextLineHeightProps;
export function Text({
  className,
  elementType = "p",
  lineHeight = "body",
  lineClamp,
  ...props
}: TextProps) {
  const classNames = clsx(
    className,
    !!lineClamp && "text-truncate",
    "text-body-base",
    `text-line-height-${lineHeight}`,
  );
  const style = lineClamp
    ? { "--text-truncate-line-clamp": lineClamp }
    : undefined;
  return (
    <RACText
      style={style}
      elementType={elementType}
      className={classNames}
      {...props}
    />
  );
}
export type TextSmallProps = TextTruncateProps &
  RACTextProps &
  TextLineHeightProps;
export function TextSmall({
  className,
  elementType = "small",
  lineHeight = "body",
  lineClamp,
  ...props
}: TextSmallProps) {
  const classNames = clsx(
    className,
    !!lineClamp && "text-truncate",
    "text-body-small",
    `text-line-height-${lineHeight}`,
  );
  const style = lineClamp
    ? { "--text-truncate-line-clamp": lineClamp }
    : undefined;
  return (
    <RACText
      style={style}
      className={classNames}
      elementType={elementType}
      {...props}
    />
  );
}
export type TextSmallStrongProps = TextTruncateProps &
  RACTextProps &
  TextLineHeightProps;
export function TextSmallStrong({
  className,
  elementType = "small",
  lineClamp,
  lineHeight = "body",
  ...props
}: TextSmallProps) {
  const classNames = clsx(
    className,
    !!lineClamp && "text-truncate",
    "text-body-small-strong",
    `text-line-height-${lineHeight}`,
  );
  const style = lineClamp
    ? { "--text-truncate-line-clamp": lineClamp }
    : undefined;
  return (
    <RACText
      style={style}
      className={classNames}
      elementType={elementType}
      {...props}
    />
  );
}
export type TextStrongProps = TextTruncateProps & RACTextProps;
export function TextStrong({
  className,
  elementType = "strong",
  lineClamp,
  ...props
}: TextStrongProps) {
  const classNames = clsx(
    className,
    !!lineClamp && "text-truncate",
    "text-body-strong",
  );
  const style = lineClamp
    ? { "--text-truncate-line-clamp": lineClamp }
    : undefined;
  return (
    <RACText
      style={style}
      className={classNames}
      elementType={elementType}
      {...props}
    />
  );
}
export type TextEmphasisProps = RACTextProps;
export function TextEmphasis({
  className,
  elementType,
  ...props
}: TextEmphasisProps) {
  const classNames = clsx(className, "text-body-emphasis");
  return (
    <RACText className={classNames} elementType={elementType} {...props} />
  );
}
export type TextLinkProps = { href: string } & ComponentPropsWithoutRef<"a">;
export function TextLink({ className, ...props }: TextLinkProps) {
  const classNames = clsx(className, "text-body-link");
  return <a className={classNames} {...props} />;
}
export type TextCodeProps = RACTextProps;
export function TextCode({ className, ...props }: TextCodeProps) {
  const classNames = clsx(className, "text-body-code");
  return <RACText className={classNames} {...props} />;
}

export type TextInputProps = RACTextProps;
export function TextInput({ className, ...props }: TextInputProps) {
  const classNames = clsx(className, "text-input-value");
  return <RACText className={classNames} {...props} />;
}

export type TextTitleHeroProps = TextTruncateProps & RACTextProps;
export function TextTitleHero({
  className,
  elementType = "h1",
  lineClamp,
  ...props
}: TextTitleHeroProps) {
  const classNames = clsx(
    className,
    !!lineClamp && "text-truncate",
    "text-title-hero",
  );
  const style = lineClamp
    ? { "--text-truncate-line-clamp": lineClamp }
    : undefined;
  return (
    <RACText
      style={style}
      className={classNames}
      elementType={elementType}
      {...props}
    />
  );
}
export type TextTitlePageProps = TextTruncateProps & RACTextProps;
export function TextTitlePage({
  className,
  elementType = "h2",
  lineClamp,
  ...props
}: TextTitlePageProps) {
  const classNames = clsx(
    className,
    !!lineClamp && "text-truncate",
    "text-title-page",
  );
  const style = lineClamp
    ? { "--text-truncate-line-clamp": lineClamp }
    : undefined;
  return (
    <RACText
      style={style}
      className={classNames}
      elementType={elementType}
      {...props}
    />
  );
}
export type TextSubtitleProps = TextTruncateProps & RACTextProps;
export function TextSubtitle({
  className,
  elementType = "p",
  lineClamp,
  ...props
}: TextSubtitleProps) {
  const classNames = clsx(
    className,
    !!lineClamp && "text-truncate",
    "text-subtitle",
  );
  const style = lineClamp
    ? { "--text-truncate-line-clamp": lineClamp }
    : undefined;
  return (
    <RACText
      style={style}
      className={classNames}
      elementType={elementType}
      {...props}
    />
  );
}
export type TextHeadingProps = TextTruncateProps & RACTextProps;
export function TextHeading({
  className,
  elementType = "h3",
  lineClamp,
  ...props
}: TextHeadingProps) {
  const classNames = clsx(
    className,
    !!lineClamp && "text-truncate",
    "text-heading",
  );
  const style = lineClamp
    ? { "--text-truncate-line-clamp": lineClamp }
    : undefined;
  return (
    <RACText
      style={style}
      className={classNames}
      elementType={elementType}
      {...props}
    />
  );
}
export type TextSubheadingProps = TextTruncateProps & RACTextProps;
export function TextSubheading({
  className,
  elementType = "p",
  lineClamp,
  ...props
}: TextSubheadingProps) {
  const classNames = clsx(
    className,
    !!lineClamp && "text-truncate",
    "text-subheading",
  );
  const style = lineClamp
    ? { "--text-truncate-line-clamp": lineClamp }
    : undefined;
  return (
    <RACText
      style={style}
      className={classNames}
      elementType={elementType}
      {...props}
    />
  );
}

export type TextEyebrowProps = RACTextProps & {
  /**
   * Draws the short gold rule after the label. On by default — it is what
   * makes an eyebrow read as a section marker rather than a stray caption.
   */
  rule?: boolean;
};
/**
 * The small-caps kicker that sits above a heading ("What we work on"). Gold,
 * tracked out, uppercase. The colour is text-accent-default (gold-700), not the
 * #aa9868 brand gold, which is only 2.7:1 at this size; the rule after it IS
 * the brand gold, since a rule is not text.
 */
export function TextEyebrow({
  className,
  elementType = "p",
  rule = true,
  ...props
}: TextEyebrowProps) {
  const classNames = clsx(className, "text-eyebrow", rule && "text-eyebrow-rule");
  return <RACText className={classNames} elementType={elementType} {...props} />;
}

export type TextBlockquoteProps = ComponentPropsWithoutRef<"figure"> & {
  /** The quotation itself. Rendered in a `<blockquote>`. */
  quote: ReactNode;
  /** Who said it — rendered strong, above `role`. */
  name?: ReactNode;
  /** Title, affiliation or source line under the name. */
  role?: ReactNode;
  /** URL of the quoted source, passed through as the blockquote's `cite`. */
  cite?: string;
};
/**
 * A pull quote: italic serif behind a gold rule, attribution beneath. A
 * `<figure>` so the attribution is a real `<figcaption>`, which is the
 * accessible pairing for a quote and its source.
 */
export function TextBlockquote({
  className,
  quote,
  name,
  role,
  cite,
  ...props
}: TextBlockquoteProps) {
  return (
    <figure className={clsx(className, "text-blockquote")} {...props}>
      <blockquote cite={cite}>{quote}</blockquote>
      {(name || role) && (
        <figcaption className="text-blockquote-attribution">
          {name && <span className="text-blockquote-name">{name}</span>}
          {role && <span className="text-blockquote-role">{role}</span>}
        </figcaption>
      )}
    </figure>
  );
}

export type TextPriceProps = RACTextProps & {
  currency: string;
  price: string;
  label?: string;
  size?: "small" | "large";
};
export function TextPrice({
  className,
  currency,
  size = "large",
  price,
  label,
  ...props
}: TextPriceProps) {
  const classNames = clsx(className, "text-price", `text-price-size-${size}`);
  const content = (
    <>
      <sup className="text-price-currency">{currency}</sup>
      {price}
    </>
  );
  return (
    <RACText elementType="p" className={classNames} {...props}>
      {size === "small" ? (
        <TextHeading elementType="span">{content}</TextHeading>
      ) : (
        <TextTitlePage elementType="span">{content}</TextTitlePage>
      )}

      {label && <TextSmall>{label}</TextSmall>}
    </RACText>
  );
}

export type TextListItemProps = ComponentPropsWithoutRef<"li">;
export function TextListItem({ className, ...props }: TextListItemProps) {
  const classNames = clsx(className, "text-list-item");
  return <li className={classNames} {...props} />;
}

export type TextListProps = Omit<ComponentPropsWithoutRef<"ul">, "title"> & {
  title?: ReactNode;
  density?: "default" | "tight";
};
export function TextList({
  children,
  className,
  density = "default",
  title,
  ...props
}: TextListProps) {
  const classNames = clsx(
    className,
    "text-list",
    `text-list-density-${density}`,
  );
  return (
    <ul className={classNames} {...props}>
      {title && <li className="text-list-title">{title}</li>}
      {children}
    </ul>
  );
}

export type TextLinkListProps = TextListProps;
export function TextLinkList({ className, ...props }: TextLinkListProps) {
  const classNames = clsx(className, "text-link-list");
  return <TextList className={classNames} {...props} />;
}

export type TextContentHeadingProps = ComponentPropsWithoutRef<"div"> & {
  align?: "start" | "center";
  /** Optional kicker above the heading — see {@link TextEyebrow}. */
  eyebrow?: ReactNode;
  heading: string;
  subheading?: string;
};
export function TextContentHeading({
  align = "start",
  className,
  eyebrow,
  heading,
  subheading,
  ...props
}: TextContentHeadingProps) {
  const classNames = clsx(
    className,
    "text-content-heading",
    `text-align-${align}`,
  );
  return (
    <Flex direction="column" gap="200" className={classNames} {...props}>
      {eyebrow && <TextEyebrow rule={align !== "center"}>{eyebrow}</TextEyebrow>}
      <TextHeading>{heading}</TextHeading>
      {subheading && <TextSubheading>{subheading}</TextSubheading>}
    </Flex>
  );
}

export type TextContentTitleProps = ComponentPropsWithoutRef<"div"> & {
  align?: "start" | "center";
  /** Optional kicker above the title — see {@link TextEyebrow}. */
  eyebrow?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
};
export function TextContentTitle({
  align = "start",
  className,
  eyebrow,
  title,
  subtitle,
  ...props
}: TextContentTitleProps) {
  const classNames = clsx(className, "text-content-title");
  const { isMobile } = useMediaQuery();
  return (
    <Flex direction="column" gap="200" className={classNames} {...props}>
      {eyebrow && (
        <TextEyebrow
          rule={align !== "center"}
          className={`text-align-${align}`}
        >
          {eyebrow}
        </TextEyebrow>
      )}
      {isMobile ? (
        <TextTitlePage className={`text-align-${align}`}>{title}</TextTitlePage>
      ) : (
        <TextTitleHero className={`text-align-${align}`}>{title}</TextTitleHero>
      )}

      {subtitle && (
        <TextSubtitle className={`text-align-${align}`}>
          {subtitle}
        </TextSubtitle>
      )}
    </Flex>
  );
}