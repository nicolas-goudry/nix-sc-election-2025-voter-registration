import fp from "fastify-plugin"

/**
 * This plugins handles oauth2 token expiration and refresh
 */
export default fp(
  async (fastify) => {
    fastify.decorate("validateSession", async function (request) {
      const token = request.session.get("token")

      // There's no token, do nothing
      if (!token) {
        return
      }

      request.log.debug("Check session tokens expiration")

      const now = new Date()
      const tokenExpiry = new Date(token.expires_at)
      const tokenIsExpired = now >= tokenExpiry

      // Token is expired
      if (now >= tokenExpiry) {
        request.log.warn("Session token is expired")

        const tokenIssuedAt = tokenExpiry - token.expires_in
        const refreshTokenExpiry = new Date(tokenIssuedAt + token.refresh_token_expires_in)

        // Refresh token is expired, clear session
        if (now >= refreshTokenExpiry) {
          request.log.warn("Session refresh token is expired")
          request.session.regenerate()

          return
        }
      }

      request.log.info("Session token is not expired")
      request.log.debug("Validate session token")

      try {
        await fastify.axios.github.post(`/applications/${fastify.config.GH_CLIENT_ID}/token`, {
          // eslint-disable-next-line camelcase
          access_token: token.access_token,
        })

        request.log.info("Session token is valid")
      } catch (error) {
        // Token is invalid, clear session
        request.log.error(error, "Session token validation failed or token is invalid")
        request.session.regenerate()

        return
      }

      const tokenSoonToExpire = now - tokenExpiry > token.expires_in * 0.7

      // Token is expired or will soon expire, refresh it
      if (tokenIsExpired || tokenSoonToExpire) {
        request.log.debug("Refresh session token")

        // Refresh token
        const newToken = await this.githubOAuth2.getNewAccessTokenUsingRefreshToken(token, {})

        request.log.info(newToken, "Session token refreshed")
        request.session.set("token", newToken)
      }
    })
  },
  {
    name: "auth",
    dependencies: ["fastify-axios", "session", "@fastify/oauth2"],
  },
)
