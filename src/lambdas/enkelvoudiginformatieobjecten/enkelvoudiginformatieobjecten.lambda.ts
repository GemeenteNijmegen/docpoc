import { UUID } from 'crypto';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { EnkelvoudigInformatieObjectenHandler } from './enkelvoudigInformatieObjectenHandler';
import { CorsaClient, CorsaClientImpl } from '../../zgw/CorsaClient';

let corsaClient: CorsaClient | false;

function parseParameters(event: APIGatewayProxyEvent) {
  if (!event.pathParameters?.uuid) {
    throw Error('Required path parameter uuid not present');
  }
  return {
    uuid: event.pathParameters.uuid as UUID,
    download: event.path.includes('download'),
  };
}

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const client = sharedCorsaClient();
  console.debug('Event', event);
  if (!process.env.OPENZAAK_BASE_URL) {
    throw Error('No openzaak BASEURL set in process.env');
  }
  // TODO call vertaal service
  const params = parseParameters(event);
  const requestHandler = new EnkelvoudigInformatieObjectenHandler(client);
  if (params.download) {
    const fileBuffer = await requestHandler.handleDownloadRequest(params.uuid) as Buffer;
    return {
      body: fileBuffer.toString('base64'),
      statusCode: 200,
      isBase64Encoded: true,
    };
  } else {
    return {
      body: JSON.stringify(await requestHandler.handleRequest(params.uuid)),
      statusCode: 200,
    };

  }
}

function sharedCorsaClient(): CorsaClient {
  if (!corsaClient) {
    if (!process.env.CORSA_CLIENT_BASE_URL) {
      throw Error('no base url set');
    }
    corsaClient = new CorsaClientImpl(process.env.CORSA_CLIENT_BASE_URL);
  }
  return corsaClient;
}
