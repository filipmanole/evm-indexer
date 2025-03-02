FROM node:22-alpine AS builder
WORKDIR /usr/src/app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

FROM node:22-alpine AS production
WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/node_modules ./node_modules

COPY --from=builder /usr/src/app/packages/api/dist ./packages/api/dist
COPY --from=builder /usr/src/app/packages/core/dist ./packages/core/dist
COPY --from=builder /usr/src/app/packages/scraper/dist ./packages/scraper/dist

COPY package.json .

USER node

FROM production AS api
CMD ["node", "packages/api/dist/index.js"]

FROM production AS scraper
CMD ["node", "packages/scraper/dist/index.js"]
