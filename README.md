### [JoBoard](https://github.com/Nadeera3784/jobboard)

Job listing application 

## Features

- Login
- Registration
- Password reset
- Create job post
- Update job post
- Delete job post
- Apply for a job post
- Schedule job post
- Account inactivity reminder email 
- Automated job expiration
- Role base access
- Two-factor authentication (2FA) 
- Application status check via UI

## Tech

#### Backend

- NestJS - A progressive framework for building efficient and scalable server-side applications
- Redis - cache & queues 
- MongoDB - database
- Resend - Email for developers


#### Frontend

- React - The library for web and native user interfaces
- Tailwindcss - A utility-first CSS framework 
- Radix UI - An open source component library optimized for fast development
- Zod - TypeScript-first schema validation with static type inference
- Vite - Next Generation Frontend Tooling
- Vitest - Next Generation Testing Framework
- Lucide React - Beautiful & consistent icons
- Axios - Promise based HTTP client for the browser and node.js


## Installation -  Backend

```bash
$ docker compose up -d
$ npm install
```
`Kindly make the necessary amendments to the .env file`

## Running The Backend

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Running The Backend Seeders

```bash
# seed categories
$ npm run cli category:seed 
# seed locations
$ npm run cli location:seed
# seed users
$ npm run cli user:seed
$ npm run cli admin:seed
# seed jobs
$ npm run cli job:seed
```

## Bull Dashboard

```bash
$ http://127.0.0.1:3000/api/v1/queues
```

## Health Status

```bash
$ http://127.0.0.1:3000/api/v1/status
```

## Running The Backend Cron Worker

```bash
$ npm run cron
```

## The Backend Test

```bash
# unit tests
$ npm run test
```


## Installation -  Frontend

```bash
$ npm install
```
`Kindly make the necessary amendments to the .env file`

## Running The Frontend

```bash
# development
$ npm run dev
```