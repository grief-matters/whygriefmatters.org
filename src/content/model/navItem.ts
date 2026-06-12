import { z } from "astro/zod";

import {
  zAudienceRole,
  zInternetResourceType,
  zSupportedGriever,
} from "./internetResource";
import { zTaxonomyReference } from "./taxonomy";

/**
 * A `navItem` represents a way to navigate to content: an optional taxonomy
 * entry point, plus filter refs and facet selections that narrow the resulting
 * page or query.
 *
 * The primitive is consumed by `navigationTree` (where it's a leaf in a
 * recursive tree), and by content blocks (where it's embedded directly in
 * freeform content).
 *
 * Cross-field rules (label required when no entryPoint; at least one of
 * entryPoint/filters/mediaTypes/audienceRole must be present) are enforced
 * upstream in the Sanity schema.
 */
export const zNavItem = z.object({
  label: z.string().nullable(),
  entryPoint: zTaxonomyReference.nullable(),
  filters: z.array(zTaxonomyReference),
  mediaTypes: z.array(zInternetResourceType).nullable(),
  audienceRole: z.array(zAudienceRole).nullable(),
  supportedGriever: z.array(zSupportedGriever).nullable(),
});
export type NavItem = z.infer<typeof zNavItem>;
