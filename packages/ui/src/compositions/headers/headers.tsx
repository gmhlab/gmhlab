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
import { type ReactElement, type ReactNode, useState } from "react";
import "./headers.css";

export type HeaderNavItem = {
  /** Visible label. */
  label: string;
  /**
   * Destination. Omit for a non-navigating item — it renders as a `<button>`
   * that only sets the local active highlight (useful for a static mock).
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
 * The signed-in user shown in the header. Kept structural (not imported from
 * the data layer) so ui stays free of a @gmhlab/data dependency — wire
 * `useAuth` from @gmhlab/data into these props at the consumer.
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
  /** None by default. */
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
  navItems = [],
  activeHref,
  logo,
}: HeaderAuthProps &
  HeaderNavProps & {
    /** Repeated in the mobile sheet's top bar. */
    logo?: ReactNode;
  }) {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState<string>();

  /* Figma only draws a 375 and a 1200 frame, so the switch point is a call:
   * the hamburger is mobile-only (< 600px) and tablet gets the full inline
   * nav, which it has the width for as long as the row is allowed to wrap. */
  const { isMobile } = useMediaQuery();

  const userButtons = (
    <>
      <Button size="sm" onClick={onLogin}>
        Sign in
      </Button>
      <Button variant="accent" size="sm" onClick={onRegister}>
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
           * element (a router Link), a plain anchor, or — for a label-only
           * item — a button, since an anchor with no destination is
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
            {logo}
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

/**
 * A two-line text lockup set beside the mark — a small gold kicker over the
 * serif name ("GW" / "Global Mental Health"). Hidden below 600px, where the
 * mark alone has to carry the row.
 */
export type HeaderWordmark = {
  name: string;
  eyebrow?: string;
  /** Defaults to "/", matching the logo. */
  href?: string;
};

export type HeaderProps = Omit<SectionProps, "variant" | "padding" | "src"> &
  HeaderAuthProps &
  HeaderNavProps & {
    /**
     * The mark at the start of the row (and atop the mobile sheet). Defaults
     * to GMH Lab's `<GmhLogo />`; pass your own, or `null` for none.
     */
    logo?: ReactNode;
    wordmark?: HeaderWordmark;
  };
export function Header({
  className,
  logo = <GmhLogo />,
  wordmark,
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
      variant="subtle"
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
        <div className="header-brand">
          {logo}
          {wordmark && (
            /* With a logo, the logo is already the home link and its accessible
               name, so this second link is hidden from AT and the tab order —
               it only widens the click target to the words. Without a logo it
               is the home link, so it stays exposed. */
            <a
              className="header-wordmark"
              href={wordmark.href ?? "/"}
              aria-hidden={logo ? true : undefined}
              tabIndex={logo ? -1 : undefined}
            >
              {wordmark.eyebrow && (
                <span className="header-wordmark-eyebrow">
                  {wordmark.eyebrow}
                </span>
              )}
              <span className="header-wordmark-name">{wordmark.name}</span>
            </a>
          )}
        </div>
        <HeaderAuth
          user={user}
          onLogin={onLogin}
          onRegister={onRegister}
          onLogout={onLogout}
          navItems={navItems}
          activeHref={activeHref}
          logo={logo}
        />
      </Flex>
    </Section>
  );
}

export type UtilityBarProps = Omit<SectionProps, "variant" | "padding" | "src"> & {
  /** Left slot — typically the parent institution. Hidden below 640px. */
  start?: ReactNode;
  /** Right slot — a few utility links (Give · Contact). */
  end?: ReactNode;
};
/**
 * The thin deep-navy strip that sits above the Header: parent-institution
 * line on the left, utility links on the right. It is NOT sticky — render it
 * before `<Header>` and it scrolls away while the header pins.
 */
export function UtilityBar({ className, start, end, ...props }: UtilityBarProps) {
  return (
    <Section
      className={clsx("utility-bar", className)}
      elementType="section"
      variant="subtle"
      padding="0"
      aria-label="Utility"
      {...props}
    >
      <Flex container alignPrimary="space-between" alignSecondary="center" gap="400">
        <span className="utility-bar-start">{start}</span>
        <span className="utility-bar-end">{end}</span>
      </Flex>
    </Section>
  );
}
