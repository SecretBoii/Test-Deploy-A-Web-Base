FROM node:20-alpine AS base
RUN apk add --no-cache openssl
WORKDIR /app

# 1. ติดตั้ง Dependencies
FROM base AS deps
COPY package*.json ./
RUN npm ci

# 2. Stage สำหรับ Development (ใช้รันในเครื่องพัฒนา)
FROM base AS dev
COPY --from=deps /app/node_modules ./node_modules
COPY . .
EXPOSE 5173
# ใช้ --host เพื่อให้เข้าถึงพอร์ตจากเครื่องหลักผ่าน Docker ได้
CMD ["npm", "run", "dev", "--", "--host"]

# 3. Stage สำหรับ Build ไฟล์ static
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# 4. Stage สำหรับ Production (ใช้เสิร์ฟไฟล์ผ่าน Nginx)
FROM nginx:alpine AS prod
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

