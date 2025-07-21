### [JobBoard](https://github.com/Nadeera3784/jobboard)

The JobBoard is a robust platform designed to streamline the process of job management for both employers and job seekers. Packed with essential features, this application facilitates seamless login, registration, and password reset functionalities, ensuring secure access for all users. Employers can effortlessly create, update, and delete job postings, while job seekers can easily apply for available positions. With advanced features like automated job expiration, role-based access, and two-factor authentication, this platform ensures both efficiency and security. Additionally, users can conveniently track the status of their applications through the intuitive user interface. Overall, the JobBoard provides a reliable solution for effective job management in today's dynamic employment landscape.

![Backend CI](https://github.com/Nadeera3784/jobboard/actions/workflows/main.yml/badge.svg?branch=main)

![Landing Page](https://github.com/Nadeera3784/jobboard/screenshots/1.png)

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
$ http://127.0.0.1:3000/status
```

## Swagger Doc

```bash
$ http://127.0.0.1:3000/api-doc
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
