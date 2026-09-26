import { Controller, Get, Query, UseGuards, ForbiddenException } from '@nestjs/common';
import { AuditLogService } from './audit-log.service';
import { AuditLogDto } from './dto/audit-log-query.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user-decorator';

@Controller('admin/audit-logs')
@UseGuards(JwtAuthGuard)
export class AuditLogController {
    constructor(private auditLogService: AuditLogService){}

    @Get()
    async getAuditLogs(
        @CurrentUser() user: any,
        @Query() query: AuditLogDto){
            if (user?.roleId !== 3) {
                throw new ForbiddenException('เฉพาะผู้ดูแลระบบ (Admin) เท่านั้นที่สามารถตรวจสอบ Audit Logs ได้');
            }
        return this.auditLogService.findAll(query);
    }
}