import { GemeenteNijmegenCdkApp } from '@gemeentenijmegen/projen-project-type';
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
    'zod',
    'fast-xml-parser',
    'jsonwebtoken',
    'axios',
  ], /* Runtime dependencies of this module. */
  // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
  // packageName: undefined,  /* The "name" in package.json. */
});
project.synth();
