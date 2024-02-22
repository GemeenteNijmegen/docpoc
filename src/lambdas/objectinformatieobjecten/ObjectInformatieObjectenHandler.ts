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
    const urlString = `${this.openZaakClient.baseUrl}zaken/api/v1/zaken/${uuid}`;
    // Retrieve corsa ID from zaak
    const sampleZaak = await this.openZaakClient.request(urlString);
    let corsaZaakUUID = sampleZaak.kenmerken.find((kenmerk: any) => kenmerk?.bron == 'Corsa_Id')?.kenmerk;
    if (!corsaZaakUUID) {
      corsaZaakUUID = '5937ac5a-da23-425a-9af8-215ec2c30947'; //TODO: Remove and throw error when implemented in open zaak
      // throw Error('No matching Corsa zaak UUID found');
    }
    return this.service.listObjectInformatieObjecten(corsaZaakUUID);
  };
}
