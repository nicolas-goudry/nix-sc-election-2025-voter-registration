declare module 'fastify' {
  export interface FastifyInstance {
    config: {
      PORT: number;
      SESSION_SECRET_PATH: string;
      COOKIE_SECURED: boolean;
      GH_CLIENT_ID: string;
      GH_CLIENT_SECRET: string;
      GH_OAUTH_CALLBACK: string;
      GH_APP_KEY: string;
      GH_APP_INSTALL: string;
    };
  }
}

const schema = {
  type: 'object',
  required: [
    'GH_CLIENT_ID',
    'GH_CLIENT_SECRET',
    'GH_APP_KEY',
  ],
  properties: {
    // Security
    SESSION_SECRET_PATH: {
      type: 'string',
      default: 'session-secret.key',
    },
    COOKIE_SECURED: {
      type: 'boolean',
      default: true,
    },

    // GitHub App credentials
    GH_CLIENT_ID: {
      type: 'string',
      minLength: 1,
    },
    GH_CLIENT_SECRET: {
      type: 'string',
      minLength: 1,
    },
    GH_OAUTH_CALLBACK: {
      type: 'string',
      default: 'http://localhost:3000/auth/callback',
    },
    GH_APP_KEY: {
      type: 'string',
      minLength: 1,
    },
    GH_APP_INSTALL: {
      type: 'string',
      default: 'https://github.com/apps/nix-sc-election-voter-registration/installations/new/permissions?target_type=User',
    },
  },
}

export const autoConfig = {
  schema,
  dotenv: true,
}

/**
 * This plugins helps to check environment variables.
 *
 * @see {@link https://github.com/fastify/fastify-env}
 */
export { default } from '@fastify/env'
