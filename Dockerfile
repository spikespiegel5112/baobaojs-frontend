FROM node:22-alpine AS build-env
COPY . /app
WORKDIR /app
RUN yarn install --frozen-lockfile && yarn build

FROM node:22-alpine
COPY ./package.json yarn.lock /app/
WORKDIR /app
RUN yarn install --frozen-lockfile
COPY --from=build-env /app/dist /app/dist
CMD ["npm", "run", "start"]
