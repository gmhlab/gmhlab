import { type Account, canAccess } from "@gmhlab/core";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  GmhLogo,
  cn,
} from "@gmhlab/ui";
import {
  ArrowLeft,
  BarChart3,
  BookOpen,
  Command as CommandIcon,
  FolderKanban,
  GraduationCap,
  Images,
  LayoutDashboard,
  Lock,
  LogOut,
  type LucideIcon,
  Mail,
  Menu,
  Moon,
  Palette,
  Presentation,
  RotateCcw,
  Search,
  Shapes,
  ShieldCheck,
  ShoppingBag,
  Sun,
  UserRound,
  X,
} from "lucide-react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { type ReactNode, useEffect, useMemo, useState } from "react";
import { GMH_DASHBOARD_COPY } from "../shared/gmh-copy";
import {
  type DashboardLinkComponent,
  type DashboardModule,
  type ModuleIcon,
  type ModuleNavGroup,
  TIER_LABEL,
} from "./dashboard-types";
import { EASE } from "./kit";
import { Toaster } from "./toast";

const ICONS: Record<ModuleIcon, LucideIcon> = {
  training: GraduationCap,
  palette: Palette,
  shapes: Shapes,
  slides: Presentation,
  mail: Mail,
  folder: FolderKanban,
  images: Images,
  book: BookOpen,
  shield: ShieldCheck,
  chart: BarChart3,
  layout: LayoutDashboard,
};

/** A module's icon, as drawn in the sidebar — also the badge on its cover. */
export function ModuleIconGlyph({ icon, className }: { icon: ModuleIcon; className?: string }) {
  const Icon = ICONS[icon];
  return <Icon className={className} aria-hidden />;
}

const GROUPS: ModuleNavGroup[] = ["Create", "Learn", "Workspace", "Lab"];

const PlainLink: DashboardLinkComponent = ({ href, children, ...props }) => (
  <a href={href} {...props}>
    {children}
  </a>
);

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join("");
}

/**
 * The account's headshot when it has one, else its initials on a gold disc —
 * never a stand-in image (the team page's rule).
 */
export function Monogram({ name, photo, className }: { name: string; photo?: string; className?: string }) {
  if (photo) {
    return (
      <img
        src={photo}
        alt=""
        className={cn("size-9 shrink-0 rounded-full object-cover ring-2 ring-white/30", className)}
      />
    );
  }
  return (
    <span
      className={cn(
        "grid size-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-band-accent to-tertiary-container text-xs font-bold text-on-tertiary-container ring-2 ring-white/30",
        className,
      )}
      aria-hidden
    >
      {initials(name)}
    </span>
  );
}

type NavEntry = { href: string; label: string; icon: LucideIcon; module?: DashboardModule };

function Sidebar({
  account,
  modules,
  pathname,
  basePath,
  profileHref,
  pendingReviews,
  reviewsModuleId,
  Link,
  eyebrow,
  name,
  homeHref,
  onNavigate,
}: {
  account: Account;
  modules: DashboardModule[];
  pathname: string;
  basePath: string;
  profileHref: string;
  pendingReviews: number;
  reviewsModuleId?: string;
  Link: DashboardLinkComponent;
  eyebrow: string;
  name: string;
  homeHref: string;
  onNavigate?: () => void;
}) {
  const entries: NavEntry[] = [
    { href: basePath, label: "Home", icon: LayoutDashboard },
    ...modules
      .filter((m) => m.nav && !m.soon)
      .map((m) => ({ href: m.href, label: m.title, icon: ICONS[m.icon], module: m })),
    { href: profileHref, label: "Your profile", icon: UserRound },
  ];
  const active = entries
    .map((e) => e.href)
    .filter((href) => pathname === href || (href !== basePath && pathname.startsWith(`${href}/`)))
    .sort((a, b) => b.length - a.length)[0];

  const link = (entry: NavEntry) => {
    const locked = entry.module ? !canAccess(account, entry.module) : false;
    const isActive = entry.href === active;
    const Icon = entry.icon;
    return (
      <li key={entry.href}>
        <Link
          href={entry.href}
          onClick={onNavigate}
          className="dash-nav-link"
          aria-current={isActive ? "page" : undefined}
        >
          {isActive && (
            <motion.span
              layoutId="dash-nav-pill"
              className="dash-nav-pill"
              transition={{ type: "spring", stiffness: 420, damping: 34 }}
            />
          )}
          <Icon className="size-[18px] shrink-0" aria-hidden />
          <span className="flex-1 truncate">{entry.label}</span>
          {entry.module?.id === reviewsModuleId && pendingReviews > 0 && (
            <span className="grid min-w-5 place-items-center rounded-full bg-brand-band-accent px-1.5 text-[11px] font-bold text-on-tertiary-container">
              {pendingReviews}
            </span>
          )}
          {locked && <Lock className="size-3.5 opacity-60" aria-label="Locked" />}
        </Link>
      </li>
    );
  };

  return (
    <nav className="dash-sidebar flex h-full flex-col px-4 pb-4 pt-5" aria-label="Workspace">
      <div className="dash-sidebar-brand mb-6 flex items-center gap-3 px-2">
        <GmhLogo href={homeHref} />
        <div className="leading-tight">
          <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-band-accent">{eyebrow}</div>
          <div className="font-serif text-lg">{name}</div>
        </div>
      </div>

      <div className="dash-sidebar-scroll -mx-1 flex-1 overflow-y-auto px-1">
        <ul className="space-y-0.5">{link(entries[0]!)}</ul>
        {GROUPS.map((group) => {
          const items = entries.filter((e) => e.module?.nav === group);
          if (!items.length) return null;
          return (
            <div key={group} className="mt-5">
              <div className="mb-1.5 px-3 text-[11px] font-bold uppercase tracking-[0.16em] text-on-brand-band/55">
                {group}
              </div>
              <ul className="space-y-0.5">{items.map(link)}</ul>
            </div>
          );
        })}
        <ul className="mt-5 space-y-0.5">{link(entries[entries.length - 1]!)}</ul>
      </div>

      <Link
        href={profileHref}
        onClick={onNavigate}
        className="mt-4 flex items-center gap-3 rounded-2xl bg-white/8 p-3 ring-1 ring-white/12 transition hover:bg-white/12"
      >
        <Monogram name={account.name} photo={account.photo} />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold">{account.name}</span>
          <span className="block truncate text-xs text-brand-band-accent">{TIER_LABEL[account.tier]}</span>
        </span>
      </Link>
    </nav>
  );
}

/* ── Command palette ──────────────────────────────────────────────────── */

type PaletteCommand = { id: string; label: string; hint?: string; icon: LucideIcon; run: () => void };

function CommandPalette({
  open,
  onClose,
  commands,
}: {
  open: boolean;
  onClose: () => void;
  commands: PaletteCommand[];
}) {
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? commands.filter((c) => `${c.label} ${c.hint ?? ""}`.toLowerCase().includes(q)) : commands;
  }, [commands, query]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setIndex(0);
    }
  }, [open]);

  const choose = (c: PaletteCommand | undefined) => {
    if (!c) return;
    onClose();
    c.run();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-start justify-center bg-scrim/40 px-4 pt-[12vh] backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            className="dash-panel w-[min(36rem,100%)] overflow-hidden"
            initial={{ opacity: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.25, ease: EASE }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-outline-variant px-4">
              <Search className="size-4 text-on-surface-variant" aria-hidden />
              <input
                autoFocus
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setIndex(0);
                }}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setIndex((i) => Math.min(results.length - 1, i + 1));
                  } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setIndex((i) => Math.max(0, i - 1));
                  } else if (e.key === "Enter") {
                    choose(results[index]);
                  } else if (e.key === "Escape") {
                    onClose();
                  }
                }}
                placeholder="Jump to a module or action…"
                aria-label="Search modules and actions"
                className="h-14 flex-1 bg-transparent text-base outline-none placeholder:text-on-surface-variant"
              />
              <kbd className="rounded-md border border-outline-variant px-1.5 py-0.5 text-[11px] text-on-surface-variant">
                esc
              </kbd>
            </div>
            <ul className="max-h-[50vh] overflow-y-auto p-2" role="listbox" aria-label="Results">
              {results.length === 0 && (
                <li className="px-3 py-6 text-center text-sm text-on-surface-variant">Nothing matches “{query}”.</li>
              )}
              {results.map((c, i) => {
                const Icon = c.icon;
                return (
                  <li key={c.id} role="option" aria-selected={i === index}>
                    <button
                      type="button"
                      onMouseEnter={() => setIndex(i)}
                      onClick={() => choose(c)}
                      className={cn(
                        "relative isolate flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm",
                        i === index && "text-on-primary",
                      )}
                    >
                      {i === index && (
                        <motion.span
                          layoutId="dash-cmd-pill"
                          className="absolute inset-0 -z-10 rounded-xl bg-primary"
                          transition={{ type: "spring", stiffness: 500, damping: 38 }}
                        />
                      )}
                      <Icon className="size-4 shrink-0" aria-hidden />
                      <span className="flex-1 font-semibold">{c.label}</span>
                      {c.hint && <span className="truncate text-xs opacity-70">{c.hint}</span>}
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ── Shell ────────────────────────────────────────────────────────────── */

/** The shell's loading state: sidebar and shimmer cards, no content. */
export function DashboardSkeleton() {
  return (
    <div className="dash flex">
      <div className="dash-sidebar hidden h-screen w-[var(--dash-sidebar-w)] lg:block" />
      <div className="flex-1 space-y-6 p-6 lg:p-10">
        <div className="dash-skeleton h-56 rounded-[28px]" />
        <div className="grid gap-6 md:grid-cols-3">
          <div className="dash-skeleton h-40 rounded-[28px]" />
          <div className="dash-skeleton h-40 rounded-[28px]" />
          <div className="dash-skeleton h-40 rounded-[28px]" />
        </div>
      </div>
    </div>
  );
}

/** A one-click demo sign-in: who (label) and what they can see (role). */
export type DemoAccountOption = { email: string; label: string; role?: string };

export type DashboardShellProps = {
  account: Account;
  /** The module catalogue; those with `nav` get sidebar entries. */
  modules: DashboardModule[];
  /** The current path, for the active nav entry and page transitions. */
  pathname: string;
  /** The dashboard's home route. Defaults to `/dashboard`. */
  basePath?: string;
  /** The profile route. Defaults to `${basePath}/account`. */
  profileHref?: string;
  /** Where the store section lives. Defaults to `${basePath}#store`. */
  storeHref?: string;
  /** The public site. Defaults to `/`. */
  siteHref?: string;
  /** Router link for client navigation. Defaults to `<a>`. */
  linkComponent?: DashboardLinkComponent;
  /** Programmatic navigation (palette, menus). Defaults to `location.assign`. */
  onNavigate?: (href: string) => void;
  cartCount?: number;
  onOpenCart?: () => void;
  isDark?: boolean;
  onToggleTheme?: () => void;
  /** Badge on the module whose id is `reviewsModuleId`. */
  pendingReviews?: number;
  reviewsModuleId?: string;
  onSignOut: () => void;
  /** Demo controls: sign in as each seeded account. Omit in production. */
  demoAccounts?: DemoAccountOption[];
  onSwitchAccount?: (option: DemoAccountOption) => void;
  onResetDemo?: () => void;
  /** Sidebar wordmark. Defaults to GMH Lab's. */
  eyebrow?: string;
  name?: string;
  /** Rendered after the shell (cart drawer, dialogs). */
  overlays?: ReactNode;
  children: ReactNode;
};

/**
 * The workspace chrome: a navy sidebar built from the module catalogue (locks
 * from core's `canAccess`), a glass top bar with search (⌘K palette), theme,
 * cart and the account menu, a page transition, and the toaster. Renders
 * its own full-height layout — mount it in place of the site's header and
 * footer, not inside them.
 */
export function DashboardShell({
  account,
  modules,
  pathname,
  basePath = "/dashboard",
  profileHref = `${basePath}/account`,
  storeHref = `${basePath}#store`,
  siteHref = "/",
  linkComponent: Link = PlainLink,
  onNavigate = (href) => window.location.assign(href),
  cartCount = 0,
  onOpenCart,
  isDark = false,
  onToggleTheme,
  pendingReviews = 0,
  reviewsModuleId,
  onSignOut,
  demoAccounts,
  onSwitchAccount,
  onResetDemo,
  eyebrow = GMH_DASHBOARD_COPY.workspaceEyebrow,
  name = GMH_DASHBOARD_COPY.workspaceName,
  overlays,
  children,
}: DashboardShellProps) {
  const [drawer, setDrawer] = useState(false);
  const [palette, setPalette] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPalette((p) => !p);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => setDrawer(false), [pathname]);

  const commands: PaletteCommand[] = useMemo(
    () => [
      { id: "home", label: "Home", icon: LayoutDashboard, run: () => onNavigate(basePath) },
      ...modules
        .filter((m) => !m.soon)
        .map((m) => ({
          id: m.id,
          label: m.title,
          hint: m.tagline,
          icon: ICONS[m.icon],
          run: () => onNavigate(m.href),
        })),
      { id: "store", label: "Plans & store", hint: "Pricing and add-ons", icon: ShoppingBag, run: () => onNavigate(storeHref) },
      { id: "profile", label: "Edit your profile", hint: "Bio, title, access", icon: UserRound, run: () => onNavigate(profileHref) },
      ...(onToggleTheme
        ? [{ id: "theme", label: isDark ? "Switch to light mode" : "Switch to dark mode", icon: isDark ? Sun : Moon, run: onToggleTheme }]
        : []),
      { id: "site", label: "Back to the public site", icon: ArrowLeft, run: () => onNavigate(siteHref) },
    ],
    [modules, onNavigate, basePath, storeHref, profileHref, siteHref, onToggleTheme, isDark],
  );

  const sidebar = (onItem?: () => void) => (
    <Sidebar
      account={account}
      modules={modules}
      pathname={pathname}
      basePath={basePath}
      profileHref={profileHref}
      pendingReviews={pendingReviews}
      reviewsModuleId={reviewsModuleId}
      Link={Link}
      eyebrow={eyebrow}
      name={name}
      homeHref={siteHref}
      onNavigate={onItem}
    />
  );

  return (
    <MotionConfig reducedMotion="user">
      <div className="dash lg:grid lg:grid-cols-[var(--dash-sidebar-w)_minmax(0,1fr)]">
        <a
          href="#dash-main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-on-primary"
        >
          Skip to content
        </a>

        <aside className="sticky top-0 hidden h-screen self-start lg:block">{sidebar()}</aside>

        <AnimatePresence>
          {drawer && (
            <>
              <motion.div
                className="fixed inset-0 z-[60] bg-scrim/50 backdrop-blur-sm lg:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setDrawer(false)}
              />
              <motion.aside
                className="fixed inset-y-0 left-0 z-[61] w-[min(var(--dash-sidebar-w),86vw)] lg:hidden"
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", stiffness: 340, damping: 34 }}
              >
                <button
                  type="button"
                  onClick={() => setDrawer(false)}
                  className="absolute right-3 top-4 z-10 rounded-full p-2 text-on-brand-band hover:bg-white/10"
                  aria-label="Close menu"
                >
                  <X className="size-5" />
                </button>
                {sidebar(() => setDrawer(false))}
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        <div className="min-w-0">
          <header className="sticky top-0 z-40 flex items-center gap-2 border-b border-outline-variant/50 bg-surface/70 px-4 py-3 backdrop-blur-xl sm:px-6 lg:px-10">
            <button
              type="button"
              className="rounded-full p-2 hover:bg-surface-container-high lg:hidden"
              onClick={() => setDrawer(true)}
              aria-label="Open menu"
            >
              <Menu className="size-5" />
            </button>

            <button
              type="button"
              onClick={() => setPalette(true)}
              className="flex h-10 flex-1 items-center gap-2 rounded-full border border-outline-variant/70 bg-surface-container-lowest/70 px-4 text-sm text-on-surface-variant transition hover:border-outline sm:max-w-sm"
            >
              <Search className="size-4" aria-hidden />
              <span className="flex-1 text-left">Search modules…</span>
              <kbd className="hidden items-center gap-0.5 rounded-md border border-outline-variant px-1.5 py-0.5 text-[11px] sm:inline-flex">
                <CommandIcon className="size-3" aria-hidden />K
              </kbd>
            </button>

            <div className="ml-auto flex items-center gap-1">
              {onToggleTheme && (
                <button
                  type="button"
                  onClick={onToggleTheme}
                  className="rounded-full p-2.5 hover:bg-surface-container-high"
                  aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={isDark ? "sun" : "moon"}
                      className="block"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {isDark ? <Sun className="size-5" /> : <Moon className="size-5" />}
                    </motion.span>
                  </AnimatePresence>
                </button>
              )}

              {onOpenCart && (
                <button
                  type="button"
                  onClick={onOpenCart}
                  className="relative rounded-full p-2.5 hover:bg-surface-container-high"
                  aria-label={`Cart, ${cartCount} item${cartCount === 1 ? "" : "s"}`}
                >
                  <ShoppingBag className="size-5" />
                  <AnimatePresence>
                    {cartCount > 0 && (
                      <motion.span
                        key={cartCount}
                        initial={{ scale: 0 }}
                        animate={{ scale: [1.4, 1] }}
                        exit={{ scale: 0 }}
                        className="absolute right-1 top-1 grid size-4 place-items-center rounded-full bg-tertiary-container text-[10px] font-bold text-on-tertiary-container"
                      >
                        {cartCount}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger
                  className="ml-1 rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                  aria-label="Account menu"
                >
                  <Monogram name={account.name} photo={account.photo} className="ring-outline-variant" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>
                      <span className="block text-sm font-semibold text-on-surface">{account.name}</span>
                      <span className="block text-xs font-normal">{account.email}</span>
                    </DropdownMenuLabel>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onNavigate(profileHref)}>
                    <UserRound /> Your profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onNavigate(siteHref)}>
                    <ArrowLeft /> Public site
                  </DropdownMenuItem>
                  {demoAccounts && onSwitchAccount && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuLabel>Demo: view as</DropdownMenuLabel>
                        {demoAccounts.map((option) => (
                          <DropdownMenuItem key={option.email} onClick={() => onSwitchAccount(option)}>
                            <span
                              className={cn(
                                "size-2 rounded-full",
                                account.email === option.email ? "bg-tertiary-container" : "bg-outline-variant",
                              )}
                            />
                            <span>
                              {option.label}
                              {option.role && <span className="block text-xs text-on-surface-variant">{option.role}</span>}
                            </span>
                          </DropdownMenuItem>
                        ))}
                        {onResetDemo && (
                          <DropdownMenuItem onClick={onResetDemo}>
                            <RotateCcw /> Reset demo data
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuGroup>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onSignOut}>
                    <LogOut /> Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          <motion.main
            id="dash-main"
            key={pathname}
            className="mx-auto w-full max-w-[90rem] px-4 py-6 sm:px-6 lg:px-10 lg:py-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            {children}
          </motion.main>
        </div>

        <CommandPalette open={palette} onClose={() => setPalette(false)} commands={commands} />
        {overlays}
        <Toaster />
      </div>
    </MotionConfig>
  );
}
