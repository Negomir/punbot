FROM node:18-bullseye

WORKDIR /home/node

USER node

COPY package.json .
RUN yarn install

COPY . .

EXPOSE 3000

CMD ["yarn", "run", "start"]
