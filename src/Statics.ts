export abstract class Statics {

  static readonly projectName = 'DocPoc';
  static readonly repo = 'GemeenteNijmegen/docpoc';
  static readonly subdomain = 'docpoc';

  // SSM parameters
  static readonly ssmAccountRootHostedZoneId: string = '/gemeente-nijmegen/account/hostedzone/id';
  static readonly ssmAccountRootHostedZoneName: string = '/gemeente-nijmegen/account/hostedzone/name';

  // Environments

  static readonly sandboxEnvironment = {
    account: '049753832279',
    region: 'eu-central-1',
  };

}
