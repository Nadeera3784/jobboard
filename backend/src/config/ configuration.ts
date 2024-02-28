export default () => ({
    app: {
      environment: process.env.ENV,
      jwtkey: process.env.APP_JWT_KEY,
    },
    database: {
      mongodb: {
        uri: process.env.DB_URI,
      },
    },
    mail: {
        resend: {
          username: process.env.RESEND_KEY,
          from: process.env.MAIL_FROM
        },
    },
    cache: {
        redis: {
          host: process.env.REDIS_HOST,
          port: process.env.REDIS_PORT,
        }
    }
  });