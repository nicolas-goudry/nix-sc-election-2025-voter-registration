import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { HomeViewContext } from '../schemas/view-context'

const plugin: FastifyPluginAsyncTypebox = async function home (fastify) {
  fastify.get('/', async function (_, reply) {
    return reply.viewAsync<HomeViewContext>('home', {
      periods: {
        registration: 'September 14 - October 14, 2025',
        voting: 'October 15 - November 1, 2025',
      },
      eligibilityRules: {
        commits: '25+',
        merges: '1+',
        period: 'August 1, 2021 and August 1, 2025',
      },
    })
  })
}

export default plugin
