import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import { ApiKey, LambdaIntegration, Resource, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { Certificate, CertificateValidation } from 'aws-cdk-lib/aws-certificatemanager';
import { Function } from 'aws-cdk-lib/aws-lambda';
import { ARecord, HostedZone, NsRecord, RecordTarget } from 'aws-cdk-lib/aws-route53';
import { ApiGateway } from 'aws-cdk-lib/aws-route53-targets';
import { Secret } from 'aws-cdk-lib/aws-secretsmanager';
import { StringParameter } from 'aws-cdk-lib/aws-ssm';
import { Construct } from 'constructs';
import { Configurable } from './Configuration';
import { EnkelvoudiginformatieobjectenFunction } from './lambdas/enkelvoudiginformatieobjecten/enkelvoudiginformatieobjecten-function';
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
    this.objectInformatieObjecten(v1);
    this.enkelvoudiginformatieobjecten(v1);

    this.setupApiKey();

    // Add subdomain
    // const subdomain = this.subdomain();
    // this.api.addDomainName('subdomain', {
    //   certificate: this.certificate(subdomain),
    //   domainName: `api.${subdomain.zoneName}`,
    // });
    // this.setupDnsRecords(subdomain);

  }

  setupDnsRecords(subdomain: HostedZone) {
    new ARecord(this, 'a-record', {
      target: RecordTarget.fromAlias(new ApiGateway(this.api)),
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

  sharedLambdaConfiguration(lambda: Function) {
    const applicationBaseUrl = StringParameter.valueForStringParameter(this, Statics.ssmApplicationBaseUrl);
    lambda.addEnvironment('APPLICATION_BASE_URL', applicationBaseUrl);
  }

  objectInformatieObjecten(apiResource: Resource) {

    const resource = apiResource.addResource('objectinformatieobjecten').addResource('{uuid}');

    const jwtSecret = Secret.fromSecretNameV2(this, 'jwt-token-secret', Statics.openzaakJwtSecret);
    const secretMTLSPrivateKey = Secret.fromSecretNameV2(this, 'tls-key-secret', Statics.secretMTLSPrivateKey);

    const mtlsCertificate = StringParameter.fromStringParameterName(this, 'mtls-cert', Statics.ssmMTLSClientCert);
    const mtlsRootCa = StringParameter.fromStringParameterName(this, 'mtls-root-ca', Statics.ssmMTLSRootCA);
    const mtlsPrivateKey = Secret.fromSecretNameV2(this, 'mtls-private-key', Statics.secretMTLSPrivateKey);

    const lambda = new ObjectinformatiobjectenFunction(this, 'objectinformatieobjecten', {
      description: 'ZGW objectinformatieobjecten endpoint implementation',
      timeout: Duration.seconds(6),
      environment: {
        OPENZAAK_JWT_SECRET_ARN: jwtSecret.secretArn,
        OPENZAAK_JWT_USER_ID: StringParameter.valueForStringParameter(this, Statics.ssmUserId),
        OPENZAAK_JWT_CLIENT_ID: StringParameter.valueForStringParameter(this, Statics.ssmClientId),
        OPENZAAK_BASE_URL: StringParameter.valueForStringParameter(this, Statics.ssmBaseUrl),
        CORSA_CLIENT_BASE_URL: StringParameter.valueForStringParameter(this, Statics.ssmCorsaBaseUrl),
        CORSA_CLIENT_MTLS_CERTIFICATE_PARAM_NAME: Statics.ssmMTLSClientCert,
        CORSA_CLIENT_MTLS_ROOT_CA_BUNDLE_PARAM_NAME: Statics.ssmMTLSRootCA,
        CORSA_CLIENT_MTLS_PRIVATE_KEY_SECRET_ARN: secretMTLSPrivateKey.secretArn,
      },
    });
    secretMTLSPrivateKey.grantRead(lambda);
    jwtSecret.grantRead(lambda);
    mtlsCertificate.grantRead(lambda);
    mtlsRootCa.grantRead(lambda);
    mtlsPrivateKey.grantRead(lambda);

    this.sharedLambdaConfiguration(lambda);

    resource.addMethod('GET', new LambdaIntegration(lambda), {
      apiKeyRequired: true,
    });
  }

  enkelvoudiginformatieobjecten(apiResource: Resource) {
    const resource = apiResource.addResource('enkelvoudiginformatieobjecten').addResource('{uuid}');
    const secretMTLSPrivateKey = Secret.fromSecretNameV2(this, 'tls-key-secret-2', Statics.secretMTLSPrivateKey);
    const mtlsCertificate = StringParameter.fromStringParameterName(this, 'mtls-cert-2', Statics.ssmMTLSClientCert);
    const mtlsRootCa = StringParameter.fromStringParameterName(this, 'mtls-root-ca-2', Statics.ssmMTLSRootCA);
    const mtlsPrivateKey = Secret.fromSecretNameV2(this, 'mtls-private-key-2', Statics.secretMTLSPrivateKey);

    const lambda = new EnkelvoudiginformatieobjectenFunction(this, 'enkelvoudiginformatieobjecten', {
      description: 'ZGW enkelvoudiginformatieobjecten endpoint implementation',
      timeout: Duration.seconds(6),
      environment: {
        CORSA_CLIENT_BASE_URL: StringParameter.valueForStringParameter(this, Statics.ssmCorsaBaseUrl),
        CORSA_CLIENT_MTLS_CERTIFICATE_PARAM_NAME: Statics.ssmMTLSClientCert,
        CORSA_CLIENT_MTLS_ROOT_CA_BUNDLE_PARAM_NAME: Statics.ssmMTLSRootCA,
        CORSA_CLIENT_MTLS_PRIVATE_KEY_SECRET_ARN: secretMTLSPrivateKey.secretArn,
      },
    });
    secretMTLSPrivateKey.grantRead(lambda);
    mtlsCertificate.grantRead(lambda);
    mtlsRootCa.grantRead(lambda);
    mtlsPrivateKey.grantRead(lambda);

    this.sharedLambdaConfiguration(lambda);

    resource.addMethod('GET', new LambdaIntegration(lambda), {
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
