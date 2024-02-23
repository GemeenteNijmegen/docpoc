import { UUID } from 'crypto';
import { EnkelvoudigInformatieObject, EnkelvoudigInformatieObjectSchema } from './EnkelvoudigInformatieObjectSchema';
import { GeefLijstZaakDocumentenMapper, GeefZaakDocumentMapper } from './GeefLijstZaakDocumentenMapper';
import { ObjectInformatieObject } from './ObjectInformatieObject';
import { ZaakDmsClient } from './ZaakDmsClient';
/**
 * This class orchestrates the communication between, and translation to/from the zaakDMS implementation
 * and the ZGW implementation. It should partially implement the Document API. For now, the
 * /objectinformatieobjecten endpoint is the only supported endpoint.
 *
 * To map between 'Open zaak' and the zaakDMS service, an ID is expected to be present in the zaak-kenmerken
 * with bron 'ZAAKDMS_Id'.
 */
export class DocumentVertaalService {
  private zaakDmsClient: ZaakDmsClient;
  constructor(zaakDmsClient: ZaakDmsClient) {
    this.zaakDmsClient = zaakDmsClient;
  }
  async listObjectInformatieObjecten(zaakDmsZaakUUID: UUID): Promise<ObjectInformatieObject[]> {

    // Call ZaakDMS-endpoint with zaakDms UUID
    const zaakDocumenten = await this.zaakDmsClient.geefLijstZaakDocumenten(zaakDmsZaakUUID);
    const zaakDmsDocumentUUIDs = new GeefLijstZaakDocumentenMapper().map(zaakDocumenten);

    // Transform response to objectInformatieObjecten response
    const objects = this.mapUUIDsToObjectInformatieObjecten(zaakDmsZaakUUID, zaakDmsDocumentUUIDs);

    // Return response
    return objects;
  }

  async getEnkelVoudigInformatieObject(documentUUID: UUID): Promise<EnkelvoudigInformatieObject> {
    // Get document from ZaakDms based on provided UUID (last path part in call)
    const documentDetails = await this.zaakDmsClient.geefZaakDocument(documentUUID);

    // Transform response to enkelvoudigInformatieObject object
    const enkelvoudigInformatieObject = new GeefZaakDocumentMapper().map(documentDetails);
    // Return object
    return EnkelvoudigInformatieObjectSchema.parse(enkelvoudigInformatieObject);
  }

  async downloadEnkelVoudigInformatieObject(documentUUID: UUID): Promise<any> {
    const documentDetails = await this.zaakDmsClient.geefZaakDocument(documentUUID);
    return Buffer.from(documentDetails['zkn:inhoud'].text);
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


