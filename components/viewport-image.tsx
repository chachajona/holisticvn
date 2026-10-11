import { getImageProps, type ImageProps } from "next/image";

const transparentPixel = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";

// A hidden CSS image can still load eagerly. Let the browser select its source by viewport instead.
export function ViewportImage({ media, ...image }: ImageProps & { media: string }) {
  const { props } = getImageProps(image);
  return (
    <picture>
      <source media={media} srcSet={props.srcSet} sizes={props.sizes} />
      <img {...props} alt={props.alt} src={transparentPixel} srcSet={undefined} />
    </picture>
  );
}
