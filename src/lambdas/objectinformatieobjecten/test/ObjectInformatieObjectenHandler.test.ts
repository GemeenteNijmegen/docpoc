import { randomUUID } from 'crypto';
import * as zaak from '../../../../test/samples/zaak.json';
import { OpenZaakClient } from '../../../zgw/OpenZaakClient';
import { ObjectInformatieObjectenHandler } from '../ObjectInformatieObjectenHandler';
jest.mock('../../../zgw/OpenZaakClient', () => {

  return {
    OpenZaakClient: jest.fn(() => {
      return {
        initAxios: jest.fn(),
        request: jest.fn(() => zaak),
      };
    }),
  };


},

);

describe('Lijst zaken documenthandler', () => {
  test('Handling request returns objectinformatieobjectenresponse', async() => {
    const client = new OpenZaakClient({ baseUrl: 'https://example.com' });
    const requestHandler = new ObjectInformatieObjectenHandler(client);
    expect(await requestHandler.handleRequest(randomUUID())).toHaveLength(6);
  });
});
