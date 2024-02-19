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

  /**
   * Certificate private key for mTLS
   */
  static readonly secretMTLSPrivateKey: string = `/cdk/${this.projectName}/mtls-privatekey`;

  /**
    * Certificate for mTLS
    */
  static readonly ssmMTLSClientCert: string = `/cdk/${this.projectName}/mtls-clientcert`;

  /**
   * Root CA for mTLS (PKIO root)
   */
  static readonly ssmMTLSRootCA: string = `/cdk/${this.projectName}/mtls-rootca`;

}
