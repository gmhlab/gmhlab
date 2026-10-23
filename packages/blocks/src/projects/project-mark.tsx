import "./project-mark.css";

/**
 * A project's own logo on a paper tile. Internal to the projects blocks — the
 * index cards, the spotlight, the detail hero and the related cards.
 *
 * The tile is always paper, in both themes and on brand bands: project logos
 * are third-party artwork drawn for a white page (ALIVE's wordmark and EQUIP's
 * outline are near-black), so they cannot follow the surface the way the
 * graphics kit does.
 *
 * Decorative (`alt=""`): every call site sets the project's name as text right
 * beside it, so a described logo would only read the name twice.
 */
export function ProjectMark({
  src,
  size = "medium",
  className,
}: {
  src: string;
  size?: "small" | "medium" | "large";
  className?: string;
}) {
  return (
    <span
      className={["project-mark", `project-mark-${size}`, className]
        .filter(Boolean)
        .join(" ")}
    >
      <img src={src} alt="" loading="lazy" decoding="async" />
    </span>
  );
}
