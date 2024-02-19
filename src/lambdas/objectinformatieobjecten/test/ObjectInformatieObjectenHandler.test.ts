import { randomUUID } from 'crypto';
import * as zaak from '../../../../test/samples/zaak.json';
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
    const requestHandler = new ObjectInformatieObjectenHandler('https://example.com/api/v1/zaken');
    expect(await requestHandler.handleRequest(randomUUID())).toHaveLength(6);
  });
});
