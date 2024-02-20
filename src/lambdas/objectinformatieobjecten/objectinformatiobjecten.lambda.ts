import { UUID } from 'crypto';
import { AWS } from '@gemeentenijmegen/utils';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { ObjectInformatieObjectenHandler } from './ObjectInformatieObjectenHandler';
import { OpenZaakClient } from '../../zgw/OpenZaakClient';

let openZaakClient: OpenZaakClient | false;

async function initSecret() {
  if (!process.env.OPENZAAK_JWT_SECRET_ARN) {
    throw Error('No secret ARN provided');
  }
  return {
    openZaakSecret: await AWS.getSecret(process.env.OPENZAAK_JWT_SECRET_ARN),
  };
}

const initPromise = initSecret();

function parseParameters(event: APIGatewayProxyEvent) {
  if (!event.pathParameters?.uuid) {
    throw Error('Required path parameter uuid not present');
  }
  return {
    uuid: event.pathParameters.uuid as UUID,
  };
}

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const secrets = await initPromise;
  const zakenClient = sharedOpenZaakClient(secrets.openZaakSecret);
  console.debug('Event', event);
  if (!process.env.OPENZAAK_BASE_URL) {
    throw Error('No openzaak BASEURL set in process.env');
  }
  // TODO call vertaal service
  const params = parseParameters(event);
  const requestHandler = new ObjectInformatieObjectenHandler(zakenClient);
  return {
    body: JSON.stringify(await requestHandler.handleRequest(params.uuid)),
    statusCode: 200,
  };
}

function sharedOpenZaakClient(secret: string): OpenZaakClient {
  if (!openZaakClient) {
    if (!process.env.OPENZAAK_BASE_URL) {
      throw Error('no base url set');
    }
    openZaakClient = new OpenZaakClient({
      baseUrl: new URL(process.env.OPENZAAK_BASE_URL),
      clientId: process.env.OPENZAAK_JWT_CLIENT_ID,
      userId: process.env.OPENZAAK_JWT_USER_ID,
      secret,
    });
  }
  return openZaakClient;
}
