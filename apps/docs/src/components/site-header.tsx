import { NavLink } from "react-router";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/components", label: "Components" },
  { to: "/tokens", label: "Tokens" },
  { to: "/slides", label: "Slides" },
  { to: "/flex", label: "Flex" },
  { to: "/button-migration", label: "Button Migration" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-4">
        <span className="font-semibold tracking-tight">monofly</span>
        <nav className="flex items-center gap-1 text-sm">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                [
                  "rounded-md px-3 py-1.5 transition-colors",
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
