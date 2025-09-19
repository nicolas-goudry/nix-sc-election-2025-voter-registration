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
}
