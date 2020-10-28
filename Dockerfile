### BASE ###

FROM node:15-buster-slim AS base

RUN apt-get update && apt-get install --no-install-recommends --yes openssl

WORKDIR /api

### BUILDER ###
FROM base AS builder

COPY package.json yarn.lock ./

RUN yarn install --pure-lockfile

COPY . .

RUN yarn generate
RUN yarn build

### RUNNER ###
FROM base

WORKDIR /api

COPY --from=builder /api/dist/ ./dist/
COPY package.json yarn.lock ./
COPY prisma ./prisma
COPY start.sh ./

RUN yarn install --prod --pure-lockfile

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.7.3/wait /wait
RUN chmod +x /wait
RUN chmod +x start.sh

USER node
CMD ./start.sh
