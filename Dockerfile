FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json .npmrc ./

RUN npm ci

COPY . ./

RUN npm run build

FROM node:22-alpine

WORKDIR /app

COPY --from=build /app/package.json /app/package-lock.json /app/.npmrc ./

RUN npm ci --omit=dev

COPY --from=build /app/build ./build

ENV NODE_ENV=production
EXPOSE 3000

CMD ["npm", "run", "start"]
