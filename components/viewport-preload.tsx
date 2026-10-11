import { getImageProps } from "next/image";

// next/image `priority` preloads in every viewport, so a photo hidden at that width is fetched and
// never used. This preloads the LCP photo only where the media query matches.
export function ViewportPreload({
  src,
  sizes,
  media,
}: {
  src: string;
  sizes: string;
  media: string;
}) {
  const { props } = getImageProps({ src, alt: "", fill: true, sizes });
  return (
    <link
      rel="preload"
      as="image"
      href={props.src}
      imageSrcSet={props.srcSet}
      imageSizes={props.sizes}
      media={media}
      fetchPriority="high"
    />
  );
}
