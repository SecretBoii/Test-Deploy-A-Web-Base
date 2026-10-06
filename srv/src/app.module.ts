import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { ExercisesModule } from './exercises/exercises.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CodeProcessor } from './code.processor';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { AuditLogModule } from './audit-log/audit-log.module';
import { SessionsModule } from './sessions/sessions.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        connection: {
          host: configService.get<string>('REDIS_HOST') || '127.0.0.1',
          port: configService.get<number>('REDIS_PORT') || 6379,
        },
      }),
    }),
    PrismaModule,
    ExercisesModule,
    AuthModule,
    UsersModule,
    ReportsModule,
    AuditLogModule,
    SessionsModule,
  ],
  controllers: [AppController],
  providers: [AppService, CodeProcessor],
})
export class AppModule {}
