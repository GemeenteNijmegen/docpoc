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
  static readonly secretMTLSPrivateKey: string = `/${this.projectName}/mtls-privatekey`;

  /**
    * Certificate for mTLS
    */
  static readonly ssmMTLSClientCert: string = `/${this.projectName}/mtls-clientcert`;

  /**
   * Root CA for mTLS (PKIO root)
   */
  static readonly ssmMTLSRootCA: string = `/${this.projectName}/mtls-rootca`;

  /**
   * jwt secret for Open zaak
   */
  static readonly openzaakJwtSecret: string = `/${this.projectName}/openzaak-jwtsecret`;

  /**
   * UserID for JWT Open zaak
   */
  static readonly ssmUserId: string = `/${this.projectName}/openzaak-jwt-userid`;

  /**
   * ClientId for JWT Open zaak
   */
  static readonly ssmClientId: string = `/${this.projectName}/openzaak-jwt-clientid`;

  /**
   * baseurl for open zaak
   */
  static readonly ssmBaseUrl: string = `/${this.projectName}/openzaak-baseurl`;
}
