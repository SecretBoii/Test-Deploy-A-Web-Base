import { Controller, Get, Query, UseGuards, ForbiddenException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user-decorator';
import { ReportsService } from './reports.service';

@UseGuards(JwtAuthGuard)
@Controller('reports')
export class ReportsController {
    constructor(private reportsService: ReportsService) {}
    
    private checkAdminOrTeacher(user: any) {
        if (user.roleId !== 3 && user.roleId !==2) {
            throw new ForbiddenException('เฉพาะผู้ดูแลระบบและอาจารย์ผู้สอนเท่านั้นที่สิทธิ์ตรวจสอบรายงาน')
        }
    }

    @Get('students')
    async getStudentReport(
    @CurrentUser() user: any,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('education') education?: string,
    @Query('search') search?: string,
    @Query('timeRange') timeRange?: string,
    ) {
        this.checkAdminOrTeacher(user);
        return this.reportsService.getStudentReport({
            startDate, endDate, education, search, timeRange
        });
    }

    @Get('exercises')
    async getExerciseReport(
    @CurrentUser() user: any,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('education') education?: string,
    @Query('timeRange') timeRange?: string,
    ) {
        this.checkAdminOrTeacher(user);
        return this.reportsService.getExerciseReport({
            startDate, endDate, education, timeRange
        });
    }

    @Get('errors')
    async getErrorReport(
        @CurrentUser() user: any,
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
        @Query('education') education?: string,
        @Query('timeRange') timeRange?: string,
    ) {
        this.checkAdminOrTeacher(user);
        return this.reportsService.getErrorReport({
            startDate, endDate, education, timeRange
        });
    }

    @Get('usage-analytics')
    async getUsageAnalytics(
        @CurrentUser() user: any,
        @Query('timeRange') timeRange?: string,
    ) {
        this.checkAdminOrTeacher(user);
        return this.reportsService.getUsageAnalytics({timeRange});  
    }
}