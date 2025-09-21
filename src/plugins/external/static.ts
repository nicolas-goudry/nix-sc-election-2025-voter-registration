import path from 'node:path'
import fastifyStatic, { FastifyStaticOptions } from '@fastify/static'
import { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'

/**
 * This plugins allows to serve static files as fast as possible.
 *
 * @see {@link https://github.com/fastify/fastify-static}
 */
export default fp(async (fastify: FastifyInstance) => {
  const commonOptions: Pick<FastifyStaticOptions, 'logLevel'> = {
    logLevel: 'silent',
  }
  const nodeModulesOptions: Pick<FastifyStaticOptions, 'decorateReply' | 'wildcard'> = {
    decorateReply: false,
    wildcard: false,
    ...commonOptions,
  }

  // Serve static files from public repository
  fastify.register(fastifyStatic, {
    root: path.resolve(import.meta.dirname, '../../../public'),
    ...commonOptions,
  })

  // Serve webawesome assets
  fastify.register(fastifyStatic, {
    root: path.resolve(import.meta.dirname, '../../../node_modules/@awesome.me/webawesome/dist-cdn'),
    prefix: '/assets/vendor/webawesome',
    ...nodeModulesOptions,
  })

  // Serve fontawesome SVGs
  fastify.register(fastifyStatic, {
    root: path.resolve(import.meta.dirname, '../../../node_modules/@fortawesome/fontawesome-free/svgs'),
    prefix: '/assets/vendor/fontawesome/svg',
    ...nodeModulesOptions,
  })

  // Serve fontawesome CSS
  fastify.register(fastifyStatic, {
    root: path.resolve(import.meta.dirname, '../../../node_modules/@fortawesome/fontawesome-free/css'),
    prefix: '/assets/vendor/fontawesome/css',
    ...nodeModulesOptions,
  })

  // Serve Inter font
  fastify.register(fastifyStatic, {
    root: path.resolve(import.meta.dirname, '../../../node_modules/@fontsource'),
    prefix: '/assets/fonts',
    ...nodeModulesOptions,
  })
}, {
  name: 'static',
})
