import { UUID } from 'crypto';
import { DocumentVertaalService } from '../../zgw/DocumentVertaalService';
import { OpenZaakClient } from '../../zgw/OpenZaakClient';
import { ZaakDmsClient } from '../../zgw/ZaakDmsClient';

export class ObjectInformatieObjectenHandler {
  service: DocumentVertaalService;
  openZaakClient: OpenZaakClient;
  zaakDmsClient: ZaakDmsClient;
  constructor(openZaakClient: OpenZaakClient, zaakDmsClient: ZaakDmsClient) {
    this.openZaakClient = openZaakClient;
    this.zaakDmsClient = zaakDmsClient;
    this.service = new DocumentVertaalService(zaakDmsClient);
  }

  async handleRequest(uuid: UUID) {
    const openZaak = await this.getOpenZaak(uuid);
    let corsaUuid = await this.getCorsaUuid(openZaak);
    if (!corsaUuid) {
      throw Error('No matching Corsa zaak UUID found');
    }
    return this.service.listObjectInformatieObjecten(corsaUuid);
  };

  async getOpenZaak(zaakUuid: UUID) {
    const urlString = `${this.openZaakClient.baseUrl}zaken/api/v1/zaken/${zaakUuid}`;
    const openZaak = await this.openZaakClient.request(urlString);
    return openZaak;
  }

  async getCorsaUuid(openZaak: any) {
    if (!openZaak.eigenschappen || openZaak.eigenschappen.length != 1) {
      throw Error('Expected exactly one eigenschap in open zaak');
    }
    const url = openZaak.eigenschappen[0];
    const corsaIdEigenschap = await this.openZaakClient.request(url);
    return corsaIdEigenschap.waarde;
  }
}
