export default async function auth(fastify) {
  fastify.get("/callback", async function (request, reply) {
    const { token } = await this.githubOAuth2.getAccessTokenFromAuthorizationCodeFlow(request)

    request.session.set("token", token)
    request.session.set("user", await fastify.getUser(request, token.access_token))

    return reply.redirect("/")
  })

  fastify.get("/signout", async function (request, reply) {
    request.session.delete()

    return reply.redirect("/")
  })

  fastify.decorate("getUser", async (request, accessToken) => {
    if (!accessToken) {
      request.log.error("No access token provided, abort requesting user details")

      throw new Error("Something went wrong while authenticating with GitHub")
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
      }
    } catch (error) {
      request.log.error(error, "Failed to get user details")

      throw error
    }
  })
}
