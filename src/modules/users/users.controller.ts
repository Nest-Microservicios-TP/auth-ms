import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern({ cmd: 'createUser' })
  create(@Payload() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @MessagePattern({ cmd: 'findAllUsers' })
  findAll() {
    return this.usersService.findAll();
  }

  @MessagePattern({ cmd: 'findUserById' })
  findOne(@Payload() id: number) {
    return this.usersService.findOne(id);
  }

  @MessagePattern({ cmd: 'updateUser' })
  update(@Payload() payload: { id: number; data: UpdateUserDto }) {
    return this.usersService.update(payload.id, payload.data);
  }

  @MessagePattern({ cmd: 'changeUserRole' })
  changeRole(@Payload() id: number) {
    return this.usersService.changeRole(id);
  }

  @MessagePattern({ cmd: 'removeUser' })
  remove(@Payload() id: number) {
    return this.usersService.remove(id);
  }

  @MessagePattern({ cmd: 'restoreUser' })
  restore(@Payload() id: number) {
    return this.usersService.restore(id);
  }

  @MessagePattern({ cmd: 'createSuperAdmin' })
  superadmin() {
    return this.usersService.createSuperAdmin();
  }
}
