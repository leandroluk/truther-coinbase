import {swaggerGenerator} from '#/generators';

/**
 * Public user profile structure contained in "id_token" in JWT format
 */
export type TOpenidInfo = {
  /**
   * End-User's preferred email address. Its value MUST conform to the RFC 5322 [RFC5322] addr-spec syntax.
   */
  email: string;
  /**
   * Surname(s) or last name(s) of the End-User.
   */
  family_name?: string;
  /**
   * Given name(s) or first name(s) of the End-User.
   */
  given_name?: string;
  /**
   * URL of the End-User's profile picture. This URL MUST refer to an image file (for example, a PNG, JPEG, or GIF
   * image file), rather than to a Web page containing an image.
   */
  picture?: string;
  /**
   * Subject - Identifier for the End-User at the Issuer.
   */
  sub: string;
  /**
   * Preferred theme of user (saved in application context)
   */
  theme?: string;
  /**
   * String from IANA Time Zone Database representing the End-User's time zone.
   */
  timezone?: string;
};
export const TOpenidInfo = {
  swagger: swaggerGenerator.object<TOpenidInfo>({
    required: ['email', 'sub'],
    properties: {
      email: swaggerGenerator.email({description: "End-User's preferred email address"}),
      family_name: swaggerGenerator.string({description: 'Surname(s) or last name(s) of the End-User.'}),
      given_name: swaggerGenerator.string({description: 'Given name(s) or first name(s) of the End-User.'}),
      picture: swaggerGenerator.url({description: "URL of the End-User's profile picture"}),
      sub: swaggerGenerator.string({description: 'Subject - Identifier for the End-User at the Issuer.'}),
      theme: swaggerGenerator.string({description: 'Preferred user profile theme'}),
      timezone: swaggerGenerator.string({description: 'String from IANA Time Zone Database'}),
    },
  }),
};
