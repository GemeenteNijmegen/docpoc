import { Stack, StackProps } from 'aws-cdk-lib';
import { ApiKey, LambdaIntegration, Resource, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { Certificate, CertificateValidation } from 'aws-cdk-lib/aws-certificatemanager';
import { ARecord, HostedZone, NsRecord, RecordTarget } from 'aws-cdk-lib/aws-route53';
import { ApiGatewayDomain } from 'aws-cdk-lib/aws-route53-targets';
import { Secret } from 'aws-cdk-lib/aws-secretsmanager';
import { StringParameter } from 'aws-cdk-lib/aws-ssm';
import { Construct } from 'constructs';
import { Configurable } from './Configuration';
import { ObjectinformatiobjectenFunction } from './lambdas/objectinformatieobjecten/objectinformatiobjecten-function';
import { Statics } from './Statics';

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

    // Add subdomain
    const subdomain = this.subdomain();
    this.api.addDomainName('subdomain', {
      domainName: `api.${subdomain.zoneName}`,
      certificate: this.certificate(subdomain),
    });
    this.setupDnsRecords(subdomain);

  }

  setupDnsRecords(subdomain: HostedZone) {
    if (!this.api.domainName) {
      throw Error('Expected domain name to be set for API gateway');
    }
    new ARecord(this, 'a-record', {
      target: RecordTarget.fromAlias(new ApiGatewayDomain(this.api.domainName)),
      zone: subdomain,
      recordName: `api.${subdomain.zoneName}`,
    });
  }


  certificate(subdomain: HostedZone) {
    return new Certificate(this, 'cert', {
      domainName: `api.${subdomain.zoneName}`,
      validation: CertificateValidation.fromDns(subdomain),
    });
  }

  subdomain() {
    const rootZoneId = StringParameter.valueForStringParameter(this, Statics.ssmAccountRootHostedZoneId);
    const rootZoneName = StringParameter.valueForStringParameter(this, Statics.ssmAccountRootHostedZoneName);
    const accountRootZone = HostedZone.fromHostedZoneAttributes(this, 'cspzone', {
      hostedZoneId: rootZoneId,
      zoneName: rootZoneName,
    });
    const zone = new HostedZone(this, 'hostedzone', {
      zoneName: `${Statics.subdomain}.${accountRootZone.zoneName}`,
    });

    // Register current hosted zone in account
    if (!zone.hostedZoneNameServers) {
      throw Error('Expected nameservers to be set');
    }
    new NsRecord(this, 'ns-record', {
      zone: accountRootZone,
      recordName: zone.zoneName,
      values: zone.hostedZoneNameServers,
    });

    return zone;
  }


  setupEnkelvoudiginformatieobjecten(apiResource: Resource) {

    const enkelvoudiginformatieobjecten = apiResource.addResource('enkelvoudiginformatieobjecten');
    const jwtSecret = Secret.fromSecretNameV2(this, 'jwt-token-secret', Statics.openzaakJwtSecret);
    const secretMTLSPrivateKey = Secret.fromSecretNameV2(this, 'tls-key-secret', Statics.secretMTLSPrivateKey);

    const lambda = new ObjectinformatiobjectenFunction(this, 'enkelvoudiginformatieobjecten', {
      description: 'ZGW enkelvoudiginformatieobjecten endpoint implementation',
      environment: {
        OPENZAAK_JWT_SECRET_ARN: jwtSecret.secretArn,
        OPENZAAK_JWT_USER_ID: StringParameter.valueForStringParameter(this, Statics.ssmUserId),
        OPENZAAK_JWT_CLIENT_ID: StringParameter.valueForStringParameter(this, Statics.ssmClientId),
        OPENZAAK_BASE_URL: StringParameter.valueForStringParameter(this, Statics.ssmBaseUrl),
        MTLS_CLIENT_CERT_NAME: StringParameter.valueForStringParameter(this, Statics.ssmMTLSClientCert),
        MTLS_ROOT_CA_NAME: StringParameter.valueForStringParameter(this, Statics.ssmMTLSRootCA),
        MTLS_PRIVATE_KEY_ARN: secretMTLSPrivateKey.secretArn,
      },
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
    plan.addApiStage({
      stage: this.api.deploymentStage,
    });
  }


}
