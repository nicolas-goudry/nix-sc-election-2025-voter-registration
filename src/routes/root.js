export default async function root(fastify) {
  fastify.addHook("preHandler", fastify.validateSession)

  fastify.get("/", async function (request, reply) {
    return reply.viewAsync("home", {
      user: request.session.get("user"),
      electionsEmail: "mailto:elections@nixos.org",
      periods: {
        registration: "September 14 - October 14, 2025",
        voting: "October 15 - November 1, 2025",
      },
      eligibilityRules: {
        commits: "25+",
        merges: "1+",
        period: "August 1, 2021 and August 1, 2025",
      },
    })
  })

  fastify.get("/healthz", async function () {
    return { status: "healthy" }
  })
}
