FROM node:22.17.0

WORKDIR /apps/frontend

COPY package*.json ./

RUN npm i vite@latest -D

RUN npm install

COPY . .

#RUN npm run build

EXPOSE 5173

CMD [ "npm", "run", "dev" ]