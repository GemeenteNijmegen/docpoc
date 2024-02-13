import { z } from 'zod';

const ZaakDocumentSchema = z.object({
  'zkn:gerelateerde': z.object({
    'zkn:identificatie': z.string().uuid(),
  }).passthrough(),
});
export type ZaakDocument = z.infer<typeof ZaakDocumentSchema>;
export const ZaakDocumentenSchema = z.array(ZaakDocumentSchema);
