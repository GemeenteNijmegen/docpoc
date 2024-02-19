import { UUID } from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import { XMLParser } from 'fast-xml-parser';
import { ZaakDocument, ZaakDocumentSchema, ZaakDocumenten, ZaakDocumentenSchema } from './ZaakDocument';

export class CorsaClient {
  parser: XMLParser;
  constructor() {
    this.parser = new XMLParser({
      ignoreAttributes: false,
      alwaysCreateTextNode: true,
      textNodeName: 'text',
      attributeNamePrefix: '',
    });
  }

  geefLijstZaakDocumenten(_corsaZaakUuid: UUID): ZaakDocumenten {
    const file = fs.readFileSync(path.resolve(__dirname, '../../test/samples/geefLijstZaakdocumenten_Lv01.xml'));
    const docs = this.parseZaakDocumenten(file);
    return docs;
  }


  geefZaakDocument(_corsaDocumentUuid: UUID) {
    const file = fs.readFileSync(path.resolve(__dirname, '../../test/samples/geefZaakDocumentLezen_Lv0.xml'));
    return this.parseZaakDocument(file.toString('utf-8'));
  }

  private parseZaakDocumenten(file: Buffer) {
    const json = this.parser.parse(file.toString('utf-8'));
    const docs = ZaakDocumentenSchema.parse(json['soap:Envelope']['soap:Body']['zkn:zakLa01']['zkn:antwoord']['zkn:object']['zkn:heeftRelevant']);
    return docs;
  }

  private parseZaakDocument(xml: string): ZaakDocument {
    const json = this.parser.parse(xml);
    const doc = ZaakDocumentSchema.parse(json['soap:Envelope']['soap:Body']['zkn:edcLa01']['zkn:antwoord']['zkn:object']);
    return doc;
  }
}
