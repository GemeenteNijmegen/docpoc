import { UUID } from 'crypto';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { ObjectInformatieObjectenHandler } from './ObjectInformatieObjectenHandler';

// TODO use this for mocking coras client
// import * as geefLijstZaakdocumenten from '../../../test/samples/geefLijstZaakdocumenten_Lv01.xml';
// import * as geefZaakDocument from '../../../test/samples/geefZaakdocumentLezen_Lv0.xml';

function parseParameters(event: APIGatewayProxyEvent) {
  if (!event.pathParameters?.uuid) {
    throw Error('Required path parameter uuid not present');
  }
  return {
    uuid: event.pathParameters.uuid as UUID,
  };
}

export async function handler(event: APIGatewayProxyEvent) {
  console.debug('Event', event);
  if (!process.env.OPENZAAK_BASE_URL) {
    throw Error('No openzaak BASEURL set in process.env');
  }
  // TODO call vertaal service
  const params = parseParameters(event);
  const requestHandler = new ObjectInformatieObjectenHandler(process.env.OPENZAAK_BASE_URL);
  await requestHandler.handleRequest(params.uuid);
}
