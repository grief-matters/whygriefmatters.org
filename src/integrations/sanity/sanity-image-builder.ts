import {
  createImageUrlBuilder,
  type ImageUrlBuilder,
  type SanityImageSource,
} from "@sanity/image-url";

import { getSanityClient } from "./sanity-client";

let builder: ImageUrlBuilder | null = null;

/**
 * Given a Sanity image source, returns a Sanity ImageUrlBuilder object
 *
 * @param source usually a Sanity Image Asset
 * @returns a clean Sanity Image URL Builder
 */
export function getImageUrlBuilder(source: SanityImageSource) {
  if (builder === null) {
    builder = createImageUrlBuilder(getSanityClient());
  }

  return builder.image(source);
}
