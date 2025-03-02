FROM node:22-alpine AS builder
WORKDIR /usr/src/app

COPY package.json yarn.lock ./

COPY . .

RUN yarn install --frozen-lockfile --workspaces
RUN yarn workspaces run build


FROM node:22-alpine AS production
WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/node_modules ./node_modules

COPY --from=builder /usr/src/app/packages/core/package.json ./packages/core/
COPY --from=builder /usr/src/app/packages/core/dist ./packages/core/dist

COPY --from=builder /usr/src/app/packages/scraper/package.json ./packages/scraper/
COPY --from=builder /usr/src/app/packages/scraper/dist ./packages/scraper/dist

COPY --from=builder /usr/src/app/packages/api/package.json ./packages/api/
COPY --from=builder /usr/src/app/packages/api/dist ./packages/api/dist


FROM production AS api
CMD ["node", "packages/api/dist/index.js"]


FROM production AS scraper
CMD ["node", "packages/scraper/dist/index.js"]
