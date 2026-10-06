import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ForbiddenException,
  NotFoundException,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user-decorator';
import { AuditLogService } from '../audit-log/audit-log.service';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly auditLogService: AuditLogService,
  ) {}

  private checkAdmin(user: any) {
    if (user.roleId !== 3) {
      throw new ForbiddenException(
        'เฉพาะผู้ดูแลระบบ (Admin) เท่านั้นที่สามารถใช้งานส่วนนี้ได้',
      );
    }
  }

  @Get()
  async getAllUsers(
    @CurrentUser() adminUser: any,
    @Query('search') search?: string,
    @Query('roleId') roleId?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    this.checkAdmin(adminUser);
    const parsedRoleId = roleId ? Number(roleId) : undefined;
    const parsedPage = page ? Number(page) : undefined;
    const parsedLimit = limit ? Number(limit) : undefined;
    return await this.usersService.findAll(
      search,
      parsedRoleId,
      parsedPage,
      parsedLimit,
    );
  }

  @Get(':id')
  async getUserById(@CurrentUser() adminUser: any, @Param('id') id: string) {
    this.checkAdmin(adminUser);
    const user = await this.usersService.findOne(Number(id));
    if (!user) {
      throw new NotFoundException('ไม่พบผู้ใช้งานนี้ในระบบ');
    }
    return user;
  }

  @Post()
  async createUser(
    @CurrentUser() adminUser: any,
    @Body() createUserDto: CreateUserDto,
    @Req() req: any,
  ) {
    this.checkAdmin(adminUser);
    const createdUser = await this.usersService.create(createUserDto);
    await this.auditLogService.logFromRequest(req, {
      action: 'CREATE_USER',
      entity: 'UserProfile',
      entityId: createdUser.userId,
      details: {
        createdUsername: createdUser.username,
        roleId: createdUser.roleId,
        email: createdUser.email,
      },
    });
    return createdUser;
  }

  @Put(':id')
  async updateUser(
    @CurrentUser() adminUser: any,
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: any,
  ) {
    this.checkAdmin(adminUser);
    const updatedUser = await this.usersService.update(
      Number(id),
      updateUserDto,
    );
    await this.auditLogService.logFromRequest(req, {
      action: 'UPDATE_USER',
      entity: 'UserProfile',
      entityId: Number(id),
      details: {
        targetUsername: updatedUser.username,
        updatedFields: Object.keys(updateUserDto),
      },
    });
    return updatedUser;
  }

  @Delete(':id')
  async deleteUser(
    @CurrentUser() adminUser: any,
    @Param('id') id: string,
    @Req() req: any,
  ) {
    this.checkAdmin(adminUser);
    const result = await this.usersService.delete(Number(id));
    await this.auditLogService.logFromRequest(req, {
      action: 'DELETE_USER',
      entity: 'UserProfile',
      entityId: Number(id),
      details: { deletedUserId: Number(id) },
    });
    return result;
  }
}
