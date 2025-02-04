FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm install nodemon
RUN npm install mongoose
RUN npm install express
RUN npm install dotenv
RUN npm install bcrypt
RUN npm install jsonwebtoken
RUN npm install cors


COPY . .

EXPOSE 4000

CMD ["npm", "run", "dev"]