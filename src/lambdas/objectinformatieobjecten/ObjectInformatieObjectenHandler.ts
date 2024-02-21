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
    this.service = new DocumentVertaalService(openZaakClient, corsaClient);
  }

  handleRequest(uuid: UUID) {
    const urlString = `${this.openZaakClient.baseUrl}zaken/api/v1/zaken/${uuid}`;
    return this.service.listObjectInformatieObjecten(urlString);
  };
}
