import { Stack } from 'aws-cdk-lib';
import { Secret } from 'aws-cdk-lib/aws-secretsmanager';
import { StringParameter } from 'aws-cdk-lib/aws-ssm';
import { Construct } from 'constructs';
import { Statics } from './Statics';

export class ParameterStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    new StringParameter(this, 'ssm_uitkering_2', {
      stringValue: '-',
      parameterName: Statics.ssmMTLSClientCert,
    });

    new StringParameter(this, 'ssm_uitkering_3', {
      stringValue: '-',
      parameterName: Statics.ssmMTLSRootCA,
    });

    new Secret(this, 'secret_1', {
      secretName: Statics.openzaakJwtSecret,
      description: 'Openzaak token secret',
    });

    new Secret(this, 'secret_2', {
      secretName: Statics.secretMTLSPrivateKey,
      description: 'mTLS certificate private key',
    });

    new StringParameter(this, 'ssm_zaken_1', {
      stringValue: '-',
      parameterName: Statics.ssmUserId,
    });

    new StringParameter(this, 'ssm_zaken_2', {
      stringValue: '-',
      parameterName: Statics.ssmBaseUrl,
    });

    new StringParameter(this, 'ssm_zaken_3', {
      stringValue: '-',
      parameterName: Statics.ssmClientId,
    });

    new StringParameter(this, 'ssm_zaken_4', {
      stringValue: '-',
      parameterName: Statics.ssmCorsaBaseUrl,
    });

    new StringParameter(this, 'ssm_zaken_5', {
      stringValue: '-',
      parameterName: Statics.ssmApplicationBaseUrl,
    });

  }
}
