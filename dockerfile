FROM node:22.8.0

WORKDIR /app

COPY package.json /app

RUN yarn install

COPY . /app

RUN yarn build

CMD ["yarn", "run", "start:prod"]