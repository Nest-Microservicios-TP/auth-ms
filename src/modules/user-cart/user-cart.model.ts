import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  DataType,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { User } from '../users/user.model';

@Table
export class Cart extends Model<Cart> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  idProduct: number;

  @ForeignKey(() => User)
  @Column
  idUser: number;

  @BelongsTo(() => User)
  user: User;

  @Column
  quantity: number;

  @Column({ type: DataType.DATE, allowNull: true })
  deletedAt?: Date;
}

