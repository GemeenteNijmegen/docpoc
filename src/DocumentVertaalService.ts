// import { UUID } from 'crypto';
import { UUID } from 'crypto';
import { XMLParser } from 'fast-xml-parser';
import { CorsaClient } from './CorsaClient';
import { ObjectInformatieObject } from './ObjectInformatieObject';
import { OpenZaakClient } from './OpenZaakClient';
import { ZaakDocumentenSchema } from './ZaakDocumentenSchema';

/**
 * This class orchestrates the communication between, and translation to/from the zaakDMS implementation
 * and the ZGW implementation. It should partially implement the Document API. For now, the
 * /objectinformatieobjecten endpoint is the only supported endpoint.
 *
 * To map between 'Open zaak' and the zaakDMS service, an ID is expected to be present in the zaak-kenmerken
 * with bron 'Corsa_Id'.
 */
export class DocumentVertaalService {
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

export class GeefLijstZaakDocumentenMapper {
  parser: XMLParser;
  constructor() {
    this.parser = new XMLParser();
  }

  map(xml: string): UUID[] {
    const json = this.parser.parse(xml);
    const docs = ZaakDocumentenSchema.parse(json['soap:Envelope']['soap:Body']['zkn:zakLa01']['zkn:antwoord']['zkn:object']['zkn:heeftRelevant']);
    const results = docs.map((doc: any) => doc['zkn:gerelateerde']['zkn:identificatie']);
    return results;
  }
}
