export default () => ({
  app: {
    api_url: process.env.API_URL,
    environment: process.env.ENV,
    jwtkey: process.env.APP_JWT_KEY,
  },
  database: {
    mongodb: {
      uri: process.env.MONGODB_URI,
    },
  },
  filesystem: {
    default: 's3',
    disks: {
      s3: {
        driver: 's3',
        bucket: process.env.AWS_S3_BUCKET,
        key: process.env.AWS_S3_KEY_ID,
        secret: process.env.AWS_S3_KEY_SECRET,
        region: process.env.AWS_S3_REGION,
      },
    },
  },
  mail: {
    resend: {
      key: process.env.RESEND_KEY,
      from: process.env.MAIL_FROM,
    },
  },
  cache: {
    redis: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    },
  },
  throttler: {
    ttl: process.env.THROTTLER_TTL,
    limit: process.env.THROTTLER_LIMIT,
  },
});
