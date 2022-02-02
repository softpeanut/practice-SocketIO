FROM node:16.13.1 AS builder
WORKDIR /app
COPY . .
RUN npm install
RUN npx tsc

FROM node:16.13.1-alpine
WORKDIR /app
COPY --from=builder /app ./
CMD ["npm", "run", "start:prod"]