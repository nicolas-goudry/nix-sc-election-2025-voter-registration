export const autoConfig = {
  contentSecurityPolicy: {
    directives: {
      // Allow loading data:image/svg+xml content
      connectSrc: ["'self'", 'data:'],
    },
  },
}

/**
 * This plugins sets the basic security headers.
 *
 * @see {@link https://github.com/fastify/fastify-helmet}
 */
export { default } from '@fastify/helmet'
