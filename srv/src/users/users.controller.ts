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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user-decorator';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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
    @Query('status') status?: 'online' | 'offline',
  ) {
    this.checkAdmin(adminUser);
    const parsedRoleId = roleId ? Number(roleId) : undefined;
    return await this.usersService.findAll(search, parsedRoleId, status);
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
  ) {
    this.checkAdmin(adminUser);
    return await this.usersService.create(createUserDto);
  }

  @Put(':id')
  async updateUser(
    @CurrentUser() adminUser: any,
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    this.checkAdmin(adminUser);
    return await this.usersService.update(Number(id), updateUserDto);
  }

  @Delete(':id')
  async deleteUser(@CurrentUser() adminUser: any, @Param('id') id: string) {
    this.checkAdmin(adminUser);
    return await this.usersService.delete(Number(id));
  }
}
