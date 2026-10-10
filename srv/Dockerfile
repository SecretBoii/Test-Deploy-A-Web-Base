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

# 3. Stage สำหรับ Build (Compile TypeScript และ Prisma Client)
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# 4. Stage สำหรับ Production Runtime
# คัดลอกเฉพาะ Artifacts ที่คอมไพล์แล้ว เพื่อความเสถียรและประสิทธิภาพสูงสุด
FROM base AS prod
ENV NODE_ENV=production
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY package*.json ./
EXPOSE 3000
CMD ["node", "dist/main.js"]

