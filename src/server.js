import process from "node:process"
import closeWithGrace from "close-with-grace"
import * as dotenv from "dotenv"
import fastify from "fastify"
import fp from "fastify-plugin"
import { serviceApp, options } from "./app.js"

dotenv.config()

/**
 * Determine what logger to use
 * @see {@link https://www.youtube.com/watch?v=HMM7GJC5E2o}
 */
function getLoggerOptions() {
  const options = { level: process.env.LOG_LEVEL ?? "silent" }

  // Only if the program is running in an interactive terminal
  if (process.stdout.isTTY) {
    options.level = process.env.LOG_LEVEL ?? "info"

    if (process.env.PRETTY_LOGS) {
      options.transport = {
        target: "pino-pretty",
        options: {
          translateTime: "HH:MM:ss Z",
          ignore: "pid,hostname",
        },
      }
    }
  }

  return options
}

const app = fastify({
  ...options,
  logger: getLoggerOptions(),
})

async function init() {
  // Register application as normal plugin
  // fp must be used to override default error handler
  app.register(fp(serviceApp))

  // Delay is the number of milliseconds for the graceful close to finish
  closeWithGrace({ delay: process.env.FASTIFY_CLOSE_GRACE_DELAY ?? 500 }, async ({ err }) => {
    if (err) {
      app.log.error(err)
    }

    await app.close()
  })

  await app.ready()

  try {
    await app.listen({ port: Number(process.env.PORT) || 3000 })
  } catch (error) {
    app.log.error(error)
    process.exit(1) // eslint-disable-line unicorn/no-process-exit
  }
}

init() // eslint-disable-line unicorn/prefer-top-level-await
