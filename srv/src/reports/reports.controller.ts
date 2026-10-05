import {
  Controller,
  Get,
  Query,
  UseGuards,
  ForbiddenException,
  Param,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user-decorator';
import { ReportsService } from './reports.service';

@UseGuards(JwtAuthGuard)
@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  private checkAdminOrTeacher(user: any) {
    if (user.roleId !== 3 && user.roleId !== 2) {
      throw new ForbiddenException(
        'เฉพาะผู้ดูแลระบบและอาจารย์ผู้สอนเท่านั้นที่สิทธิ์ตรวจสอบรายงาน',
      );
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
      startDate,
      endDate,
      education,
      search,
      timeRange,
    });
  }

  @Get('exercises')
  async getExerciseReport(
    @CurrentUser() user: any,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('education') education?: string,
    @Query('search') search?: string,
    @Query('timeRange') timeRange?: string,
  ) {
    this.checkAdminOrTeacher(user);
    return this.reportsService.getExerciseReport({
      startDate,
      endDate,
      education,
      search,
      timeRange,
    });
  }

  // ดึงรายละเอียดผลงานของนักศึกษารายคนสำหรับโจทย์ข้อที่เลือก (Drill-Down)
  @Get('exercises/:exerciseId/students')
  async getExerciseStudentBreakdown(
    @CurrentUser() user: any,
    @Param('exerciseId') exerciseId: string,
    @Query('education') education?: string,
  ) {
    this.checkAdminOrTeacher(user);
    return this.reportsService.getExerciseStudentBreakdown(Number(exerciseId), {
      education,
    });
  }

  @Get('errors')
  async getErrorReport(
    @CurrentUser() user: any,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('education') education?: string,
    @Query('search') search?: string,
    @Query('timeRange') timeRange?: string,
  ) {
    this.checkAdminOrTeacher(user);
    return this.reportsService.getErrorReport({
      startDate,
      endDate,
      education,
      search,
      timeRange,
    });
  }

  @Get('usage-analytics')
  async getUsageAnalytics(
    @CurrentUser() user: any,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    this.checkAdminOrTeacher(user);
    return this.reportsService.getUsageAnalytics({ startDate, endDate });
  }

  @Get('students/:userId/activities')
  async getStudentActivities(
    @CurrentUser() user: any,
    @Param('userId') userId: string,
  ) {
    this.checkAdminOrTeacher(user);
    return this.reportsService.getStudentActivities(Number(userId));
  }

  // ดึงรายการส่งตรวจและทดลองรันโค้ดล่าสุดของนักเรียนทุกคนสำหรับแสดงผลบน Dashboard ของครู/แอดมิน
  @Get('recent-submissions')
  async getRecentSubmissions(
    @CurrentUser() user: any,
    @Query('limit') limit?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('eventType') eventType?: string,
  ) {
    this.checkAdminOrTeacher(user);
    return this.reportsService.getRecentSubmissions({
      limit: limit ? Number(limit) : 50,
      startDate,
      endDate,
      eventType,
    });
  }
}

