import fp from "fastify-plugin"

/**
 * This plugins handles oauth2 related stuff
 */
export default fp(
  async (fastify) => {
    fastify.decorate("validateSession", async function (request, reply) {
      const token = request.session.get("token")

      // There's no token, do nothing
      if (!token) {
        return false
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

          return false
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

        return false
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

      reply.locals = {
        user: request.session.get("user") || (await fastify.getUser(request)),
      }

      return true
    })

    fastify.decorate("getUser", async (request, accessToken) => {
      const token = request.session.get("token")

      if (!token) {
        request.log.error("Session token is empty, abort requesting user details")

        throw new Error("No session available to retrieve user data from")
      }

      try {
        request.log.info("Get user details from GitHub API")

        const response = await fastify.axios.github.get("/user", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })

        request.log.debug(`Got HTTP ${response.status} response from GitHub API`)
        request.log.debug(response.data, "Response JSON data")

        return {
          id: response.data.id,
          name: response.data.login,
          email: response.data.email,
        }
      } catch (error) {
        request.log.error(error, "Failed to get user details")

        throw error
      }
    })
  },
  {
    name: "auth",
    dependencies: ["fastify-axios", "session", "@fastify/oauth2"],
  },
)
