import { Module } from '@nestjs/common';
import { UserCartService } from './user-cart.service';
import { UserCartController } from './user-cart.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Cart } from './user-cart.model';

@Module({
  controllers: [UserCartController],
  providers: [UserCartService],
  imports: [SequelizeModule.forFeature([Cart])]
})
export class UserCartModule {}
