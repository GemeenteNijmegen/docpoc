import { randomUUID } from 'crypto';
import * as zaak from './samples/zaak.json';
import { CorsaClient } from '../src/CorsaClient';
import { DocumentVertaalService, GeefLijstZaakDocumentenMapper } from '../src/DocumentVertaalService';
import { OpenZaakClient } from '../src/OpenZaakClient';

jest.mock('../src/OpenZaakClient', () => {
  return {
    OpenZaakClient: jest.fn(() => {
      return {
        request: async(_url: string) => {
          return zaak;
        },
      };
    }),
  };
});

describe('Map objectInformatieObjecten calls to zaakDMS', () => {
  test('Parse geefLijstZaakDocumenten to return UUIDs', async() => {
    const client = new CorsaClient();
    const docs = client.geefLijstZaakDocumenten(randomUUID());
    const mapper = new GeefLijstZaakDocumentenMapper();
    expect(mapper.map(docs)).toEqual([
      '6ffa451a-a340-403d-9af3-0e547add9c22',
      '11bbe6ff-d946-4ef6-aab4-0775c025b151',
      'ad20701c-cc99-4597-a976-7c707105d9ab',
      '1a654f28-cb6d-45d4-b286-145def61dbe6',
      '0ee0da20-d9d2-4593-97a9-131904c09e9c',
      '9e5a4a61-549b-43a5-a3ba-791064e07012',
    ]);
  });

  test('Return objectinformatieObjecten object', async() => {
    const service = new DocumentVertaalService();
    expect(await service.listObjectInformatieObjecten(randomUUID())).toHaveLength(6);
  });

  test('Get corsa UUID from zaak', async() => {
    const zaakClient = new OpenZaakClient({
      baseUrl: 'https://example.com',
    });
    const sampleZaak = await zaakClient.request('/zaken/api/v1/zaken/d9696ca2-0f26-4322-b01d-c26046b71233');
    const corsaId = sampleZaak.kenmerken.find((kenmerk: any) => kenmerk.bron == 'Corsa_Id').kenmerk;
    expect(corsaId).toBe('eeb22764-e184-487e-a2eb-b6280addd0f8');
  });
});

describe('Map ZaakDMS document response to get enkelvoudigInformatieObject response', () => {
  // test('Calling enkelvoudigInformatieObject method returns enkelvoudig InformatieObject', async() => {
  //   const service = new DocumentVertaalService();
  //   expect(await service.getEnkelVoudigInformatieObject(`https://example.com/api/v1/documenten/enkelvoudiginformatieobject/${randomUUID()}`)).toHaveProperty('url');
  // });

  // test('GeefZaakDetailsMapper can transform between zaakDMS & Document API', async() => {
  //   const file = fs.readFileSync(path.join(__dirname, 'samples/geefZaakDocumentLezen_Lv0.xml'));
  //   expect(await new GeefZaakDocumentMapper().map(file.toString('utf-8'))).toHaveProperty('url');
  // });
});
