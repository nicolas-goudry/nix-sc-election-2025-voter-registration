import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import fp from 'fastify-plugin'
import { Auth } from '../../schemas/auth'

declare module 'fastify' {
  interface FastifyInstance {
    sessionManager: ReturnType<typeof createSessionManager>;
  }
}

function createSessionManager (fastify: FastifyInstance) {
  function checkSessionExpiry (request: FastifyRequest) {
    request.log.debug('Check session expiration')

    const token = request.session.get('token')
    const tokenExpiry = {
      isExpired: true,
      canRefresh: false,
      expiresIn: {
        token: -1,
        refresh: -1,
      },
    }

    if (!token) {
      request.log.warn('No token found in session')

      return tokenExpiry
    }

    const now = Number(new Date())
    const tokenExpiryDate = Number(new Date(token.expires_at))
    const tokenIsExpired = now >= tokenExpiryDate
    const tokenIssuedAt = tokenExpiryDate - token.expires_in
    const refreshTokenExpiryDate = Number(new Date(tokenIssuedAt + token.refresh_token_expires_in))
    const refreshTokenIsExpired = now >= refreshTokenExpiryDate

    tokenExpiry.isExpired = tokenIsExpired
    tokenExpiry.canRefresh = !refreshTokenIsExpired

    if (!tokenIsExpired) {
      tokenExpiry.expiresIn.token = tokenExpiryDate - now
    }

    if (!refreshTokenIsExpired) {
      tokenExpiry.expiresIn.refresh = refreshTokenExpiryDate - now
    }

    request.log.debug(tokenExpiry, 'Session expiration state')

    return tokenExpiry
  }

  async function validateSession (request: FastifyRequest) {
    request.log.debug('Validate session')

    const token = request.session.get('token')

    if (!token) {
      return false
    }

    try {
      const { data } = await fastify.axios.github.post(`/applications/${fastify.config.GH_CLIENT_ID}/token`, {
        access_token: token.access_token,
      })

      request.log.debug(data, 'Token validation')
    } catch (error) {
      request.log.error(error, 'Failed to validate session token')

      return false
    }

    return true
  }

  async function refreshSession (request: FastifyRequest) {
    request.log.debug('Refresh session')

    const token = request.session.get('token')

    if (!token) {
      return
    }

    const newToken = await fastify.githubOAuth2.getNewAccessTokenUsingRefreshToken(token, {})

    return newToken.token
  }

  return {
    async autoSession (request: FastifyRequest, reply: FastifyReply) {
      request.log.info('Automatically check, validate and refresh session')

      const token = request.session.get('token')

      if (!token) {
        request.log.error('No token found in session')

        return false
      }

      const { isExpired, canRefresh, expiresIn } = checkSessionExpiry(request)

      if (isExpired && !canRefresh) {
        request.session.regenerate()

        return false
      }

      const isSessionValid = await validateSession(request)
      // Token will expire in less than an hour
      const willExpireSoon = expiresIn.token < 3600000

      if (canRefresh && (isExpired || willExpireSoon || !isSessionValid)) {
        const token = await refreshSession(request)

        if (!token) {
          request.session.regenerate()

          return false
        }

        request.session.set('token', token)
      }

      reply.locals = {
        user: request.session.get('user') || (await fastify.sessionManager.getUser(request)),
      }

      return true
    },
    async getUser (request: FastifyRequest): Promise<Auth | undefined> {
      request.log.info('Get details of user in session')

      const token = request.session.get('token')

      if (!token) {
        return
      }

      try {
        const response = await fastify.axios.github.get('/user', {
          headers: {
            Authorization: `Bearer ${token.access_token}`,
          },
        })

        return {
          id: response.data.id,
          username: response.data.login,
          email: response.data.email,
        }
      } catch (error) {
        request.log.error(error, 'Failed to get user details')
      }
    },
  }
}

export default fp(async function (fastify) {
  fastify.decorate('sessionManager', createSessionManager(fastify))
})
