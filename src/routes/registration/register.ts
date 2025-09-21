import { FastifyPluginAsyncTypebox, Type } from '@fastify/type-provider-typebox'

const plugin: FastifyPluginAsyncTypebox = async function registration (fastify) {
  fastify.post('/', {
    schema: {
      body: Type.Object({
        email: Type.String(),
      }),
    },
  }, async function (request, reply) {
    if (!request.body?.email) {
      return reply.badRequest('Email is required')
    }

    return 'TODO'
  })
}

export default plugin
