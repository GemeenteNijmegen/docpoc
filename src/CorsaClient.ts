import { UUID } from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

export class CorsaClient {
  geefLijstZaakDocumenten(_corsaZaakUuid: UUID) {
    const file = fs.readFileSync(path.join(__dirname, '../test/samples/geefLijstZaakdocumenten_Lv01.xml'));
    return file.toString('utf-8');
  }

  geefZaakDocument(_corsaDocumentUuid: UUID) {
    const file = fs.readFileSync(path.join(__dirname, '../test/samples/geefZaakDocumentLezen_Lv0.xml'));
    return file.toString('utf-8');
  }
}
