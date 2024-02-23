import { UUID } from 'crypto';
import { XMLParser } from 'fast-xml-parser';
import * as geefLijstZaakDocumenten from '../../../test/samples/geefLijstZaakdocumenten_Lv01.xml';
import * as geefZaakDocument from '../../../test/samples/geefZaakdocumentLezen_Lv0.xml';
import { ZaakDmsClient } from '../ZaakDmsClient';
import { ZaakDocument, ZaakDocumentSchema, ZaakDocumenten, ZaakDocumentenSchema } from '../ZaakDocument';

export class ZaakDmsClientMock implements ZaakDmsClient {
  private static readonly alwaysArray = [
    'soap:Envelope.soap:Body.zkn:zakLa01.zkn:antwoord.zkn:object.zkn:heeftRelevant',
  ];
  private parser: XMLParser;
  constructor() {
    this.parser = new XMLParser({
      ignoreAttributes: false,
      alwaysCreateTextNode: true,
      textNodeName: 'text',
      attributeNamePrefix: '',
      isArray: (_name, jpath) => ZaakDmsClientMock.alwaysArray.indexOf(jpath) !== -1,
    });
  }
  async geefLijstZaakDocumenten(_uuid: UUID): Promise<ZaakDocumenten> {
    return this.parseZaakDocumenten(geefLijstZaakDocumenten.default);
  }
  async geefZaakDocument(_zaakDmsDocumentUuid: UUID): Promise<ZaakDocument> {
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
