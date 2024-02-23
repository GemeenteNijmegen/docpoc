import { UUID } from 'crypto';
import { ApiClient } from '@gemeentenijmegen/apiclient';
import { AWS } from '@gemeentenijmegen/utils';
import { XMLParser } from 'fast-xml-parser';
import * as geefLijstZaakdocumentenRequest from './soapcalls/geefLijstzaakdocumenten_Lv01.xml';
import * as geefZaakDocumenRequest from './soapcalls/geefZaakdocumentLezen_EdcLv01.xml';
import { ZaakDocument, ZaakDocumentSchema, ZaakDocumenten, ZaakDocumentenSchema } from './ZaakDocument';

export interface ZaakDmsClient {
  geefLijstZaakDocumenten(uuid: UUID): Promise<ZaakDocumenten>;
  geefZaakDocument(zaakDmsDocumentUuid: UUID): Promise<ZaakDocument>;
}

export class ZaakDmsClientImpl implements ZaakDmsClient {

  private static readonly alwaysArray = [
    'soap:Envelope.soap:Body.zkn:zakLa01.zkn:antwoord.zkn:object.zkn:heeftRelevant',
  ];

  private parser: XMLParser;
  private baseUrl: string;
  private apiClient?: ApiClient;

  constructor(baseUrl?: string, apiClient?: ApiClient) {
    if (!baseUrl) {
      if (!process.env.ZAAKDMS_CLIENT_BASE_URL) {
        throw new Error('ZAAKDMS_CLIENT_BASE_URL not set and no baseUrl provided');
      }
      this.baseUrl = process.env.ZAAKDMS_CLIENT_BASE_URL;
    } else {
      this.baseUrl = baseUrl;
    }
    this.apiClient = apiClient;
    this.parser = new XMLParser({
      ignoreAttributes: false,
      alwaysCreateTextNode: true,
      textNodeName: 'text',
      attributeNamePrefix: '',
      isArray: (_name, jpath) => ZaakDmsClientImpl.alwaysArray.indexOf(jpath) !== -1,
    });
  }


  private async getApiClient() {
    if (!this.apiClient) {
      this.apiClient = await this.initializeApiClient();
    }
    return this.apiClient;
  }

  async initializeApiClient() {
    if (
      !process.env.ZAAKDMS_CLIENT_MTLS_PRIVATE_KEY_SECRET_ARN ||
      !process.env.ZAAKDMS_CLIENT_MTLS_CERTIFICATE_PARAM_NAME ||
      !process.env.ZAAKDMS_CLIENT_MTLS_ROOT_CA_BUNDLE_PARAM_NAME
    ) {
      throw Error('ZaakDms client could not be initialized');
    }

    // Initialize in parallel
    const [mtlsPrivateKey, mtlsCertificate, mtlsRootCaBundle] = await Promise.all([
      AWS.getSecret(process.env.ZAAKDMS_CLIENT_MTLS_PRIVATE_KEY_SECRET_ARN),
      AWS.getParameter(process.env.ZAAKDMS_CLIENT_MTLS_CERTIFICATE_PARAM_NAME),
      AWS.getParameter(process.env.ZAAKDMS_CLIENT_MTLS_ROOT_CA_BUNDLE_PARAM_NAME),
    ]);

    return new ApiClient(mtlsCertificate, mtlsPrivateKey, mtlsRootCaBundle);
  }

  async geefLijstZaakDocumenten(uuid: UUID): Promise<ZaakDocumenten> {

    // Construct the Zaak DMS request
    let body = geefLijstZaakdocumentenRequest.default;
    body = body.replaceAll('{{zaakid}}', uuid);

    const client = await this.getApiClient();
    client.setTimeout(4000); // 4 sec
    const response = await client.postData(this.baseUrl, body, {
      'Content-Type': 'text/xml',
      'SoapAction': 'http://www.egem.nl/StUF/sector/zkn/0310/geefLijstZaakdocumenten_Lv01',
    });

    return this.parseZaakDocumenten(response);
  }

  async geefZaakDocument(zaakDmsDocumentUuid: UUID): Promise<ZaakDocument> {

    // Construct the Zaak DMS request
    let body = geefZaakDocumenRequest.default;
    body = body.replaceAll('{{documentid}}', zaakDmsDocumentUuid);

    const client = await this.getApiClient();
    client.setTimeout(4000); // 4 sec

    const response = await client.postData(this.baseUrl, body, {
      'Content-Type': 'text/xml',
      'SoapAction': 'http://www.egem.nl/StUF/sector/zkn/0310/geefZaakdocumentLezen_Lv01',
    });

    return this.parseZaakDocument(response);
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