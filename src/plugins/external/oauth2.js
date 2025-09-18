import fp from "fastify-plugin"
import fastifyOAuth2 from "@fastify/oauth2"

/**
 * This plugins adds OAuth2 login capabilities
 *
 * @see {@link https://github.com/fastify/fastify-oauth2}
 */
export default fp(
  async (fastify) => {
    fastify.register(fastifyOAuth2, {
      name: "githubOAuth2",
      scope: [],
      startRedirectPath: "/auth",
      callbackUri: fastify.config.GH_OAUTH_CALLBACK,
      credentials: {
        auth: fastifyOAuth2.GITHUB_CONFIGURATION,
        client: {
          id: fastify.config.GH_CLIENT_ID,
          secret: fastify.config.GH_CLIENT_SECRET,
        },
      },
    })
  },
  {
    name: "oauth2",
    dependencies: ["@fastify/env", "session"],
  },
)
