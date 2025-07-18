import * as dotenv from 'dotenv';

dotenv.config();
const env: NodeJS.ProcessEnv = process.env;

export default () => ({
  app: {
    app_name: env.APP_NAME,
    app_port: env.APP_PORT,
    api_url: env.API_URL,
    environment: env.APP_ENV,
    jwt_key: env.APP_JWT_KEY,
    jwt_expires_in: env.APP_JWT_EXPIRES_IN || '7d',
    enable_bruteforce_protection: env.APP_ENABLE_BRUTEFORCE_PROTECTION || false,
    enable_2fa: env.APP_ENABLE_2FA || false,
  },
  database: {
    mongodb: {
      uri: env.MONGODB_URI,
    },
  },
  ai: {
    openai_api_key: env.OPENAI_API_KEY ?? '',
    model: {
      gpt: 'gpt-3.5-turbo',
      gpt4_0: 'gpt-4o',
    },
  },
  filesystem: {
    default: 's3',
    disks: {
      s3: {
        driver: 's3',
        bucket: env.AWS_S3_BUCKET,
        key: env.AWS_S3_KEY_ID,
        secret: env.AWS_S3_KEY_SECRET,
        region: env.AWS_S3_REGION,
      },
    },
  },
  mail: {
    resend: {
      key: env.RESEND_KEY,
      from: env.MAIL_FROM,
    },
  },
  cache: {
    redis: {
      host: env.REDIS_HOST,
      port: env.REDIS_PORT,
    },
  },
  throttler: {
    ttl: env.THROTTLER_TTL,
    limit: env.THROTTLER_LIMIT,
  },
});
