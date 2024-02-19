import { PermissionsBoundaryAspect } from '@gemeentenijmegen/aws-constructs';
import { Aspects, StackProps, Stage } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { ApiStack } from './ApiStack';
import { Configurable } from './Configuration';
import { ParameterStack } from './ParameterStack';

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
