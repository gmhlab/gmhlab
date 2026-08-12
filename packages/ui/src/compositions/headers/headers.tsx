import clsx from "clsx";
import { useMediaQuery } from "../../hooks";
import { IconChevronDown, IconMenu, IconX } from "../../icons";
import { Flex, Section, type SectionProps } from "../../layouts";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  GmhLogo,
  Label,
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  TextSmall,
  TextStrong,
} from "../../primitives";
import { type ReactElement, useState } from "react";
import "./headers.css";

export type HeaderNavItem = {
  /** Visible label. */
  label: string;
  /**
   * Destination. Omit for a non-navigating item — it renders as a `<button>`
   * that only sets the local active highlight, which is what the Figma-derived
   * default set does.
   */
  href?: string;
  /**
   * Element to render the link as — a framework `Link` (`next/link`,
   * react-router) for client-side navigation. ui stays router-agnostic by
   * taking the element ready-made rather than importing any router itself.
   * Still set `href` alongside it: that is what {@link HeaderNavProps.activeHref}
   * compares against.
   */
  render?: ReactElement;
  /** Dropped from the mobile sheet, matching Figma's Mobile/Open variant. */
  desktopOnly?: boolean;
};

/**
 * Nav items, in Figma's order (Header, node 2287:22651). `Link` is on the
 * desktop variant only — the mobile sheet drops it. None carry an `href`: this
 * is the design-system default, and a real site passes its own `navItems`.
 */
export const DEFAULT_NAV_ITEMS: HeaderNavItem[] = [
  { label: "Products" },
  { label: "Solutions" },
  { label: "Community" },
  { label: "Resources" },
  { label: "Pricing" },
  { label: "Contact" },
  { label: "Link", desktopOnly: true },
];

/**
 * The signed-in user shown in the header. Kept structural (not imported from
 * the blocks data layer) so ui stays free of a blocks dependency — wire
 * `useAuth` from @gmhlab/blocks into these props at the consumer.
 */
export type HeaderAuthUser = {
  name: string;
  avatar?: string;
};

export type HeaderAuthProps = {
  /** Signed-in user; omit (or pass null) for the logged-out state. */
  user?: HeaderAuthUser | null;
  onLogin?: () => void;
  onRegister?: () => void;
  onLogout?: () => void;
};

export type HeaderNavProps = {
  /** Defaults to {@link DEFAULT_NAV_ITEMS}. */
  navItems?: HeaderNavItem[];
  /**
   * Marks the current route active. Only applies to items that carry an
   * `href` — ui has no router, so the consumer supplies the current path
   * (`usePathname()`, `useLocation().pathname`, …).
   */
  activeHref?: string;
};

export function HeaderAuth({
  user,
  onLogin,
  onRegister,
  onLogout,
  navItems = DEFAULT_NAV_ITEMS,
  activeHref,
}: HeaderAuthProps & HeaderNavProps) {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState("products");

  /* Figma only draws a 375 and a 1200 frame, so the switch point is a call:
   * the hamburger is mobile-only (< 600px) and tablet gets the full inline
   * nav, which it has the width for as long as the row is allowed to wrap. */
  const { isMobile } = useMediaQuery();

  const userButtons = (
    <>
      <Button variant="outline" size="sm" onClick={onLogin}>
        Sign in
      </Button>
      <Button variant="ghost" size="sm" onClick={onRegister}>
        Register
      </Button>
    </>
  );

  /**
   * `stacked` is the mobile sheet: Figma renders each link full-width with
   * centred text, versus the inline row on desktop.
   */
  const renderNavigation = ({
    items,
    stacked,
    onNavigate,
  }: {
    items: HeaderNavItem[];
    stacked?: boolean;
    onNavigate?: () => void;
  }) => (
    <NavigationMenu className={stacked ? "max-w-none" : undefined}>
      <NavigationMenuList
        className={stacked ? "w-full flex-col items-stretch" : ""}
      >
        {items.map((item) => {
          /* Three ways to render, in precedence order: a consumer-supplied
           * element (a router Link), a plain anchor, or — for the label-only
           * default set — a button, since an anchor with no destination is
           * neither focusable nor announced as a control. Base UI's Link
           * renders an `<a>` by default, so the href case needs no `render`. */
          const elementProps = item.render
            ? { render: item.render }
            : item.href
              ? { href: item.href }
              : { render: <button type="button" /> };
          const navigates = Boolean(item.render ?? item.href);

          return (
            <NavigationMenuItem key={item.label}>
              <NavigationMenuLink
                {...elementProps}
                active={
                  navigates
                    ? item.href !== undefined && item.href === activeHref
                    : page === item.label.toLowerCase()
                }
                onClick={() => {
                  if (!navigates) setPage(item.label.toLowerCase());
                  onNavigate?.();
                }}
                className={clsx(
                  "cursor-pointer",
                  stacked && "w-full justify-center",
                )}
              >
                {item.label}
              </NavigationMenuLink>
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );

  if (isMobile) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger
          render={
            <Button
              size="icon"
              variant="ghost"
              aria-label="Toggle navigation menu"
            />
          }
        >
          <IconMenu />
        </DialogTrigger>
        <DialogContent
          className="navigation-dialog"
          aria-label="Site navigation"
          showCloseButton={false}
        >
          <Flex
            className="navigation-dialog-bar"
            alignPrimary="space-between"
            alignSecondary="center"
          >
            <GmhLogo />
            <DialogClose
              render={
                <Button
                  size="icon"
                  variant="ghost"
                  aria-label="Close navigation menu"
                />
              }
            >
              <IconX />
            </DialogClose>
          </Flex>
          <div className="navigation-dialog-nav">
            {renderNavigation({
              items: navItems.filter((item) => !item.desktopOnly),
              stacked: true,
              onNavigate: () => setOpen(false),
            })}
          </div>
          {user ? (
            <Flex
              className="navigation-dialog-user"
              direction="column"
              alignPrimary="center"
              alignSecondary="center"
              gap="200"
            >
              <Avatar>
                {user.avatar && (
                  <AvatarImage src={user.avatar} alt={user.name} />
                )}
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <Label>{user.name}</Label>
              <Button variant="ghost" size="sm" onClick={onLogout}>
                Log out
              </Button>
            </Flex>
          ) : (
            <Flex
              className="navigation-dialog-actions"
              alignSecondary="center"
              gap="300"
            >
              {userButtons}
            </Flex>
          )}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Flex className="header-actions" alignSecondary="center" gap="600">
      {renderNavigation({ items: navItems })}
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger className="header-auth-avatar-button">
            <Avatar>
              {user.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <IconChevronDown />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Flex gap="200" alignSecondary="center">
                <Avatar>
                  {user.avatar && (
                    <AvatarImage src={user.avatar} alt={user.name} />
                  )}
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <Flex direction="column">
                  <TextStrong>{user.name}</TextStrong>
                  <TextSmall>View profile</TextSmall>
                </Flex>
              </Flex>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onLogout}>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Flex className="header-auth" alignSecondary="center" gap="300">
          {userButtons}
        </Flex>
      )}
    </Flex>
  );
}

export type HeaderProps = Omit<SectionProps, "variant" | "padding" | "src"> &
  HeaderAuthProps &
  HeaderNavProps;
export function Header({
  className,
  user,
  onLogin,
  onRegister,
  onLogout,
  navItems,
  activeHref,
  ...props
}: HeaderProps) {
  return (
    <Section
      className={clsx("header", className)}
      elementType="header"
      variant="brand"
      padding="400"
      {...props}
    >
      {/* `wrap` matches the flex-wrap Figma sets on the desktop variant — it
          is what keeps the nav from overflowing at narrow tablet widths. */}
      <Flex
        container
        alignPrimary="space-between"
        alignSecondary="center"
        gap="400"
        wrap
      >
        <GmhLogo />
        <HeaderAuth
          user={user}
          onLogin={onLogin}
          onRegister={onRegister}
          onLogout={onLogout}
          navItems={navItems}
          activeHref={activeHref}
        />
      </Flex>
    </Section>
  );
}
