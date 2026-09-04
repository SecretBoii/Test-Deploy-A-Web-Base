import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuditLogService } from './audit-log.service';
import { AuditLogDto } from './dto/audit-log-query.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('admin/audit-logs')
@UseGuards(JwtAuthGuard)
export class AuditLogController {
    constructor(private auditLogService: AuditLogService){}

    @Get()
    async getAuditLogs(@Query() query: AuditLogDto){
        return this.auditLogService.findAll(query);
    }
}