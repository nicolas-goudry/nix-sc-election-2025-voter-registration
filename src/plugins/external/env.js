const schema = {
  type: "object",
  required: ["GH_CLIENT_ID", "GH_CLIENT_SECRET", "GH_PRIVATE_KEY"],
  properties: {
    // Security
    SESSION_SECRET_PATH: {
      type: "string",
      default: "session-secret.key",
    },
    COOKIE_SECURED: {
      type: "boolean",
      default: true,
    },
    RATE_LIMIT_MAX: {
      type: "number",
      default: 100,
    },

    // GitHub App credentials
    GH_CLIENT_ID: {
      type: "string",
      minLength: 1,
    },
    GH_CLIENT_SECRET: {
      type: "string",
      minLength: 1,
    },
    GH_OAUTH_CALLBACK: {
      type: "string",
      default: "http://localhost:3000/auth/callback",
    },
    GH_PRIVATE_KEY: {
      type: "string",
    },
  },
}

export const autoConfig = {
  confKey: "config",
  schema,
  dotenv: true,
}

/**
 * This plugins helps to check environment variables.
 *
 * @see {@link https://github.com/fastify/fastify-env}
 */

export { default } from "@fastify/env"
