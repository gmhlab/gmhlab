import { Link } from "react-router";

const demos = [
  {
    to: "/tokens",
    title: "Tokens",
    body: "The design-token gallery — semantic color roles, pairing recipes, and the responsive foundations grid.",
  },
  {
    to: "/slides",
    title: "Slides",
    body: "Full-bleed BrandSlide layouts in the brand and neutral variants.",
  },
  {
    to: "/flex",
    title: "Flex",
    body: "Flex and FlexItem sizing demos — wrap, thirds, minor/major/fill, and column stretch.",
  },
];

export function HomePage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-4xl font-bold tracking-tight">monofly demo</h1>
      <p className="mt-3 text-lg text-muted-foreground">
        A reference app for the @gmhlab design-system stack. Pick a demo.
      </p>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {demos.map((demo) => (
          <Link
            key={demo.to}
            to={demo.to}
            className="group rounded-lg border border-border bg-card p-6 text-card-foreground transition-colors hover:border-foreground/30 hover:bg-accent/40"
          >
            <h2 className="text-xl font-semibold">{demo.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{demo.body}</p>
            <span className="mt-4 inline-block text-sm font-medium text-muted-foreground group-hover:text-foreground">
              View demo →
            </span>
          </Link>
        ))}
      </div>
    </main>
  );
}
