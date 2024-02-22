import { UUID } from 'crypto';
import { CorsaClient } from '../../zgw/CorsaClient';
import { DocumentVertaalService } from '../../zgw/DocumentVertaalService';

export class EnkelvoudigInformatieObjectenHandler {
  service: DocumentVertaalService;
  corsaClient: CorsaClient;
  constructor(corsaClient: CorsaClient) {
    this.corsaClient = corsaClient;
    this.service = new DocumentVertaalService(corsaClient);
  }

  async handleDownloadRequest(documentUUID: UUID) {
    return this.service.downloadEnkelVoudigInformatieObject(documentUUID);
  }

  async handleRequest(documentUUID: UUID) {
    return this.service.getEnkelVoudigInformatieObject(documentUUID);
  };
}
