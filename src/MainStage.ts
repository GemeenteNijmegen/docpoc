import { StackProps, Stage } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { ApiStack } from './ApiStack';
import { Configurable } from './Configuration';

export interface MainStageProps extends StackProps, Configurable {}

export class MainStage extends Stage {
  constructor(scope: Construct, id: string, props: MainStageProps) {
    super(scope, id, props);

    new ApiStack(this, 'api', {
      configuration: props.configuration,
    });


  }
}