import { FastifyInstance } from 'fastify'

export default async function (fastify: FastifyInstance) {
  fastify.addHook('onRequest', async (request, reply) => {
    // Do not perform session validation on '/auth' prefixed routes (beside from the root '/auth' route)
    if (/^\/auth\/.+$/.test(request.url)) {
      return
    }

    // Validate and refresh session if required, serving error template in case it fails
    // If requested URL is '/' (home) or '/auth' (authentication initiation), don't do anything since it doesn't matter
    // if user is signed in or not.
    // However, we do care about having the session validated and refreshed on those routes too.
    if (!(await fastify.sessionManager.autoSession(request, reply)) && !['/', '/auth'].includes(request.url)) {
      return reply.unauthorized('You must be authenticated to access this page.')
    }
  })
}
