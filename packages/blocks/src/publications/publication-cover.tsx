import clsx from "clsx";
import { ResearchGlyph } from "@gmhlab/ui";
import {
  PUBLICATION_THEME_GLYPHS,
  type Publication,
} from "./publications-types";
import "./publication-cover.css";

/**
 * A publication's picture: its venue's cover or masthead when the record has
 * a `cover`, otherwise the theme's graphics-kit glyph on a tile of the same
 * size, so a list of mixed records keeps one even column.
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
        <ResearchGlyph name={PUBLICATION_THEME_GLYPHS[publication.theme]} />
      )}
    </span>
  );
}
