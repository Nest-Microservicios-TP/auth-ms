import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './modules/users/user.model';
import { envs } from './config';
import { Cart } from './modules/user-cart/user-cart.model';
import { UserCartModule } from './modules/user-cart/user-cart.module';

@Module({
  imports: [
     SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        dialect: 'postgres',
        host: envs.database_host,
        port: envs.database_port,
        username: envs.database_username,
        password: envs.database_pass,
        database: envs.database_name,
        models: [User, Cart],
        autoLoadModels: true,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    UserCartModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
