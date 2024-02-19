import { UUID } from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

export class CorsaClient {
  geefLijstZaakDocumenten(_corsaZaakUuid: UUID) {
    const projectRootDir = path.resolve(path.basename(__dirname));
    const file = fs.readFileSync(path.resolve(projectRootDir, 'test/samples/geefLijstZaakdocumenten_Lv01.xml'));
    return file.toString('utf-8');
  }

  geefZaakDocument(_corsaDocumentUuid: UUID) {
    const projectRootDir = path.resolve(path.basename(__dirname));
    const file = fs.readFileSync(path.resolve(projectRootDir, 'test/samples/geefZaakDocumentLezen_Lv0.xml'));
    return file.toString('utf-8');
  }
}
