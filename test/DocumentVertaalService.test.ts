import { randomUUID } from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import { DocumentVertaalService, GeefLijstZaakDocumentenMapper } from '../src/DocumentVertaalService';

describe('Map ZaakDMS list documents response to UUID array', () => {
  test('Parse geefLijstZaakDocumenten to return UUIDs', async() => {
    const file = fs.readFileSync(path.resolve(__dirname, 'samples/geefLijstZaakdocumenten_Lv01.xml'));
    const mapper = new GeefLijstZaakDocumentenMapper();
    expect(mapper.map(file.toString('utf-8'))).toEqual([
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
    expect(service.listObjectInformatieObjecten(randomUUID())).toHaveLength(6);
  });

  test('Get corsa UUID from zaak', () => {
    const zaakClient = new OpenZaakClient();
    const zaak = zaakClient.getZaak('d9696ca2-0f26-4322-b01d-c26046b71233');
    expect(zaak.corsaUUID).toBeTruthy();
  });
});
