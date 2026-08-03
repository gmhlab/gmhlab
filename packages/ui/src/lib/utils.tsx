import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import {
  type ComponentPropsWithoutRef,
  type ForwardedRef,
  forwardRef,
  type ReactNode,
} from "react"
import {
  Button as RACButton,
  Link as RACLink,
  type ButtonProps as RACButtonProps,
} from "react-aria-components"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

type RACLinkProps = ComponentPropsWithoutRef<typeof RACLink>

export type AnchorOrButtonSharedProps = {
  children?: ReactNode
  href?: string
}

export type AnchorOrButtonProps = (RACButtonProps | RACLinkProps) &
  AnchorOrButtonSharedProps

function isAnchorProps(
  props: AnchorOrButtonProps,
): props is AnchorOrButtonSharedProps & RACLinkProps {
  return "href" in props
}

/** Renders an anchor when `href` is present, a button otherwise. */
export const AnchorOrButton = forwardRef(function AnchorOrButton(
  props: AnchorOrButtonProps,
  ref: ForwardedRef<HTMLElement>,
) {
  return isAnchorProps(props) ? (
    <RACLink {...props} ref={ref as ForwardedRef<HTMLAnchorElement>} />
  ) : (
    <RACButton {...props} ref={ref as ForwardedRef<HTMLButtonElement>} />
  )
})
