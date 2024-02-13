// import { UUID } from 'crypto';
import { UUID } from 'crypto';
import { XMLParser } from 'fast-xml-parser';
import { z } from 'zod';
import { CorsaClient } from './CorsaClient';
import { OpenZaakClient } from './OpenZaakClient';

export class DocumentVertaalService {
  constructor() {

  }

  async listObjectInformatieObjecten(_zaakUrl: string): Promise<ObjectInformatieObject[]> {

    // Call zaken/uuid endpoint (in open zaak)
    // const zaak = getZaak(zaakUrl);

    // Retrieve corsa ID from zaak
    const zaakClient = new OpenZaakClient({ baseUrl: '' });
    const sampleZaak = await zaakClient.request(_zaakUrl);
    const corsaZaakUUID = sampleZaak.kenmerken.find((kenmerk: any) => kenmerk.bron == 'Corsa_Id').kenmerk;
    // Call ZaakDMS-endpoint with corsa UUID
    const documentXMLFromCorsa = new CorsaClient().getZaakDocuments(corsaZaakUUID);
    const corsaDocumentUUIDs = new GeefLijstZaakDocumentenMapper().map(documentXMLFromCorsa);
    // Transform response to objectInformatieObjecten response
    const objects = this.mapUUIDsToObjectInformatieObjecten(corsaZaakUUID, corsaDocumentUUIDs);
    // Return response
    return objects;
  }

  mapUUIDsToObjectInformatieObjecten(zaakId: UUID, uuids: UUID[]): ObjectInformatieObject[] {
    return uuids.map(uuid => {
      return {
        url: `http://zaken.nl/${zaakId}`,
        informatieobject: `https://documenten-api.vng.cloud/api/v1/enkelvoudiginformatieobjecten/${uuid}`,
        object: 'http://example.com',
        objectType: 'besluit',
        // _expand: {
        //   'informatieobject.titel': '',
        // },
      };
    });
  }
}

const ObjectInformatieObjectSchema = z.object({
  url: z.string(),
  informatieobject: z.string(),
  object: z.string(),
  objectType: z.enum(['besluit', 'zaak', 'verzoek']),
});
export type ObjectInformatieObject = z.infer<typeof ObjectInformatieObjectSchema>;

const ZaakDocumentSchema = z.object({
  'zkn:gerelateerde': z.object({
    'zkn:identificatie': z.string().uuid(),
  }).passthrough(),
});
export type ZaakDocument = z.infer<typeof ZaakDocumentSchema>;

const ZaakDocumentenSchema = z.array(ZaakDocumentSchema);

export class GeefLijstZaakDocumentenMapper {
  parser: XMLParser;
  constructor() {
    this.parser = new XMLParser();
  }

  map(xml: string) {
    const json = this.parser.parse(xml);
    const docs = ZaakDocumentenSchema.parse(json['soap:Envelope']['soap:Body']['zkn:zakLa01']['zkn:antwoord']['zkn:object']['zkn:heeftRelevant']);
    const results = docs.map((doc: any) => doc['zkn:gerelateerde']['zkn:identificatie']);
    return results;
  }
}
