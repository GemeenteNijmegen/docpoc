import { randomUUID } from 'crypto';
import * as fs from 'fs';
import { describeIntegration } from './utils';
import { CorsaClientImpl } from '../CorsaClient';


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
  process.env.CORSA_CLIENT_MTLS_PRIVATE_KEY_SECRET_ARN = '/cdk/privatekey';
  process.env.CORSA_CLIENT_MTLS_CERTIFICATE_PARAM_NAME = '/cdk/certificate';
  process.env.CORSA_CLIENT_MTLS_ROOT_CA_BUNDLE_PARAM_NAME = '/cdk/bundle';
});

describeIntegration('Corsa Client', () => {

  test('Initalization', async () => {
    const client = new CorsaClientImpl();
    const api = await client.initializeApiClient();
    expect(api).toBeDefined();
  });

  test('Geef lijst zaakdocumenten', async () => {
    const client = new CorsaClientImpl();
    expect(client.initializeApiClient()).toBeDefined();
    const response = await client.geefLijstZaakDocumenten('5937ac5a-da23-425a-9af8-215ec2c30947');
    console.log(response);
    console.log(JSON.stringify(response, null, 4));
  });

  // TODO mock axios client and run this test
  // test('Get zaakdocumenten returns docs', async() => {
  //   const client = new CorsaClient();
  //   const zaakDocumenten = await client.geefLijstZaakDocumenten(randomUUID());
  //   expect(zaakDocumenten).toHaveLength(6);
  //   expect(zaakDocumenten.pop()).toHaveProperty('zkn:gerelateerde.zkn:identificatie');
  // });

  test('Get zaakdocument returns doc', async() => {
    const client = new CorsaClientImpl();
    const zaakDocument = client.geefZaakDocument(randomUUID());
    expect(zaakDocument).toHaveProperty('zkn:auteur');
  });
});
