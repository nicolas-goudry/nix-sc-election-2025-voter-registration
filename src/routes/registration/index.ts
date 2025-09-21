import { FastifyPluginAsyncTypebox, Type } from '@fastify/type-provider-typebox'
import { ErrorViewContext, RegisterViewContext } from '../../schemas/view-context'

const plugin: FastifyPluginAsyncTypebox = async function registration (fastify) {
  fastify.get('/', async function (request, reply) {
    const user = request.session.get('user')

    if (!user) {
      request.log.error('No user found in session')

      return reply.unauthorized()
    }

    const eligibility = await fastify.registration.getEligibility(request, reply)
    const isAppInstalled = await fastify.registration.isAppInstalled(request)

    return reply.viewAsync<RegisterViewContext>('register', {
      eligibility,
      isAppInstalled,
      installApp: `${fastify.config.GH_APP_INSTALL}&target_id=${user.id}`,
      electionForkSourceRepo: 'https://github.com/nicolas-goudry/SC-election-2025',
    })
  })

  fastify.post('/', {
    schema: {
      body: Type.Object({
        email: Type.String(),
      }),
    },
  }, async function (request, reply) {
    return 'TODO'
  })

  fastify.setErrorHandler((error, request, reply) => {
    return reply.viewAsync<ErrorViewContext>('error', {
      title: 'Uh oh! Something went wrong.',
      message: error.message,
      actions: [
        {
          url: '/registration',
          text: 'Try to register again',
          icon: {
            name: 'rotate-right',
          },
        },
      ],
    })
  })
}

export default plugin
