import { randomUUID } from 'crypto';
import { DocumentVertaalService } from '../src/DocumentVertaalService';
describe('Listing documents', () => {
  test('Calling the objectinformatieobjecten endpoint using a Corsa UUID returns a list of objectinformatieobjecten', async() => {
    expect(new DocumentVertaalService().listObjectInformatieObjecten(randomUUID())).not.toThrow();
  });
});
