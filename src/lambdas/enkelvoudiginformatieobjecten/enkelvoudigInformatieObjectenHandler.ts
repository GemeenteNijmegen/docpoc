import { UUID } from 'crypto';
import { DocumentVertaalService } from '../../zgw/DocumentVertaalService';
import { ZaakDmsClient } from '../../zgw/ZaakDmsClient';

export class EnkelvoudigInformatieObjectenHandler {
  service: DocumentVertaalService;
  zaakDmsClient: ZaakDmsClient;
  constructor(zaakDmsClient: ZaakDmsClient) {
    this.zaakDmsClient = zaakDmsClient;
    this.service = new DocumentVertaalService(zaakDmsClient);
  }

  async handleDownloadRequest(documentUUID: UUID) {
    return this.service.downloadEnkelVoudigInformatieObject(documentUUID);
  }

  async handleRequest(documentUUID: UUID) {
    return this.service.getEnkelVoudigInformatieObject(documentUUID);
  };
}
