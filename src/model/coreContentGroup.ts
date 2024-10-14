import { z } from "zod";
import groq from "groq";

import { zPortableText } from "./portableText";
import { zImage } from "./image";
import { gContentGroupProjection, zContentGroup } from "./contentGroup";

export const gCoreContentGroupsQuery = groq`
*[_id == "coreContentGroups-singleton"][0].groups[]{
  title,
  description,
  mainContent->{
    ${gContentGroupProjection}
  },
  supplementaryContent->{
    ${gContentGroupProjection}
  },
  "coverImage": select(
    coverImage != null => {
      "image": coverImage.image,
      "altText": coverImage.alt
    },
    null
  )
}
`;

export const zCoreContentGroup = z.object({
  title: z.string(),
  description: zPortableText.nullable(),
  coverImage: zImage.nullable(),
  mainContent: zContentGroup,
  supplementaryContent: zContentGroup.nullable(),
});

export type CoreContentGroup = z.infer<typeof zCoreContentGroup>;
