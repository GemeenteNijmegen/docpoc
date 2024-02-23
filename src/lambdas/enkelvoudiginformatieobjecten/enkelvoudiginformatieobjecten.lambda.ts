import { UUID } from 'crypto';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { EnkelvoudigInformatieObjectenHandler } from './enkelvoudigInformatieObjectenHandler';
import { ZaakDmsClient, ZaakDmsClientImpl } from '../../zgw/ZaakDmsClient';

let zaakDmsClient: ZaakDmsClient | false;

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
  const client = sharedZaakDmsClient();
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

function sharedZaakDmsClient(): ZaakDmsClient {
  if (!zaakDmsClient) {
    if (!process.env.ZAAKDMS_CLIENT_BASE_URL) {
      throw Error('no base url set');
    }
    zaakDmsClient = new ZaakDmsClientImpl(process.env.ZAAKDMS_CLIENT_BASE_URL);
  }
  return zaakDmsClient;
}
