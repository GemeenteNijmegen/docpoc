import { UUID } from 'crypto';
import { CorsaClient } from '../../zgw/CorsaClient';
import { DocumentVertaalService } from '../../zgw/DocumentVertaalService';
import { OpenZaakClient } from '../../zgw/OpenZaakClient';

export class ObjectInformatieObjectenHandler {
  service: DocumentVertaalService;
  openZaakClient: OpenZaakClient;
  corsaClient: CorsaClient;
  constructor(openZaakClient: OpenZaakClient, corsaClient: CorsaClient) {
    this.openZaakClient = openZaakClient;
    this.corsaClient = corsaClient;
    this.service = new DocumentVertaalService(corsaClient);
  }

  async handleRequest(uuid: UUID) {

    // Get zaak info from Open Zaak
    const openZaak = await this.getOpenZaak(uuid);
    let corsaZaakUuid = await this.getZaakCorsaUuid(openZaak);

    if (!corsaZaakUuid) {
      corsaZaakUuid = '5937ac5a-da23-425a-9af8-215ec2c30947'; //TODO: Remove and throw error when implemented in open zaak
      // throw Error('No matching Corsa zaak UUID found');
    }
    return this.service.listObjectInformatieObjecten(corsaZaakUuid);
  };

  async getOpenZaak(zaakUuid: UUID) {
    const urlString = `${this.openZaakClient.baseUrl}zaken/api/v1/zaken/${zaakUuid}`;
    const openZaak = await this.openZaakClient.request(urlString);
    return openZaak;
  }

  async getZaakCorsaUuid(openZaak: any) {
    if (!openZaak.eigenschappen || openZaak.eigenschappen.length != 1) {
      throw Error('Expected exactly one eigenschap in open zaak');
    }
    const url = openZaak.eigenschappen[0];
    const corsaZaakEigenschap = await this.openZaakClient.request(url);
    return corsaZaakEigenschap.waarde;
  }
}
