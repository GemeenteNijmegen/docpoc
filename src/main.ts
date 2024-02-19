import { App } from 'aws-cdk-lib';
import { PipelineStack } from './PipelineStack';
import { getConfiguration } from './Configuration';


const branchToBuild = getBranchToBuild();
const configuration = getConfiguration(branchToBuild);

const app = new App();

new PipelineStack(app, `docpoc-pipelineæ-${configuration.branchName}`, {
  configuration: configuration,
});

app.synth();

/**
 * Find the branch name of the branch to build
 * @returns 
 */
function getBranchToBuild(){
  if(process.env.BRANCH_NAME){
    return process.env.BRANCH_NAME
  }
  return 'sandbox';
}