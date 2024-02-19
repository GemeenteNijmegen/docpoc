
export interface Configurable {
  configuration: Configuration;
}

export interface Configuration {
  branchName: string;
  codeStarConnectionArn: string;
}

const configurations: {[key: string]: Configuration} = {
  acceptance: {
    branchName: 'acceptance',
    codeStarConnectionArn: '',
  },
};

export function getConfiguration(branch: string) {
  const config = configurations[branch];
  if (!config) {
    throw new Error(`No configuration found for branch: ${branch}`);
  }
  return config;
}
