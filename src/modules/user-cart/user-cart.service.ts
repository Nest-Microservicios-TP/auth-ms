import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserCartDto } from './dto/create-user-cart.dto';
import { UpdateUserCartDto } from './dto/update-user-cart.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Cart } from './user-cart.model';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class UserCartService {


  constructor(
    @InjectModel(Cart)
    private cartModel: typeof Cart
  ) { }

  async create(createUserCartDto: CreateUserCartDto) {
    return await this.cartModel.create(createUserCartDto)
  }

  async findAll() {
    const carts = await this.cartModel.findAll()

    if (carts.length === 0) {
      throw new RpcException({
        message: `Carts Not Found`,
        status: HttpStatus.NOT_FOUND
      })
    }

    return carts;
  }

  async findOne(id: number) {
    const cart = await this.cartModel.findOne({ where: { id } })

    if (!cart) {
      throw new RpcException({
        message: `Cart Not Found`,
        status: HttpStatus.NOT_FOUND
      })
    }

    return cart
  }

  async update(id: number, updateUserCartDto: UpdateUserCartDto) {

    const {id: __, ...data} = updateUserCartDto

    if (!updateUserCartDto) {
      throw new RpcException({
        message: `Send a valid Dto`,
        status: HttpStatus.BAD_REQUEST
      })
    }
    
    const cart = await this.findOne(id)
    
    await cart.update(data)
    await cart.save()

    return cart
  }

  async remove(id: number) {
    await this.findOne(id)

    return await this.update(id, {deletedAt: new Date()})
  }
}
