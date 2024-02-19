import { z } from 'zod';

const ObjectInformatieObjectSchema = z.object({
  url: z.string(),
  informatieobject: z.string(),
  object: z.string(),
  objectType: z.enum(['besluit', 'zaak', 'verzoek']),
});
export type ObjectInformatieObject = z.infer<typeof ObjectInformatieObjectSchema>;
