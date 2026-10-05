import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  ForbiddenException,
  Req,
} from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { CreateSessionDto, UpdateSessionDto } from './dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user-decorator';
import { AuditLogService } from '../audit-log/audit-log.service';

@UseGuards(JwtAuthGuard)
@Controller('sessions')
export class SessionsController {
  constructor(
    private readonly sessionsService: SessionsService,
    private readonly auditLogService: AuditLogService,
  ) {}

  /**
   * ตรวจสอบว่าผู้ใช้มีสิทธิ์เป็นอาจารย์หรือแอดมิน
   */
  private checkTeacherRole(user: any) {
    if (!user || (user.roleId !== 2 && user.roleId !== 3)) {
      throw new ForbiddenException('สงวนสิทธิ์เฉพาะอาจารย์ผู้สอนเท่านั้น');
    }
  }

  @Get('all')
  async getAllSessions(@CurrentUser() user: any) {
    this.checkTeacherRole(user);
    return await this.sessionsService.findAll();
  }

  @Get(':id')
  async getSessionById(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: any) {
    this.checkTeacherRole(user);
    return await this.sessionsService.findOne(id);
  }

  @Post()
  async createSession(
    @Body() dto: CreateSessionDto,
    @CurrentUser() user: any,
    @Req() req: any,
  ) {
    this.checkTeacherRole(user);
    const created = await this.sessionsService.create(dto);

    await this.auditLogService.logFromRequest(req, {
      action: 'CREATE_SESSION',
      entity: 'Session',
      entityId: created.sessionId,
      details: { name: created.sessionName, targetLevel: created.targetLevel },
    });

    return created;
  }

  @Put(':id')
  async updateSession(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSessionDto,
    @CurrentUser() user: any,
    @Req() req: any,
  ) {
    this.checkTeacherRole(user);
    const updated = await this.sessionsService.update(id, dto);

    await this.auditLogService.logFromRequest(req, {
      action: 'UPDATE_SESSION',
      entity: 'Session',
      entityId: id,
      details: { name: updated.sessionName, status: updated.status },
    });

    return updated;
  }

  @Delete(':id')
  async deleteSession(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: any,
    @Req() req: any,
  ) {
    this.checkTeacherRole(user);
    const deleted = await this.sessionsService.remove(id);

    await this.auditLogService.logFromRequest(req, {
      action: 'DELETE_SESSION',
      entity: 'Session',
      entityId: id,
      details: { name: deleted.sessionName },
    });

    return { message: 'ลบ Session เรียบร้อยแล้ว', sessionId: id };
  }
}
