import { UUID } from 'crypto';
import { DocumentVertaalService } from '../../zgw/DocumentVertaalService';

export class ObjectInformatieObjectenHandler {
  service: DocumentVertaalService;
  openZaakBaseUrl: string;
  constructor(openZaakBaseUrl: string) {
    this.service = new DocumentVertaalService();
    this.openZaakBaseUrl = openZaakBaseUrl;
  }

  handleRequest(uuid: UUID) {
    const urlString = `${this.openZaakBaseUrl}/${uuid}`;
    return this.service.listObjectInformatieObjecten(urlString);
  };
}
