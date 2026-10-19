import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import "./graphics.css";

export type PhotoBackdropProps = {
  src: string;
  /** `object-position` for the crop, e.g. "center 30%". */
  position?: string;
  /**
   * How the surface wash lies over the photo. `start` (the default) keeps the
   * left side at reading strength and opens toward the right, for
   * left-aligned hero copy; `even` washes it uniformly, for centred copy.
   * Both fade the bottom edge into the surface, so the next band meets a
   * clean edge. Narrow screens always get the even wash.
   */
  wash?: "start" | "even";
  className?: string;
};

/**
 * A hero photograph in the brand's colours, laid under the graphics kit:
 * the duotone treatment (darks to navy, lights to gold), then a wash of the
 * band's own surface (`--graphic-photo-wash`) so copy keeps its contrast.
 * Put it in a positioned, isolated band beside a graphic backdrop — it sits
 * one layer below the graphics.
 *
 * Decorative, so the image has empty alt text. It fades in once loaded, so
 * the band never flashes the duotone's gold ground while the photo arrives.
 */
export function PhotoBackdrop({
  src,
  position,
  wash = "start",
  className,
}: PhotoBackdropProps) {
  const img = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);
  // A server-rendered <img> can finish before hydration attaches onLoad.
  useEffect(() => {
    if (img.current?.complete && img.current.naturalWidth > 0) setLoaded(true);
  }, [src]);

  return (
    <div
      className={clsx(
        "graphic-photo",
        `graphic-photo-wash-${wash}`,
        loaded && "is-loaded",
        className,
      )}
      style={position ? { "--graphic-photo-position": position } : undefined}
      aria-hidden="true"
    >
      <img
        ref={img}
        src={src}
        alt=""
        decoding="async"
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}
