import { APIGatewayProxyEvent } from "aws-lambda";

export async function handler(event: APIGatewayProxyEvent){
  console.debug('Event', event);
  // TODO call vertaal service
}