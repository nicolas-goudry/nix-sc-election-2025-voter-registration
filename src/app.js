import path from "node:path"
import fastifyAutoload from "@fastify/autoload"

/**
 * Pass --options via CLI arguments in fastify-cli command to enable these options
 * The standalone server.js file uses these options as well
 */
export const options = {
  ignoreDuplicateSlashes: true,
  ignoreTrailingSlash: true,
  // Configure the Ajv v8 instance used by Fastify
  ajv: {
    customOptions: {
      coerceTypes: "array", // Change type of data to match type keyword
      removeAdditional: "all", // Remove additional body properties
    },
  },
}

export async function serviceApp(fastify, _options) {
  // This loads all external plugins defined in plugins/external
  // Those should be registered first as application plugins might depend on them
  await fastify.register(fastifyAutoload, {
    dir: path.join(import.meta.dirname, "plugins/external"),
    options: {},
  })

  // This loads all application plugins defined in plugins/app
  // Those should be support plugins that are reused through the application
  fastify.register(fastifyAutoload, {
    dir: path.join(import.meta.dirname, "plugins/app"),
    options: {},
  })

  // This loads all plugins defined in routes
  fastify.register(fastifyAutoload, {
    dir: path.join(import.meta.dirname, "routes"),
    autoHooks: true,
    cascadeHooks: true,
    options: {},
  })

  // This sets the default error handler
  fastify.setErrorHandler((error, request, reply) => {
    fastify.log.error(
      {
        err: error,
        request: {
          method: request.method,
          url: request.url,
          query: request.query,
          params: request.params,
        },
      },
      "Unhandled error occurred",
    )

    reply.code(error.statusCode ?? 500)

    let message = "An internal server error occurred. Head back <a href='/'>home</a>."

    if (error.statusCode && error.statusCode < 500) {
      message = error.message
    }

    return reply.viewAsync("error", { title: error.type || "Unknown", message })
  })

  // This sets the default 404 handler
  fastify.setNotFoundHandler((request, reply) => {
    request.log.warn(
      {
        request: {
          method: request.method,
          url: request.url,
          query: request.query,
          params: request.params,
        },
      },
      "Resource not found",
    )

    reply.code(404)

    return { message: "Not Found" }
  })
}

export default serviceApp
