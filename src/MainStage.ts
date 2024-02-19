import { PermissionsBoundaryAspect } from '@gemeentenijmegen/aws-constructs';
import { Aspects, Stack, StackProps, Stage } from 'aws-cdk-lib';
import { Secret } from 'aws-cdk-lib/aws-secretsmanager';
import { StringParameter } from 'aws-cdk-lib/aws-ssm';
import { Construct } from 'constructs';
import { ApiStack } from './ApiStack';
import { Configurable } from './Configuration';
import { Statics } from './Statics';

export interface MainStageProps extends StackProps, Configurable {}

export class MainStage extends Stage {
  constructor(scope: Construct, id: string, props: MainStageProps) {
    super(scope, id, props);

    Aspects.of(this).add(new PermissionsBoundaryAspect());

    const paramStack = new ParameterStack(this, 'params');

    const apiStack = new ApiStack(this, 'api', {
      configuration: props.configuration,
    });

    apiStack.addDependency(paramStack);

  }
}

class ParameterStack extends Stack {
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

    new Secret(this, 'secret_2', {
      secretName: Statics.secretMTLSPrivateKey,
      description: 'mTLS certificate private key',
    });
  }
}