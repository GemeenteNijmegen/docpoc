import { UUID } from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

export class CorsaClient {
  getZaakDocuments(_corsaZaakUuid: UUID) {
    const file = fs.readFileSync(path.resolve(__dirname, '../test/samples/geefLijstZaakdocumenten_Lv01.xml'));
    return file.toString('utf-8');
  }

}
