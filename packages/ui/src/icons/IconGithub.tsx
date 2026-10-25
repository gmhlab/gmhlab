import { IconProps, Icon } from "../primitives";
/**
 * Feather's GitHub mark, a stroked outline like the rest of the set.
 * Artwork is 24-unit and scaled into Icon's 16-unit viewBox, so the stroke is
 * 2.4 to land at the set's 1.6.
 */
export const IconGithub = (props: IconProps) => (
  <Icon {...props}><g transform="scale(0.6667)"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" stroke="var(--svg-stroke-color)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></g></Icon>
);
