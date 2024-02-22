import { GemeenteNijmegenCdkApp } from '@gemeentenijmegen/projen-project-type';
import { Transform } from 'projen/lib/javascript';
const project = new GemeenteNijmegenCdkApp({
  cdkVersion: '2.1.0',
  defaultReleaseBranch: 'main',
  devDeps: [
    '@gemeentenijmegen/projen-project-type',
    '@types/jsonwebtoken',
    '@types/aws-lambda',
  ],
  name: 'docpoc',
  projenrcTs: true,
  deps: [
    '@gemeentenijmegen/aws-constructs',
    '@gemeentenijmegen/apiclient',
    '@gemeentenijmegen/utils',
    '@glen/jest-raw-loader',
    'zod',
    'fast-xml-parser',
    'jsonwebtoken',
    'axios',
    'dotenv',
  ],
  jestOptions: {
    jestConfig: {
      setupFiles: ['dotenv/config'],
      moduleFileExtensions: [
        'js', 'json', 'jsx', 'ts', 'tsx', 'node', 'mustache',
      ],
      transform: {
        '\\.[jt]sx?$': new Transform('ts-jest'),
        '^.+\\.xml$': new Transform('@glen/jest-raw-loader'),
      },
      testPathIgnorePatterns: ['/node_modules/', '/cdk.out'],
      roots: ['src', 'test'],
    },
  },
  tsconfig: {
    compilerOptions: {
      lib: ['es2021'],
    },
  },
  bundlerOptions: {
    loaders: {
      xml: 'text',
    },
  },
});
project.synth();
