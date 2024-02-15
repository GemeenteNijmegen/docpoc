import { z } from 'zod';

export const EnkelvoudigInformatieObjectSchema = z.object({
  url: z.string().url(),
  bronorganisatie: z.string().max(9),
  creatiedatum: z.coerce.date(),
  titel: z.string().max(200),
  auteur: z.string().max(200),
  taal: z.string().length(3),
  versie: z.number(),
  beginRegistratie: z.string().datetime(),
  informatieobjecttype: z.string().max(200),
  locked: z.boolean(),
  bestandsdelen: z.array(
    z.object({
      url: z.string(),
      volgnummer: z.number(),
      omvang: z.number(),
      voltooid: z.boolean(),
      lock: z.string(),
    }),
  ),
});
export type EnkelvoudigInformatieObject = z.infer<typeof EnkelvoudigInformatieObjectSchema>;
