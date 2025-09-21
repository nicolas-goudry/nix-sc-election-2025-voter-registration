import { Buffer } from 'node:buffer'
import fastifyAxios from 'fastify-axios'
import fp from 'fastify-plugin'

/**
 * This plugins adds axios instances as decorators
 *
 * @see {@link https://github.com/davidedantonio/fastify-axios}
 */
export default fp(async (fastify) => {
  fastify.register(fastifyAxios, {
    clients: {
      github: {
        baseURL: 'https://api.github.com',
        headers: {
          Authorization: `Basic ${Buffer.from(`${fastify.config.GH_CLIENT_ID}:${fastify.config.GH_CLIENT_SECRET}`).toString('base64')}`,
        },
      },
    },
  })
}, {
  name: 'axios',
  dependencies: ['@fastify/env'],
})
