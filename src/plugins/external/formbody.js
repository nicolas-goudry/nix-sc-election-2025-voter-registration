import fp from "fastify-plugin"
import formbody from "@fastify/formbody"

/**
 * This plugins adds a parser for application/x-www-form-urlencoded content types
 *
 * @see https://github.com/fastify/fastify-formbody
 */
export default fp(async (fastify) => {
  fastify.register(formbody)
})
