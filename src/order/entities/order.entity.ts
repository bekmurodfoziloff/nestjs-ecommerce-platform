import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn
} from 'typeorm';
import User from '../../users/entities/user.entity';
import OrderProduct from './orderProduct.entity';
import { Status } from '../../utils/enums/orderStatus.enum';

@Entity()
class Order {
  @PrimaryGeneratedColumn()
  public id: number;

  @ManyToOne(() => User, (user) => user.orders, {
    onDelete: 'CASCADE'
  })
  public customer: User;

  @OneToMany(() => OrderProduct, (orderProduct) => orderProduct.order, {
    cascade: true
  })
  public orderProducts: OrderProduct[];

  @Column()
  public totalPrice: number;

  @Column({ type: 'enum', enum: Status, default: Status.pending })
  public status: string;

  @CreateDateColumn({ type: 'timestamp' })
  public createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  public updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  public deletedAt: Date;
}

export default Order;
