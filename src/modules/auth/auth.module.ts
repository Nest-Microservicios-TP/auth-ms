import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersService } from '../users/users.service';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { envs } from 'src/config';

@Module({
  imports: [JwtModule.register({
    global: true,
    secret: envs.token || 'secreto',
    signOptions: { expiresIn: "1d" },
  }),
    UsersModule],
  providers: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}
