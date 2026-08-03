import clsx from "clsx";
import { ComponentPropsWithoutRef, useCallback, useState } from "react";
import { placeholder } from "../../images";
import "./image.css";

export type ImageProps = Omit<ComponentPropsWithoutRef<"img">, "alt"> & {
  alt: string;
  aspectRatio?: "1-1" | "16-9" | "4-3" | "fill" | "natural";
  size?: "small" | "medium" | "large" | "fill" | "natural";
  variant?: "default" | "rounded";
};
export function Image({
  aspectRatio = "natural",
  className,
  size = "natural",
  variant = "rounded",
  ...props
}: ImageProps) {
  const [loaded, setLoaded] = useState(false);
  // A cached image is already `complete` before React attaches `onLoad`, so
  // that event never fires and the img would stay hidden (`image-loading`).
  // Check on ref attach to reveal cached images. On load failure (or no src)
  // we leave `loaded` false so the `placeholder` graphic stays shown instead
  // of a broken-image icon or a blank panel.
  const handleRef = useCallback((img: HTMLImageElement | null) => {
    if (img?.complete && img.naturalWidth > 0) setLoaded(true);
  }, []);
  const classNames = clsx(
    className,
    "image",
    `image-aspect-ratio-${aspectRatio}`,
    `image-size-${size}`,
    `image-variant-${variant}`,
    !loaded && `image-loading`,
  );
  return (
    <>
      {!loaded && (
        <span
          className={clsx("image-placeholder", classNames)}
          style={{
            backgroundImage: `url("${placeholder}")`,
            backgroundSize: "contain",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
      )}
      {props.src && (
        <img
          ref={handleRef}
          className={classNames}
          {...props}
          onLoad={() => setLoaded(true)}
        />
      )}
    </>
  );
}

export type PictureProps = ComponentPropsWithoutRef<"picture">;
export function Picture({ className, ...props }: PictureProps) {
  const classNames = clsx(className, "picture");
  return <picture className={classNames} {...props} />;
}

export type PictureSourceProps = ComponentPropsWithoutRef<"source">;
export function PictureSource({ ...props }: PictureSourceProps) {
  return <source {...props} />;
}