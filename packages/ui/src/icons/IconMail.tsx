import { IconProps, Icon } from "../primitives";
/**
 * An envelope on the set's 16-unit grid and 1.6 stroke: a rounded body with
 * the flap folding to a point just below centre, so it reads as a letter
 * rather than a box at 16px.
 */
export const IconMail = (props: IconProps) => (
  <Icon {...props}><rect x="1.33331" y="3" width="13.3333" height="10" rx="2" stroke="var(--svg-stroke-color)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><path d="M1.66665 4.33331L8 8.99998L14.3333 4.33331" stroke="var(--svg-stroke-color)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></Icon>
);
