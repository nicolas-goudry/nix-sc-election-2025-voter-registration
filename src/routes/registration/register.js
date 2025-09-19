export default async function register(fastify) {
  fastify.post("/", async function (request, reply) {
    if (!request.body?.email) {
      return reply.badRequest("Email is required")
    }

    return "TODO"
  })
}
