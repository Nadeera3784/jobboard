FROM node:22.17.0

WORKDIR /apps/backend

COPY package*.json ./

RUN npm install

RUN npm uninstall bcrypt

RUN npm install bcrypt

COPY . .

RUN npm run build

EXPOSE 3000

CMD [ "npm", "run", "dev" ]