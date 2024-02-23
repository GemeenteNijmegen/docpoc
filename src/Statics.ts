export abstract class Statics {

  static readonly projectName = 'DocPoc';
  static readonly repo = 'GemeenteNijmegen/docpoc';
  static readonly subdomain = 'docpoc';

  // SSM parameters
  static readonly ssmAccountRootHostedZoneId = '/gemeente-nijmegen/account/hostedzone/id';
  static readonly ssmAccountRootHostedZoneName = '/gemeente-nijmegen/account/hostedzone/name';

  // Environments

  static readonly sandboxEnvironment = {
    account: '049753832279',
    region: 'eu-central-1',
  };

  /**
   * Certificate private key for mTLS
   */
  static readonly secretMTLSPrivateKey = `/${this.projectName}/mtls-privatekey`;

  /**
    * Certificate for mTLS
    */
  static readonly ssmMTLSClientCert = `/${this.projectName}/mtls-clientcert`;

  /**
   * Root CA for mTLS (PKIO root)
   */
  static readonly ssmMTLSRootCA = `/${this.projectName}/mtls-rootca`;

  /**
   * jwt secret for Open zaak
   */
  static readonly openzaakJwtSecret = `/${this.projectName}/openzaak-jwtsecret`;

  /**
   * UserID for JWT Open zaak
   */
  static readonly ssmUserId = `/${this.projectName}/openzaak-jwt-userid`;

  /**
   * ClientId for JWT Open zaak
   */
  static readonly ssmClientId = `/${this.projectName}/openzaak-jwt-clientid`;

  /**
   * baseurl for open zaak
   */
  static readonly ssmBaseUrl = `/${this.projectName}/openzaak-baseurl`;

  /**
   * baseurl for zaakDms
   */
  static readonly ssmZaakDmsBaseUrl = `/${this.projectName}/zaakDms-baseurl`;

  /**
   * Baseurl for this application
   */
  static readonly ssmApplicationBaseUrl = `/${this.projectName}/application-baseurl`;
}
