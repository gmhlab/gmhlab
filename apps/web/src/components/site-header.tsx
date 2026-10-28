"use client";

import { useAuth } from "@gmhlab/data";
import {
  type HeaderNavItem,
  GmhCrestLogo,
  Header,
  UtilityBar,
} from "@gmhlab/ui";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Mock credentials accepted by mockAuthService (see data-providers.tsx).
const DEMO_CREDENTIALS = { email: "Charlie Brown", password: "snooptroupe" };

/**
 * The site nav. `render` hands ui a ready-made `next/link` so the header
 * navigates client-side — ui itself never imports next. `href` is still
 * required: it is what the active-route match below compares against.
 */
const NAV_ITEMS: HeaderNavItem[] = [
  { label: "Team", href: "/team", render: <Link href="/team" /> },
  { label: "Projects", href: "/projects", render: <Link href="/projects" /> },
  {
    label: "Innovations",
    href: "/innovations",
    render: <Link href="/innovations" />,
  },
  {
    label: "Publications",
    href: "/publications",
    render: <Link href="/publications" />,
  },
  { label: "Contact", href: "/contact", render: <Link href="/contact" /> },
];

/** The ui Header wired to the @gmhlab/data auth layer and the app router. */
export function SiteHeader() {
  const { user, login, logout } = useAuth();
  const pathname = usePathname();

  /* Match on route prefix, not equality, so a detail page like
   * /innovations/equip still lights up its section. Longest match wins, which
   * keeps nested sections correct if one nav href ever prefixes another. */
  const activeHref = NAV_ITEMS.map((item) => item.href)
    .filter(
      (href): href is string =>
        href !== undefined &&
        (pathname === href || pathname.startsWith(`${href}/`)),
    )
    .sort((a, b) => b.length - a.length)[0];

  return (
    <Header
      wordmark={{ eyebrow: "GW", name: "Global Mental Health" }}
      lockup={<GmhCrestLogo />}
      navItems={NAV_ITEMS}
      activeHref={activeHref}
      user={user ? { name: user.name, avatar: user.avatar } : null}
      onLogin={() => login(DEMO_CREDENTIALS)}
      onRegister={() => login(DEMO_CREDENTIALS)}
      onLogout={logout}
    />
  );
}

/** The deep-navy strip above the header. Scrolls away; the header pins. */
export function SiteUtilityBar() {
  return (
    <UtilityBar
      start="The George Washington University · School of Medicine and Health Sciences"
      end={
        <>
          <a href="https://smhs.gwu.edu/">GW SMHS</a>
          {" · "}
          <a href="https://www.gwu.edu/">GW</a>
        </>
      }
    />
  );
}
