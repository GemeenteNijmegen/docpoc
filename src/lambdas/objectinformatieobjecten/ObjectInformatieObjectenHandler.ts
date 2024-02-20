import { UUID } from 'crypto';
import { DocumentVertaalService } from '../../zgw/DocumentVertaalService';
import { OpenZaakClient } from '../../zgw/OpenZaakClient';

export class ObjectInformatieObjectenHandler {
  service: DocumentVertaalService;
  openZaakClient: OpenZaakClient;
  constructor(openZaakClient: OpenZaakClient) {
    this.openZaakClient = openZaakClient;
    this.service = new DocumentVertaalService(openZaakClient);
  }

  handleRequest(uuid: UUID) {
    const urlString = `${this.openZaakClient.baseUrl}zaken/api/v1/zaken/${uuid}`;
    return this.service.listObjectInformatieObjecten(urlString);
  };
}
