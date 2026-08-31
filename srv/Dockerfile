FROM node:20-alpine AS base
RUN apk add --no-cache openssl docker-cli
WORKDIR /app


# 1. ติดตั้ง Dependencies
FROM base AS deps
COPY package*.json ./
RUN npm ci

# 2. Stage สำหรับ Development
FROM base AS dev
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
EXPOSE 3000
CMD ["sh", "-c", "npm run start:dev"]

