export default async function root(fastify) {
  fastify.get("/", () => {
    return "Hello, world!"
  })
}
