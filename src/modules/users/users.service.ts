import {
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { hashPassword } from 'src/helpers/bcrypt.helper';
import { User } from './user.model';
import { InjectModel } from '@nestjs/sequelize';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class UsersService {
  constructor(
        @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<CreateUserDto> {
    const { email } = createUserDto;

    //Hasheo la contraseña
    createUserDto.password = await hashPassword(createUserDto.password);

    //Verifico si el usuario existe
    // Verifico si el usuario existe
    const user = await this.userModel.findOne({ where: { email } });
    if (user) {
      if (!user.deletedAt) {
        throw new RpcException({
        message: `User already exists`,
        status: HttpStatus.BAD_REQUEST
      })
      }
      //Si el usuario tiene un deletedAt quiere decir que fue borrado
      //Osea que puedo usar su correo para crear otro usuario
      await this.userModel.destroy({ where: { email: user.email } });
    }

    //Creo el usuario
    return await this.userModel.create({ ...createUserDto });
  }

  async findAll(): Promise<CreateUserDto[]> {
    const users = await this.userModel.findAll({
      where: { deletedAt: null },
    });

    //Verifico si hay usuarios
    if (users.length === 0) throw new NotFoundException('Could Not Find Users');

    return users;
  }

  async findOne(id: number, getDeletes?: boolean): Promise<User> {
    const where = { id, deletedAt: null };
    if (getDeletes) delete where['deletedAt'];
    const user = await this.userModel.findOne({ where });
    if (!user) {
      throw new RpcException({
        message: `User Not Found`,
        status: HttpStatus.NOT_FOUND
      })
    };

    return user;
  }

  async findOneByEmail(
    email: string,
    getDeletes?: boolean,
  ): Promise<User> {
    const where = { email, deletedAt: null };
    if (getDeletes) delete where['deletedAt'];
    const user = await this.userModel.findOne({ where });
    if (!user) {
      throw new RpcException({
        message: `User Not Found`,
        status: HttpStatus.NOT_FOUND
      })
    };

    return user;
  }

  async update(id: number, updateUserDto: Partial<UpdateUserDto>, getDeletes?: boolean) {
    const user = await this.findOne(id, getDeletes);

    //Evito errores cuando se utiliza el mismo email dos veces
    if (updateUserDto.email !== undefined) {
      const isUsed = await this.userModel.findOne({
        where: { email: updateUserDto.email },
      });
      if (isUsed) {
        throw new RpcException({
        message: `Email Already Exists`,
        status: HttpStatus.BAD_REQUEST
      })
      };
    }

    await user.update(updateUserDto);
    await user.save()
    return user
  }

  async changeRole(id: number) {
    const user = await this.findOne(id);

    if (user.role === 'admin') {
      const newUser = this.update(id, { role: 'user' });
      return newUser;
    } else if (user.role === 'user') {
      const newUser = await this.update(id, { role: 'admin' });
      return newUser;
    } else {
      throw new RpcException({
        message: `SuperAdmin can't change role`,
        status: HttpStatus.BAD_REQUEST
      })
    }
  }

  async remove(id: number) {
    const user = await this.findOne(id, false);

    if (user.role === 'superadmin') {
     throw new RpcException({
        message: `SuperAdmin can't be deleted`,
        status: HttpStatus.BAD_REQUEST
      });
    }

    await this.update(id, { deletedAt: new Date() });
    return `${user.email} has been deleted`;
  }

  async restore(id: number) {
    const user = await this.update(id, { deletedAt: null }, true);
    return user;
  }



  //Funcion extra para crear un superadmin, la idea es que se use una sola vez al iniciar el proyecto
  async createSuperAdmin() {
    const email = 'superadmin@example.com';
    const password = 'supersecurepassword';
    const role = 'superadmin';

    // Verificamos si ya existe
    const existing = await this.userModel.findOne({ where: { email } });
    if (existing) {
      throw new RpcException({
        message: `SuperAdmin Already Exists`,
        status: HttpStatus.BAD_REQUEST
      })
    }

    const hashedPassword = await hashPassword(password);

    const superadmin = await this.userModel.create({
      email,
      password: hashedPassword,
      role,
    });

    return superadmin;
  }
}
