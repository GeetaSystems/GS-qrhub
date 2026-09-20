FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

FROM node:20-alpine
RUN addgroup -S gsqr && adduser -S gsqr -G gsqr
WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY src/ ./src/
COPY package.json ./
RUN chown -R gsqr:gsqr /app
USER gsqr
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:${PORT:-3000}/health || exit 1
EXPOSE 3000
CMD ["node", "src/app.js"]
