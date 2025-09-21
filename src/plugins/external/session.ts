import fs from 'node:fs'
import path from 'node:path'
import { Token } from '@fastify/oauth2'
import fastifySession from '@fastify/secure-session'
import fp from 'fastify-plugin'
import { Auth } from '../../schemas/auth.js'

declare module '@fastify/secure-session' {
  interface SessionData {
    user: Auth;
    token: Token;
  }
}

/**
 * This plugins enables the use of session.
 *
 * @see {@link https://github.com/fastify/fastify-secure-session}
 */
export default fp(async (fastify) => {
  fastify.register(fastifySession, {
    key: fs.readFileSync(path.join(import.meta.dirname, `../../../${fastify.config.SESSION_SECRET_PATH}`)),
    cookie: {
      secure: fastify.config.COOKIE_SECURED,
      httpOnly: true,
      maxAge: 1_800_000,
      path: '/',
    },
  })
}, {
  name: 'session',
})
