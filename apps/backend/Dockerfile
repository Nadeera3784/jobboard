FROM node:20.12.1

WORKDIR /apps/backend

COPY package*.json ./

RUN npm install

RUN npm uninstall bcrypt

RUN npm install bcrypt

COPY . .

RUN npm run build

EXPOSE 3000

CMD [ "npm", "run", "dev" ]