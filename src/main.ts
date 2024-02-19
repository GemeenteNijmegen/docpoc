import { App } from 'aws-cdk-lib';
import { getConfiguration } from './Configuration';
import { PipelineStack } from './PipelineStack';


const branchToBuild = getBranchToBuild();
console.log('Building branch', branchToBuild);
const configuration = getConfiguration(branchToBuild);

const app = new App();

new PipelineStack(app, `docpoc-pipeline-${configuration.branchName}`, {
  env: configuration.buildEnvironment,
  configuration: configuration,
});

app.synth();

/**
 * Find the branch name of the branch to build
 * @returns
 */
function getBranchToBuild() {
  if (process.env.BRANCH_NAME) {
    return process.env.BRANCH_NAME;
  }
  return 'sandbox';
}