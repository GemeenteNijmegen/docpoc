import { randomUUID } from 'crypto';
import * as zaak from '../../../../test/samples/zaak.json';
import * as zaakEigenschapCorsaUuid from '../../../../test/samples/zaakEigenschapCorsaUuid.json';
import { OpenZaakClient } from '../../../zgw/OpenZaakClient';
import { CorsaClientMock } from '../../../zgw/test/CorsaClientMock';
import { ObjectInformatieObjectenHandler } from '../ObjectInformatieObjectenHandler';
jest.mock('../../../zgw/OpenZaakClient', () => {

  return {
    OpenZaakClient: jest.fn(() => {
      return {
        initAxios: jest.fn(),
        request: jest.fn((url) => {
          if (url.includes('zaakeigenschappen')) {
            return zaakEigenschapCorsaUuid;
          }
          return zaak;
        }),
      };
    }),
  };


},

);

describe('Lijst zaken documenthandler', () => {
  test('Handling request returns objectinformatieobjectenresponse', async() => {
    const client = new OpenZaakClient({ baseUrl: 'https://example.com' });
    const corsaClient = new CorsaClientMock();
    const requestHandler = new ObjectInformatieObjectenHandler(client, corsaClient);
    expect(await requestHandler.handleRequest(randomUUID())).toHaveLength(6);
  });
});
