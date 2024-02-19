import { randomUUID } from 'crypto';
import { CorsaClient } from '../CorsaClient';

describe('Corsa Client', () => {
  test('Get zaakdocumenten returns docs', async() => {
    const client = new CorsaClient();
    const zaakDocumenten = client.geefLijstZaakDocumenten(randomUUID());
    expect(zaakDocumenten).toHaveLength(6);
    expect(zaakDocumenten.pop()).toHaveProperty('zkn:gerelateerde.zkn:identificatie');
  });

  test('Get zaakdocument returns doc', async() => {
    const client = new CorsaClient();
    const zaakDocument = client.geefZaakDocument(randomUUID());
    expect(zaakDocument).toHaveProperty('zkn:auteur');
  });
});
