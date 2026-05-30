import { Body, Controller, Delete, Get, Param, Patch, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { ListUsersDto } from './dto/list-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from '../common/decorators/roles.decorator';

@Roles('ADMIN')
@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get()
  findAll(@Query() dto: ListUsersDto) {
    return this.users.findAll(dto);
  }

  @Get('stats')
  stats() {
    return this.users.stats();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.users.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.users.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.users.remove(id);
  }
}
