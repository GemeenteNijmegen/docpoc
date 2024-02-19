import { Statics } from "./Statics";

export interface Configurable {
  configuration: Configuration;
}

export interface Environment {
  account: string;
  region: string;
}

export interface Configuration {
  branchName: string;
  codeStarConnectionArn: string;
  deployToEnvironment: Environment
}

const configurations: {[key: string]: Configuration} = {
  sandbox: {
    branchName: 'sandbox',
    codeStarConnectionArn: 'arn:aws:codestar-connections:eu-central-1:049753832279:connection/88cc9d19-3da3-4051-bd44-7c172ce81f6a',
    deployToEnvironment: Statics.sandboxEnvironment,
  },
};

export function getConfiguration(branch: string) {
  const config = configurations[branch];
  if (!config) {
    throw new Error(`No configuration found for branch: ${branch}`);
  }
  return config;
}
