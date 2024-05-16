import * as dotenv from 'dotenv';

dotenv.config();
const env: NodeJS.ProcessEnv = process.env;

export default () => ({
  app: {
    app_port: env.APP_PORT,
    api_url: env.API_URL,
    environment: env.APP_ENV,
    jwt_key: env.APP_JWT_KEY,
    enable_bruteforce_protection: env.APP_ENABLE_BRUTEFORCE_PROTECTION || false,
  },
  database: {
    mongodb: {
      uri: env.MONGODB_URI,
    },
  },
  ai:{
    google_generative_key: env.GOOGLE_GENERATIVE_KEY
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
