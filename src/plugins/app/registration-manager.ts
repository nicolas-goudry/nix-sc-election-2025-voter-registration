import { Buffer } from 'node:buffer'
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import fp from 'fastify-plugin'
import papa from 'papaparse'

declare module 'fastify' {
  interface FastifyInstance {
    registrationManager: ReturnType<typeof createRegistrationManager>;
  }
}

export interface UserEligibility {
  email?: string;
  isEligible: boolean;
  isRegistered?: boolean;
}

interface EligibleVoter {
  githubId: number;
  githubUsername: string;
  email?: string;
}

function createRegistrationManager (fastify: FastifyInstance) {
  return {
    async getEligibility (request: FastifyRequest, reply: FastifyReply): Promise<UserEligibility> {
      const token = request.session.get('token')

      if (!token) {
        return reply.unauthorized()
      }

      let csvContent

      try {
        request.log.debug('Get eligible CSV file from election repository')

        const response = await fastify.axios.github.get('/repos/nixos/sc-election-2025/contents/eligible.csv', {
          headers: {
            Authorization: `Bearer ${token.access_token}`,
          },
        })

        request.log.info('Successfully got the eligible voters list as CSV')
        request.log.debug(response.data, 'JSON response')

        csvContent = Buffer.from(response.data.content, 'base64').toString()
      } catch (error) {
        request.log.error(error, 'Failed to get CSV file content')

        if (error instanceof Error) {
          return reply.internalServerError(`There was an error while retrieving the list of eligible voters: ${error.message}.`)
        }

        return reply.internalServerError()
      }

      request.log.debug('Parse CSV content')

      const { data, errors, meta } = papa.parse<EligibleVoter>(csvContent, {
        dynamicTyping: true,
        header: true,
      })

      request.log.info({ entries: data.length, errors, meta }, 'Successfully parsed eligible voters CSV file')

      if (data.length === 0) {
        return reply.internalServerError('There was an error while parsing the list of eligible voters.')
      }

      const user = request.session.get('user')

      if (!user) {
        request.log.error('No user found in session')

        return reply.internalServerError()
      }

      const voter = data.find(({ githubId }) => githubId === user.id)

      request.log.info(`User is ${voter ? '' : 'not '}eligible`)

      if (!voter) {
        return {
          email: undefined,
          isEligible: false,
        }
      }

      return {
        email: voter.email || user.email,
        isEligible: true,
        isRegistered: Boolean(voter.email),
      }
    },
    async isAppInstalled (request: FastifyRequest) {
      const user = request.session.get('user')

      if (!user) {
        request.log.error('No user found in session')

        return false
      }

      try {
        request.log.debug(`Check if application is installed for user ${user.username}`)

        await fastify.octokit.request(`/users/${user.username}/installation`)

        request.log.info('Application is installed')

        return true
      } catch (error) {
        request.log.error(error, 'App installation check failed')
      }

      return false
    },
  }
}

export default fp(async function (fastify) {
  fastify.decorate('registrationManager', createRegistrationManager(fastify))
})
