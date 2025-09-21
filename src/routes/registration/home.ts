import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { ErrorViewContext } from '../../schemas/view-context'

const plugin: FastifyPluginAsyncTypebox = async function registration (fastify) {
  fastify.get('/', async function (request, reply) {
    const user = request.session.get('user')

    if (!user) {
      request.log.error('No user found in session')

      return reply.unauthorized()
    }

    const eligibility = await fastify.registrationManager.getEligibility(request, reply)
    const isAppInstalled = await fastify.registrationManager.isAppInstalled(request)

    return reply.viewAsync('register', {
      eligibility,
      isAppInstalled,
      installApp: `${fastify.config.GH_APP_INSTALL}&target_id=${user.id}`,
      electionForkSourceRepo: 'https://github.com/nicolas-goudry/SC-election-2025',
    })
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
