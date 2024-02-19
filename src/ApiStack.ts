import { Stack, StackProps } from 'aws-cdk-lib';
import { ApiDefinition, SpecRestApi } from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';
import { Configurable } from './Configuration';

export interface ApiStackProps extends StackProps, Configurable {}

export class ApiStack extends Stack {

  // private api: RestApi;


  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);

    // this.api = new RestApi(this, 'gateway', {
    //   description: 'DocPoc API Gateway (zgw to Zaak DMS translation service)',
    // });

    new SpecRestApi(this, 'openapi-gateway', {
      apiDefinition: ApiDefinition.fromAsset('./src/openapi.yaml'),
      description: 'DocPoc API gateway (zgw to Zaak DMS translation API) from openapi def',
    });


  }


}