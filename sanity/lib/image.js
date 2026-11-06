import { createImageUrlBuilder as imageUrlBuilder } from "@sanity/image-url";
import { dataset, projectId } from "../env";
export function urlForImage(source, width = 1400) {
  return imageUrlBuilder({ projectId, dataset })
    .image(source)
    .width(width)
    .auto("format")
    .url();
}
