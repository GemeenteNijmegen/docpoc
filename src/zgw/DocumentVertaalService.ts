import { UUID } from 'crypto';
import { CorsaClient } from './CorsaClient';
import { EnkelvoudigInformatieObject, EnkelvoudigInformatieObjectSchema } from './EnkelvoudigInformatieObjectSchema';
import { GeefLijstZaakDocumentenMapper, GeefZaakDocumentMapper } from './GeefLijstZaakDocumentenMapper';
import { ObjectInformatieObject } from './ObjectInformatieObject';
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


