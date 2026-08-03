import { Flex, type FlexProps } from "../../layouts";
import { TextContentHeading } from "../../primitives";

export type CardGridProps = Omit<FlexProps, "wrap"> & {
  /**
   * An optional heading rendered above the grid.
   */
  heading?: string;
  /**
   * An optional subheading. Only rendered alongside a `heading`.
   */
  subheading?: string;
  /**
   * The alignment of the heading block.
   */
  headingAlign?: "start" | "center";
};

/**
 * A responsive grid of cards, optionally introduced by a heading.
 *
 * The column count comes from Flex's grid `type` — `third` for 3-up,
 * `quarter` for 4-up, `half` for 2-up — all of which collapse to full
 * width on mobile. Section chrome (background, padding) is deliberately
 * left to the caller, matching Panel.
 *
 * `container` defaults to false so the grid nests cleanly inside an
 * existing `Flex container`; set it when CardGrid is the outermost
 * element inside a Section.
 */
export function CardGrid({
  children,
  container = false,
  gap = "600",
  heading,
  headingAlign = "start",
  subheading,
  type = "third",
  ...props
}: CardGridProps) {
  // Without a heading there is nothing to stack, so the grid is returned
  // directly rather than wrapped in a redundant column.
  const grid = (
    <Flex container={!heading && container} wrap gap={gap} type={type} {...props}>
      {children}
    </Flex>
  );

  if (!heading) return grid;

  return (
    <Flex container={container} direction="column" gap={gap}>
      <TextContentHeading
        align={headingAlign}
        heading={heading}
        subheading={subheading}
      />
      {grid}
    </Flex>
  );
}
