import { Module } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { ReportsErrorService } from './reports-error.service';
import { ReportsAnalyticsService } from './reports-analytics.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ReportsController],
  providers: [ReportsService, ReportsErrorService, ReportsAnalyticsService],
  exports: [ReportsService, ReportsErrorService, ReportsAnalyticsService],
})
export class ReportsModule {}
