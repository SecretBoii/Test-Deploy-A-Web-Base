import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 🎯 เปิดสะพานไฟให้หน้าบ้าน React ยิงเข้ามาเรียกใช้ API ได้โดยไม่ติดบล็อก
  app.enableCors({
    origin: '*', // หรือระบุพอร์ตหน้าบ้าน เช่น 'http://localhost:5173'
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(3000);
}
bootstrap();