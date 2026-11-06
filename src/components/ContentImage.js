import Image from "next/image";
import { urlForImage } from "../../sanity/lib/image";
export default function ContentImage({
  image,
  alt = "",
  sizes = "(min-width: 992px) 50vw, 100vw",
  priority = false,
}) {
  if (!image?.url)
    return (
      <Image
        src="/nekosero5.png"
        alt={alt}
        width={600}
        height={400}
        sizes={sizes}
      />
    );
  const src = urlForImage(image);
  return (
    <Image
      src={src}
      alt={image.alt || alt}
      width={image.dimensions?.width || 1368}
      height={image.dimensions?.height || 912}
      sizes={sizes}
      priority={priority}
      {...(image.lqip ? { placeholder: "blur", blurDataURL: image.lqip } : {})}
    />
  );
}
