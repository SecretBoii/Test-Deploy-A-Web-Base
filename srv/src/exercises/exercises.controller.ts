import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Query,
  UseGuards,
  Put,
  Delete,
  ForbiddenException,
  Req,
} from '@nestjs/common';
import { ExercisesService } from './exercises.service';
import { ExercisesGradingService } from './exercises-grading.service';
import { ExercisesProgressService } from './exercises-progress.service';
import { SubmitExerciseDto, CreateExerciseDto, UpdateExerciseDto } from './dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user-decorator';
import { AuditLogService } from '../audit-log/audit-log.service';

@UseGuards(JwtAuthGuard)
@Controller('exercises')
export class ExercisesController {
  constructor(
    private readonly exercisesService: ExercisesService,
    private readonly gradingService: ExercisesGradingService,
    private readonly progressService: ExercisesProgressService,
    private readonly auditLogService: AuditLogService,
  ) {}

  @Post('run')
  async runCode(
    @Body() submitExerciseDto: SubmitExerciseDto,
    @CurrentUser() user: any,
    @Req() req: any,
  ) {
    const { exerciseId, sourceCode, hintUsed, sessionId, runCount } =
      submitExerciseDto;
    const result = await this.exercisesService.submitExercise(
      user.userId,
      exerciseId,
      sourceCode,
      'run',
      hintUsed,
      sessionId,
      runCount,
      user.roleId,
    );
    // บันทึก Audit Log เมื่อนักเรียนกด Run ทดสอบโค้ด
    await this.auditLogService.logFromRequest(req, {
      action: 'RUN_CODE',
      entity: 'Exercise',
      entityId: exerciseId,
      details: { runCount, hintUsed, sessionId },
    });
    return result;
  }

  @Post('submit')
  async submitCode(
    @Body() submitExerciseDto: SubmitExerciseDto,
    @CurrentUser() user: any,
    @Req() req: any,
  ) {
    const { exerciseId, sourceCode, hintUsed, sessionId, runCount } =
      submitExerciseDto;
    const result = await this.exercisesService.submitExercise(
      user.userId,
      exerciseId,
      sourceCode,
      'submit',
      hintUsed,
      sessionId,
      runCount,
      user.roleId,
    );
    // บันทึก Audit Log เมื่อส่งตรวจงานจริง
    await this.auditLogService.logFromRequest(req, {
      action: 'SUBMIT_EXERCISE',
      entity: 'Exercise',
      entityId: exerciseId,
      details: { runCount, hintUsed, sessionId },
    });
    return result;
  }

  @Get('test-skills')
  async testSkills() {
    return this.gradingService.getLoadedSkills();
  }

  @Get('status/:activityId')
  async getStatus(@Param('activityId') activityId: string) {
    return await this.exercisesService.getStatus(Number(activityId));
  }

  @Get('recent-session')
  async getRecentSession(@CurrentUser() user: any) {
    return await this.progressService.getRecentSession(user.userId);
  }

  // API ดึงความก้าวหน้าสรุปของแต่ละ Level (ต้องวางก่อน :id)
  @Get('levels-summary')
  async getLevelsSummary(@CurrentUser() user: any) {
    return await this.progressService.getLevelsSummary(user.userId);
  }

  @Get('dashboard-stats')
  async getDashboardStats(@CurrentUser() user: any) {
    return await this.progressService.getDashboardStats(user.userId);
  }

  @Get('history')
  async getHistory(
    @CurrentUser() user: any,
    @Query('limit') limit?: string,
    @Query('page') page?: string,
  ) {
    const limitNum = limit ? Number(limit) : undefined;
    const pageNum = page ? Number(page) : 1;
    return await this.progressService.getHistory(
      user.userId,
      limitNum,
      pageNum,
    );
  }

  // API ดึงข้อมูล Sessions ย่อยทั้งหมดใน Level นั้นๆ พร้อมข้อมูลโจทย์ใน Session (ต้องวางก่อน :id)
  @Get('level-sessions/:level')
  async getLevelSessions(
    @Param('level') level: string,
    @CurrentUser() user: any,
  ) {
    return await this.progressService.getLevelSessions(
      Number(level),
      user.userId,
    );
  }

  @Get('manage/all')
  async getAllExercises(@CurrentUser() user: any) {
    if (user.roleId !== 2 && user.roleId !== 3) {
      throw new ForbiddenException(
        'Only teachers and admins can view all exercises.',
      );
    }
    return await this.exercisesService.getAllExercisesForManage();
  }

  @Post()
  async create(
    @Body() dto: CreateExerciseDto,
    @CurrentUser() user: any,
    @Req() req: any,
  ) {
    if (user.roleId !== 2) {
      throw new ForbiddenException('Only teachers can create exercises.');
    }
    const created = await this.exercisesService.createExercise(dto);
    await this.auditLogService.logFromRequest(req, {
      action: 'CREATE_EXERCISE',
      entity: 'Exercise',
      entityId: created.exerciseId,
      details: {
        title: created.title,
        topic: created.topic,
        difficulty: created.difficultyLevel,
      },
    });
    return created;
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateExerciseDto,
    @CurrentUser() user: any,
    @Req() req: any,
  ) {
    if (user.roleId !== 2) {
      throw new ForbiddenException('Only teachers can update exercises.');
    }
    const updated = await this.exercisesService.updateExercise(Number(id), dto);
    await this.auditLogService.logFromRequest(req, {
      action: 'UPDATE_EXERCISE',
      entity: 'Exercise',
      entityId: Number(id),
      details: { title: updated.title, updatedFields: Object.keys(dto) },
    });
    return updated;
  }

  @Delete(':id')
  async delete(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Req() req: any,
  ) {
    if (user.roleId !== 2) {
      throw new ForbiddenException('Only teachers can delete exercises.');
    }
    const deleted = await this.exercisesService.deleteExercise(Number(id));
    await this.auditLogService.logFromRequest(req, {
      action: 'DELETE_EXERCISE',
      entity: 'Exercise',
      entityId: Number(id),
      details: { deletedExerciseId: Number(id) },
    });
    return deleted;
  }

  @Post(':id/hint')
  async recordHintUsage(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Req() req: any,
  ) {
    const exerciseId = Number(id);
    const result = await this.exercisesService.recordHintUsage(
      user.userId,
      exerciseId,
    );
    // บันทึก Audit Log เพื่อตรวจสอบประวัติการเปิดดูคำใบ้
    await this.auditLogService.logFromRequest(req, {
      action: 'VIEW_HINT',
      entity: 'Exercise',
      entityId: exerciseId,
      details: { hintUsed: true },
    });
    return result;
  }

  // API ดึงโจทย์ตาม ID (ต้องวางหลัง static routes)
  @Get(':id')
  async getExerciseById(@Param('id') id: string, @CurrentUser() user: any) {
    return await this.exercisesService.getExerciseById(
      Number(id),
      user.userId,
      user.roleId,
    );
  }
}
