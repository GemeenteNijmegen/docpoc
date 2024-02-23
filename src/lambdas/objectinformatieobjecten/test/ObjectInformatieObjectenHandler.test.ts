import { randomUUID } from 'crypto';
import * as zaak from '../../../../test/samples/zaak.json';
import * as zaakEigenschapZaakDmsUuid from '../../../../test/samples/zaakEigenschapCorsaUuid.json';
import { OpenZaakClient } from '../../../zgw/OpenZaakClient';
import { ZaakDmsClientMock } from '../../../zgw/test/ZaakDmsClientMock';
import { ObjectInformatieObjectenHandler } from '../ObjectInformatieObjectenHandler';
jest.mock('../../../zgw/OpenZaakClient', () => {

  return {
    OpenZaakClient: jest.fn(() => {
      return {
        initAxios: jest.fn(),
        request: jest.fn((url) => {
          if (url.includes('zaakeigenschappen')) {
            return zaakEigenschapZaakDmsUuid;
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
    const zaakDmsClient = new ZaakDmsClientMock();
    const requestHandler = new ObjectInformatieObjectenHandler(client, zaakDmsClient);
    expect(await requestHandler.handleRequest(randomUUID())).toHaveLength(6);
  });
});
