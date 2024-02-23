import * as fs from 'fs';
import { describeIntegration } from './utils';
import { ZaakDmsClientImpl } from '../ZaakDmsClient';


jest.mock('@gemeentenijmegen/utils/lib/AWS', () => ({
  AWS: {
    getParameter: jest.fn().mockImplementation((name) => {
      if (name.includes('certificate')) {
        const file = fs.readFileSync(process.env.MTLS_CERT_PATH!).toString('utf-8');
        return file;
      }
      if (name.includes('bundle')) {
        const file = fs.readFileSync(process.env.MTLS_CERT_ROOTCA_PATH!).toString('utf-8');
        return file;
      }
      return name;
    }),
    getSecret: jest.fn().mockImplementation((_arn) => {
      return fs.readFileSync(process.env.MTLS_CERT_PRIVATE_KEY!).toString('utf-8');
    }),
  },
}));
beforeAll(() => {
  process.env.ZAAKDMS_CLIENT_MTLS_PRIVATE_KEY_SECRET_ARN = '/cdk/privatekey';
  process.env.ZAAKDMS_CLIENT_MTLS_CERTIFICATE_PARAM_NAME = '/cdk/certificate';
  process.env.ZAAKDMS_CLIENT_MTLS_ROOT_CA_BUNDLE_PARAM_NAME = '/cdk/bundle';
});

describeIntegration('ZaakDms Client', () => {

  test('Initalization', async () => { // LIVE (initialization)
    const client = new ZaakDmsClientImpl();
    const api = await client.initializeApiClient();
    expect(api).toBeDefined();
  });

  test('Geef lijst zaakdocumenten', async () => { // LIVE
    const client = new ZaakDmsClientImpl();
    expect(client.initializeApiClient()).toBeDefined();
    const response = await client.geefLijstZaakDocumenten('5937ac5a-da23-425a-9af8-215ec2c30947');
    console.log(response);
    console.log(JSON.stringify(response, null, 4));
  });

  // TODO mock axios client and run this test
  // test('Get zaakdocumenten returns docs', async() => {
  //   const client = new ZaakDmsClient();
  //   const zaakDocumenten = await client.geefLijstZaakDocumenten(randomUUID());
  //   expect(zaakDocumenten).toHaveLength(6);
  //   expect(zaakDocumenten.pop()).toHaveProperty('zkn:gerelateerde.zkn:identificatie');
  // });

  // TODO fix this test using the mock
  // test('Get zaakdocument returns doc', async() => {
  //   const client = new ZaakDmsClientMock();
  //   const zaakDocument = client.geefZaakDocument(randomUUID());
  //   expect(zaakDocument).toHaveProperty('zkn:auteur');
  // });
});
