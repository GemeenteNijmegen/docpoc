import { z } from 'zod';


export const ZaakDocumentSchema =
z.object({
  'zkn:auteur': z.object({
    text: z.string(),
  }),
  'zkn:identificatie': z.object({
    text: z.string(),
  }),
  'zkn:creatiedatum': z.object({
    text: z.number(),
  }),
  'zkn:taal': z.object({
    text: z.string(),
  }),
  'zkn:titel': z.object({
    text: z.string(),
  }),
  'zkn:inhoud': z.object({
    'text': z.string(),
    'stuf:bestandsnaam': z.string(),
  }),
  'zkn:dct.omschrijving': z.object({
    text: z.string().optional(),
  }),
});
export type ZaakDocument = z.infer<typeof ZaakDocumentSchema>;
export const ZaakDocumentenSchema =
  z.array(
    z.object({
      'zkn:gerelateerde': z.object({
        'zkn:identificatie': z.object({
          text: z.string(),
        }),
      }),
    }),
  );
export type ZaakDocumenten = z.infer<typeof ZaakDocumentenSchema>;
