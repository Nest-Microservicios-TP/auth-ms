import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  DataType,
} from 'sequelize-typescript';

@Table
export class User extends Model<User> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  email: string;

  @Column
  password: string;

  @Column({defaultValue: 'client' })
  role?: string;

  @Column({ type: DataType.DATE, allowNull: true })
  deletedAt?: Date;
}
