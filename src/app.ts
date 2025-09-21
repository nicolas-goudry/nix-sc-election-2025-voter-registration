import path from 'node:path'
import fastifyAutoload from '@fastify/autoload'
import { FastifyInstance, FastifyPluginOptions, FastifyServerOptions } from 'fastify'
import { ErrorViewContext } from './schemas/view-context'

export const options: FastifyServerOptions = {
  routerOptions: {
    ignoreDuplicateSlashes: true,
    ignoreTrailingSlash: true,
  },
  ajv: {
    customOptions: {
      coerceTypes: 'array',
      removeAdditional: 'all',
    },
  },
}

const ERROR_MESSAGES: Record<number, ErrorViewContext> = {
  401: {
    title: "Hold up! You don't have permission to view this page.",
    message: "It looks like you don't have access to this section…<br/>Only authenticated users can proceed further.",
  },
  500: {
    title: 'Uh oh! Something went wrong.',
    message: "It looks like our system tripped over some wires…<br/>Don't worry — this error is on our side, not yours.",
  },
}

export async function serviceApp (
  fastify: FastifyInstance,
  opts: FastifyPluginOptions,
) {
  // This loads all external plugins defined in plugins/external
  // those should be registered first as your application plugins might depend on them
  await fastify.register(fastifyAutoload, {
    dir: path.join(import.meta.dirname, 'plugins/external'),
    options: {},
  })

  // This loads all your application plugins defined in plugins/app
  // those should be support plugins that are reused
  // through your application
  fastify.register(fastifyAutoload, {
    dir: path.join(import.meta.dirname, 'plugins/app'),
    options: { ...opts },
  })

  // This loads all plugins defined in routes
  // define your routes in one of these
  fastify.register(fastifyAutoload, {
    dir: path.join(import.meta.dirname, 'routes'),
    autoHooks: true,
    cascadeHooks: true,
    options: { ...opts },
  })

  fastify.setErrorHandler((error, request, reply) => {
    fastify.log.error(
      {
        error: {
          ...error,
          message: error.message,
        },
        request: {
          method: request.method,
          url: request.url,
          query: request.query,
          params: request.params,
        },
      },
      'Unhandled error occurred',
    )

    reply.code(error.statusCode ?? 500)

    const errorContext = {
      ...ERROR_MESSAGES[error.statusCode || 500],
      enableReport: false,
    }

    if (error.statusCode && error.statusCode >= 500) {
      errorContext.title ||= 'Uh oh! Something went wrong.'
      errorContext.enableReport = true
    } else {
      errorContext.details ||= error.message
    }

    return reply.viewAsync<ErrorViewContext>('error', errorContext)
  })

  // An attacker could search for valid URLs if your 404 error handling is not rate limited.
  fastify.setNotFoundHandler(
    (request, reply) => {
      request.log.warn(
        {
          request: {
            method: request.method,
            url: request.url,
            query: request.query,
            params: request.params,
          },
        },
        'Resource not found',
      )

      reply.code(404)

      return reply.viewAsync<ErrorViewContext>('error', {
        title: 'Oops! Looks like you got lost.',
        message: "We couldn't find the page you requested.<br/>But don't worry, you're still part of the democratic process.",
      })
    })
}

export default serviceApp
