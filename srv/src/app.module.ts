import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq'; // 👈 นำเข้า BullModule
import { ExercisesModule } from './exercises/exercises.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CodeProcessor } from './code.processor'; // 👈 นำเข้าไฟล์นี้กลับมาด้วย
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
    PrismaModule,
    ExercisesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService, 
    CodeProcessor // 👈 ใส่กลับเข้ามาตรงนี้ เพื่อเคลียร์บั๊ก UnknownDependencies
  ],
})
export class AppModule {}