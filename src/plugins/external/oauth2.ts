import { FastifyInstance } from 'fastify'
import fastifyOAuth2, { FastifyOAuth2Options, OAuth2Namespace } from '@fastify/oauth2'

declare module 'fastify' {
  interface FastifyInstance {
    githubOAuth2: OAuth2Namespace;
  }
}

declare module '@fastify/oauth2' {
  interface Token {
    refresh_token_expires_in: number;
  }
}

export const autoConfig = (fastify: FastifyInstance): FastifyOAuth2Options => ({
  name: 'githubOAuth2',
  scope: [],
  callbackUri: fastify.config.GH_OAUTH_CALLBACK,
  credentials: {
    auth: fastifyOAuth2.GITHUB_CONFIGURATION,
    client: {
      id: fastify.config.GH_CLIENT_ID,
      secret: fastify.config.GH_CLIENT_SECRET,
    },
  },
})

/**
 * This plugins adds OAuth2 login capabilities
 *
 * @see {@link https://github.com/fastify/fastify-oauth2}
 */
export default fastifyOAuth2
