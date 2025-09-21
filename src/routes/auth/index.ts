import { FastifyPluginAsyncTypebox, Type } from '@fastify/type-provider-typebox'

const plugin: FastifyPluginAsyncTypebox = async function auth (fastify) {
  fastify.get('/', async function (request, reply) {
    if (request.session.get('token')) {
      return reply.redirect('/registration')
    }

    return fastify.githubOAuth2.generateAuthorizationUri(request, reply, (error, authorizationEndpoint) => {
      if (error) {
        return reply.internalServerError()
      }

      return reply.redirect(authorizationEndpoint)
    })
  })

  fastify.get('/callback', {
    schema: {
      querystring: Type.Object({
        setup_action: Type.Optional(Type.String()),
      }),
    },
  }, async function (request, reply) {
    if (!request.query.setup_action || request.query.setup_action !== 'install') {
      try {
        const { token } = await fastify.githubOAuth2.getAccessTokenFromAuthorizationCodeFlow(request)

        request.session.set('token', token)
      } catch (error) {
        request.log.error(error, 'Failed getting access token from auth code flow')

        return reply.internalServerError()
      }
    }

    const user = await fastify.sessionManager.getUser(request)

    if (!user) {
      return reply.unauthorized()
    }

    request.session.set('user', user)

    if (!(await fastify.registration.isAppInstalled(request))) {
      return reply.redirect(`${fastify.config.GH_APP_INSTALL}&target_id=${user.id}`)
    }

    return reply.redirect('/registration')
  })

  fastify.get('/signout', async function (request, reply) {
    request.session.delete()

    return reply.redirect('/')
  })
}

export default plugin
