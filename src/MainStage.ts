import { Aspects, Stack, StackProps, Stage } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { ApiStack } from './ApiStack';
import { Configurable } from './Configuration';
import { PermissionsBoundaryAspect } from '@gemeentenijmegen/aws-constructs';

export interface MainStageProps extends StackProps, Configurable {}

export class MainStage extends Stage {
  constructor(scope: Construct, id: string, props: MainStageProps) {
    super(scope, id, props);

    Aspects.of(this).add(new PermissionsBoundaryAspect());


    new ApiStack(this, 'api', {
      configuration: props.configuration,
    });


  }
}

class ParameterStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);
    
  }
}