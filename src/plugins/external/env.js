const schema = {
  type: "object",
  required: ["COOKIE_SECRET", "COOKIE_NAME"],
  properties: {
    // Security
    COOKIE_SECRET: {
      type: "string",
    },
    COOKIE_NAME: {
      type: "string",
    },
    COOKIE_SECURED: {
      type: "boolean",
      default: true,
    },
    RATE_LIMIT_MAX: {
      type: "number",
      default: 100,
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
