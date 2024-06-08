/*
|--------------------------------------------------------------------------
| Environment variables service
|--------------------------------------------------------------------------
|
| The `Env.create` method creates an instance of the Env service. The
| service validates the environment variables and also cast values
| to JavaScript data types.
|
*/

import { Env } from '@adonisjs/core/env'

export default await Env.create(new URL('../', import.meta.url), {
  NODE_ENV: Env.schema.enum(['development', 'production', 'test'] as const),
  PORT: Env.schema.number(),
  APP_KEY: Env.schema.string(),
  HOST: Env.schema.string({ format: 'host' }),
  LOG_LEVEL: Env.schema.string(),
  ADMINS: Env.schema.string(),

  /*
  |----------------------------------------------------------
  | Variables for configuring file upload
  |----------------------------------------------------------
  */
  APP_URL: Env.schema.string(),
  DRIVE_NAME: Env.schema.string(),
  DRIVE_ROOT: Env.schema.string(),
  STATIC_STORAGE_PATH: Env.schema.string(),
  STATIC_QUOTA: Env.schema.number(),
  CONVERSATION_STORAGE_PATH: Env.schema.string(),
  CONVERSATION_QUOTA: Env.schema.number(),

  /*
  |----------------------------------------------------------
  | Variables for configuring database connection
  |----------------------------------------------------------
  */
  DB_HOST: Env.schema.string({ format: 'host' }),
  DB_PORT: Env.schema.number(),
  DB_USER: Env.schema.string(),
  DB_PASSWORD: Env.schema.string.optional(),
  DB_DATABASE: Env.schema.string(),

  /*
  |----------------------------------------------------------
  | Variables for configuring ally package
  |----------------------------------------------------------
  */
  // FACEBOOK_CLIENT_ID: Env.schema.string(),
  // FACEBOOK_CLIENT_SECRET: Env.schema.string(),
  GITHUB_CLIENT_ID: Env.schema.string(),
  GITHUB_CLIENT_SECRET: Env.schema.string(),
  GITHUB_CLIENT_CALLBACK_URL: Env.schema.string(),
  GOOGLE_CLIENT_ID: Env.schema.string(),
  GOOGLE_CLIENT_SECRET: Env.schema.string(),
  GOOGLE_CLIENT_CALLBACK_URL: Env.schema.string(),
  // TWITTER_CLIENT_ID: Env.schema.string(),
  // TWITTER_CLIENT_SECRET: Env.schema.string()

  /*
  |----------------------------------------------------------
  | Variables for configuring google cloud storage
  |----------------------------------------------------------
  */
  GOOGLE_CLOUD_STORAGE_BUCKET_NAME: Env.schema.string(),
  GOOGLE_CLOUD_STORAGE_STORAGE_PATH: Env.schema.string(),

  /*
  |----------------------------------------------------------
  | Variables for @rlanz/bull-queue
  |----------------------------------------------------------
  */
  QUEUE_REDIS_HOST: Env.schema.string({ format: 'host' }),
  QUEUE_REDIS_PORT: Env.schema.number(),
  QUEUE_REDIS_PASSWORD: Env.schema.string.optional(),

  /*
  |----------------------------------------------------------
  | Variables for configuring predict api
  |----------------------------------------------------------
  */
  PREDICT_API_HOST: Env.schema.string(),
})
