import { Stack, StackProps } from 'aws-cdk-lib';
import { ApiKey, LambdaIntegration, Resource, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';
import { Configurable } from './Configuration';
import { EnkelvoudiginformatieobjectenFunction } from './lambdas/enkelvoudiginformatieobjecten/enkelvoudiginformatieobjecten-function';

export interface ApiStackProps extends StackProps, Configurable {}

export class ApiStack extends Stack {

  private api: RestApi;

  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);

    this.api = new RestApi(this, 'gateway', {
      description: 'DocPoc API Gateway (zgw to Zaak DMS translation service)',
    });

    const api = this.api.root.addResource('api');
    const v1 = api.addResource('v1');
    this.setupEnkelvoudiginformatieobjecten(v1);

    this.setupApiKey();

  }


  setupEnkelvoudiginformatieobjecten(apiResource: Resource) {

    const enkelvoudiginformatieobjecten = apiResource.addResource('enkelvoudiginformatieobjecten');

    const lambda = new EnkelvoudiginformatieobjectenFunction(this, 'enkelvoudiginformatieobjecten', {
      description: 'ZGW enkelvoudiginformatieobjecten endpoint implementation',
    });

    enkelvoudiginformatieobjecten.addMethod('GET', new LambdaIntegration(lambda), {
      apiKeyRequired: true,
    });

  }

  setupApiKey() {
    const plan = this.api.addUsagePlan('default-usage-plan', {
      description: 'Default usage plan with API key',
    });
    const apiKey = new ApiKey(this, 'api-key');
    plan.addApiKey(apiKey);
    plan.node.addDependency(apiKey);
  }


}