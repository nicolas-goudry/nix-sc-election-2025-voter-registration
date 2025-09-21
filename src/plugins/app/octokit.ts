import { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'
import { App } from 'octokit'

declare module 'fastify' {
  interface FastifyInstance {
    octokit: App['octokit'];
  }
}

export default fp(async (fastify: FastifyInstance) => {
  fastify.decorate(
    'octokit',
    new App({
      appId: fastify.config.GH_CLIENT_ID,
      privateKey: fastify.config.GH_APP_KEY,
    }).octokit,
  )
}, { name: 'octokit' })
