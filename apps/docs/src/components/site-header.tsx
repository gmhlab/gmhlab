import { NavLink } from "react-router";

/** Keep in step with the router in `App.tsx` and the cards on `HomePage`. */
const links = [
  { to: "/", label: "Home", end: true },
  { to: "/components", label: "Components" },
  { to: "/blocks", label: "Blocks" },
  { to: "/tokens", label: "Tokens" },
  { to: "/slides", label: "Slides" },
  { to: "/flex", label: "Flex" },
  { to: "/button-migration", label: "Button Migration" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-4">
        <span className="shrink-0 font-semibold tracking-tight">gmhlab</span>
        {/* The row scrolls sideways rather than wrapping: seven links wrapping
            would make this fixed-height bar clip its second line. */}
        <nav className="flex min-w-0 items-center gap-1 overflow-x-auto text-sm">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                [
                  "shrink-0 rounded-md px-3 py-1.5 transition-colors",
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
                ].join(" ")
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
