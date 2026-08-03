import { IconProps, Icon } from "../primitives";
/**
 * The X (formerly Twitter) brand mark. Solid rather than stroked, unlike the
 * outline icons in this set — brand marks are filled by definition.
 * Artwork is 24-unit and scaled into Icon's 16-unit viewBox.
 * Distinct from IconX, which is the close cross.
 */
export const IconXLogo = (props: IconProps) => (
  <Icon {...props}><g transform="scale(0.6667)"><path d="M14.2737 10.1635L23.2023 0H21.0872L13.3313 8.82305L7.14125 0H0L9.3626 13.3433L0 24H2.11504L10.3002 14.6806L16.8388 24H23.98M2.8784 1.5619H6.12769L21.0856 22.5148H17.8355" fill="var(--svg-stroke-color)"/></g></Icon>
);
