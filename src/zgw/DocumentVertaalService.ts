import { UUID, randomUUID } from 'crypto';
import { CorsaClient } from './CorsaClient';
import { EnkelvoudigInformatieObject, EnkelvoudigInformatieObjectSchema } from './EnkelvoudigInformatieObjectSchema';
import { ObjectInformatieObject } from './ObjectInformatieObject';
import { getFileSizeForBase64String } from './utils';
import { ZaakDocument, ZaakDocumenten } from './ZaakDocument';
/**
 * This class orchestrates the communication between, and translation to/from the zaakDMS implementation
 * and the ZGW implementation. It should partially implement the Document API. For now, the
 * /objectinformatieobjecten endpoint is the only supported endpoint.
 *
 * To map between 'Open zaak' and the zaakDMS service, an ID is expected to be present in the zaak-kenmerken
 * with bron 'Corsa_Id'.
 */
export class DocumentVertaalService {
  private corsaClient: CorsaClient;
  constructor(corsaClient: CorsaClient) {
    this.corsaClient = corsaClient;
  }
  async listObjectInformatieObjecten(corsaZaakUUID: UUID): Promise<ObjectInformatieObject[]> {

    // Call ZaakDMS-endpoint with corsa UUID
    const zaakDocumenten = await this.corsaClient.geefLijstZaakDocumenten(corsaZaakUUID);
    const corsaDocumentUUIDs = new GeefLijstZaakDocumentenMapper().map(zaakDocumenten);

    // Transform response to objectInformatieObjecten response
    const objects = this.mapUUIDsToObjectInformatieObjecten(corsaZaakUUID, corsaDocumentUUIDs);

    // Return response
    return objects;
  }

  async getEnkelVoudigInformatieObject(documentUUID: UUID): Promise<EnkelvoudigInformatieObject> {
    // Get document from Corsa based on provided UUID (last path part in call)
    const documentDetails = await this.corsaClient.geefZaakDocument(documentUUID);

    // Transform response to enkelvoudigInformatieObject object
    const enkelvoudigInformatieObject = new GeefZaakDocumentMapper().map(documentDetails);
    // Return object
    return EnkelvoudigInformatieObjectSchema.parse(enkelvoudigInformatieObject);
  }

  async downloadEnkelVoudigInformatieObject(objectUrlString: string): Promise<any> {
    const uuid = this.uuidFromUrlString(objectUrlString);
    const documentDetails = await this.corsaClient.geefZaakDocument(uuid);
    return Buffer.from(documentDetails['zkn:inhoud'].text);
  }

  private uuidFromUrlString(objectUrlString: string) {
    const objectUrl = new URL(objectUrlString);
    const uuid = objectUrl.pathname.split('/').pop() as UUID;
    return uuid;
  }

  mapUUIDsToObjectInformatieObjecten(zaakId: UUID, uuids: UUID[]): ObjectInformatieObject[] {
    return uuids.map(uuid => {
      return {
        url: `${process.env.APPLICATION_BASE_URL}/objectinformatieobjecten/${zaakId}`,
        informatieobject: `${process.env.APPLICATION_BASE_URL}/enkelvoudiginformatieobjecten/${uuid}`,
        object: `${process.env.OPENZAAK_BASE_URL}/zaken/api/v1/zaken/${zaakId}`,
        objectType: 'zaak',
        // _expand: {
        //   'informatieobject.titel': '',
        // },
      };
    });
  }
}

export class GeefLijstZaakDocumentenMapper {
  map(docs: ZaakDocumenten): UUID[] {
    const results = docs.map((doc: any) => doc['zkn:gerelateerde']['zkn:identificatie'].text);
    return results;
  }
}

export class GeefZaakDocumentMapper {
  map(doc: ZaakDocument): EnkelvoudigInformatieObject {
    const enkelvoudigInformatieObject: EnkelvoudigInformatieObject = {
      url: `https://example/com/api/v1/documenten/${doc['zkn:identificatie'].text}`,
      auteur: doc['zkn:auteur'].text,
      beginRegistratie: this.mapDate(doc['zkn:creatiedatum'].text),
      bestandsdelen: [{
        url: `https://example.com/api/v1/documenten/enkelvoudiginformatieobjecten/${randomUUID()}/download`,
        lock: 'randomzogenaamdehash', //TODO hash opnemen??
        omvang: getFileSizeForBase64String(doc['zkn:inhoud'].text),
        volgnummer: 1,
        voltooid: true,
      }],
      bronorganisatie: '123456789',
      creatiedatum: this.mapDate(doc['zkn:creatiedatum'].text),
      informatieobjecttype: 'https://example.com', //TODO Catalogus API referentie
      locked: false, //Placeholder
      taal: this.mapLanguage(doc['zkn:taal'].text),
      titel: doc['zkn:titel'].text,
      versie: 1, //Placeholder
      bestandsnaam: doc['zkn:inhoud']['stuf:bestandsnaam'],
      beschrijving: doc['zkn:dct.omschrijving'].text,
    };
    console.debug(enkelvoudigInformatieObject);
    return EnkelvoudigInformatieObjectSchema.parse(enkelvoudigInformatieObject);
  }

  mapLanguage(iso6391: string) {
    if (iso6391=='nl') {
      return 'dut';
    } else {
      throw Error('Language not supported');
    };
  }

  mapDate(yyyymmdd: any) {
    const dateString = yyyymmdd.toString();
    const year = Number(dateString.substring(0, 4));
    const month = Number(dateString.substring(4, 6));
    const day = Number(dateString.substring(6, 8));
    const date = new Date(year, month-1, day);
    return date.toISOString();
  }
}
