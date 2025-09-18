import path from "node:path"
import fp from "fastify-plugin"
import fastifyStatic from "@fastify/static"

/**
 * This plugins allows to serve static files as fast as possible.
 *
 * @see {@link https://github.com/fastify/fastify-static}
 */
export default fp(
  async (fastify) => {
    const commonOptions = {
      logLevel: "silent",
    }
    const nodeModulesOptions = {
      decorateReply: false,
      wildcard: false,
      ...commonOptions,
    }

    // Serve static files from public repository
    fastify.register(fastifyStatic, {
      root: path.resolve(import.meta.dirname, "../../../public"),
      prefix: "/public",
      ...commonOptions,
    })

    // Serve webawesome assets
    fastify.register(fastifyStatic, {
      root: path.resolve(import.meta.dirname, "../../../node_modules/@awesome.me/webawesome/dist-cdn"),
      prefix: "/public/vendor/webawesome",
      ...nodeModulesOptions,
    })

    // Serve fontawesome SVGs
    fastify.register(fastifyStatic, {
      root: path.resolve(import.meta.dirname, "../../../node_modules/@fortawesome/fontawesome-free/svgs"),
      prefix: "/public/vendor/fontawesome/svg",
      ...nodeModulesOptions,
    })

    // Serve fontawesome CSS
    fastify.register(fastifyStatic, {
      root: path.resolve(import.meta.dirname, "../../../node_modules/@fortawesome/fontawesome-free/css"),
      prefix: "/public/vendor/fontawesome/css",
      ...nodeModulesOptions,
    })

    // Serve Inter font
    fastify.register(fastifyStatic, {
      root: path.resolve(import.meta.dirname, "../../../node_modules/@fontsource"),
      prefix: "/public/fonts",
      ...nodeModulesOptions,
    })
  },
  {
    name: "static",
  },
)
