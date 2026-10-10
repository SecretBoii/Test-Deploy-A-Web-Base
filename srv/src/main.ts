import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const configuredOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim())
    : null;

  // กำหนด CORS ให้ยืดหยุ่นและปลอดภัย:
  // หากระบุ CORS_ORIGIN ใน .env จะทำการล็อก Origin อย่างเข้มงวด
  // หากยังไม่ได้ระบุ จะอนุญาต Origin ที่ส่งเข้ามาเพื่อป้องกันปัญหา CORS บล็อกเมื่อเพิ่งขึ้นเซิร์ฟเวอร์ใหม่
  app.enableCors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      if (!origin) {
        return callback(null, true);
      }
      if (configuredOrigins && configuredOrigins.length > 0) {
        if (configuredOrigins.includes(origin) || configuredOrigins.includes('*')) {
          return callback(null, true);
        }
        return callback(new Error(`CORS blocked for origin: ${origin}`), false);
      }
      return callback(null, true);
    },
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();
