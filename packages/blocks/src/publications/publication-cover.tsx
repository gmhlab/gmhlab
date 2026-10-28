import clsx from "clsx";
import { ResearchGlyph } from "@gmhlab/ui";
import type { Publication } from "./publications-types";
import "./publication-cover.css";

/**
 * A publication's picture: its venue's cover or masthead when the record has
 * a `cover`, otherwise the graphics kit's book glyph on a tile of the same
 * size, so a list of mixed records keeps one even column. One stand-in for
 * every record, not the theme's glyph: the row already shows the theme, and a
 * column of six different glyphs reads as noise.
 *
 * Decorative (`aria-hidden`, empty `alt`): every place that renders one also
 * names the journal in text, and "Journal logo" read aloud 343 times is noise.
 *
 * Size it from the calling page with `--publication-cover-size`; the image
 * and glyph both scale to the tile.
 */
export function PublicationCover({
  publication,
  className,
}: {
  publication: Publication;
  className?: string;
}) {
  return (
    <span
      className={clsx(
        "publication-cover",
        !publication.cover && "publication-cover-fallback",
        className,
      )}
      aria-hidden="true"
    >
      {publication.cover ? (
        <img
          src={publication.cover}
          alt=""
          width={192}
          height={192}
          loading="lazy"
          decoding="async"
        />
      ) : (
        <ResearchGlyph name="publication" />
      )}
    </span>
  );
}
