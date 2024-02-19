import { UUID } from 'crypto';
import { XMLParser } from 'fast-xml-parser';
import { ZaakDocument, ZaakDocumentSchema, ZaakDocumenten, ZaakDocumentenSchema } from './ZaakDocument';

import * as geefLijstZaakdocumenten from '../../test/samples/geefLijstZaakdocumenten_Lv01.xml';
import * as geefZaakDocument from '../../test/samples/geefZaakdocumentLezen_Lv0.xml';

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
    const docs = this.parseZaakDocumenten(geefLijstZaakdocumenten.default);
    return docs;
  }


  geefZaakDocument(_corsaDocumentUuid: UUID) {
    return this.parseZaakDocument(geefZaakDocument.default);
  }

  private parseZaakDocumenten(xml: string) {
    const json = this.parser.parse(xml);
    const docs = ZaakDocumentenSchema.parse(json['soap:Envelope']['soap:Body']['zkn:zakLa01']['zkn:antwoord']['zkn:object']['zkn:heeftRelevant']);
    return docs;
  }

  private parseZaakDocument(xml: string): ZaakDocument {
    const json = this.parser.parse(xml);
    const doc = ZaakDocumentSchema.parse(json['soap:Envelope']['soap:Body']['zkn:edcLa01']['zkn:antwoord']['zkn:object']);
    return doc;
  }
}
