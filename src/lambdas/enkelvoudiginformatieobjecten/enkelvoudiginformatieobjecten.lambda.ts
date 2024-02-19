import { APIGatewayProxyEvent } from 'aws-lambda';
import * as geefLijstZaakdocumenten from '../../../test/samples/geefLijstZaakdocumenten_Lv01.xml';
import * as geefZaakDocument from '../../../test/samples/geefZaakdocumentLezen_Lv0.xml';

export async function handler(event: APIGatewayProxyEvent) {
  console.debug('Event', event);

  // Test file loading
  console.log(geefLijstZaakdocumenten.default);
  console.log(geefZaakDocument.default);


  // TODO call vertaal service
}
