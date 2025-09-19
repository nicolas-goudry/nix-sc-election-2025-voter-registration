import fp from "fastify-plugin"
import { App } from "octokit"

/**
 * This plugins adds the Octokit SDK as a globally available decorator
 *
 * @see https://github.com/octokit/octokit.js
 */
export default fp(
  async (fastify) => {
    fastify.decorate(
      "octokit",
      new App({
        appId: fastify.config.GH_CLIENT_ID,
        privateKey: fastify.config.GH_CLIENT_PRIVATE_KEY,
      }).octokit,
    )
  },
  {
    name: "octokit",
    dependencies: ["@fastify/env"],
  },
)
