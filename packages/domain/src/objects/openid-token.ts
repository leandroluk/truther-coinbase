import {swaggerGenerator} from '#/generators';

/**
 * Successful Token Response
 * @see https://openid.net/specs/openid-connect-core-1_0.html#TokenResponse
 */
export type TOpenidToken = {
  /**
   * Access Token enabling retrieval using the OAuth 2.0 Bearer Token Usage [RFC6750] protocol
   */
  access_token: string;
  /**
   * Expiration time of the Access Token in seconds since the response was generated in seconds.
   */
  expires_in: number;
  /**
   * Id Token contains the public claims related with user in JWT format
   */
  id_token: string;
  /**
   * Refresh Token used to refresh session of authentication, returning a new pair openid token.
   */
  refresh_token: string;
  /**
   * The type of token
   */
  token_type: 'Bearer';
};

export const TOpenidToken = {
  swagger: swaggerGenerator.object<TOpenidToken>({
    required: ['access_token', 'expires_in', 'id_token', 'refresh_token', 'token_type'],
    properties: {
      access_token: swaggerGenerator.string({description: 'Access Token enabling retrieval using the OAuth 2.0'}),
      expires_in: swaggerGenerator.integer({description: 'Expiration time of the Access Token in seconds'}),
      id_token: swaggerGenerator.string({description: 'Id Token contains the public claims'}),
      refresh_token: swaggerGenerator.string({description: 'Refresh Token used to refresh session'}),
      token_type: swaggerGenerator.string({description: 'The type of token'}),
    },
  }),
};
