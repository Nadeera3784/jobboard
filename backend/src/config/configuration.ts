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
    },
    job_types: [
      'Full-time',
      'Part-time',
      'Contract',
      'Internship',
      'Temporary'
    ],
    remote: [
      'Remote',
      'On-site',
      'Hybrid'
    ],
    experience_level: [
      'Internship',
      'Associate',
      'Director',
      'Entry level',
      'Mid-Senior level',
      'Executive'
    ]
  });