import {
  Entity,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn
} from 'typeorm';
import Product from '../../products/entities/product.entity';
import Order from './order.entity';

@Entity()
class OrderProduct {
  @PrimaryGeneratedColumn()
  public id: number;

  @ManyToOne(() => Product, (product) => product.orderProducts, {
    onDelete: 'CASCADE'
  })
  public product: Product;

  @Column()
  public quantity: number;

  @Column()
  public subTotalPrice: number;

  @ManyToOne(() => Order, (order) => order.orderProducts, {
    onDelete: 'CASCADE'
  })
  public order: Order;

  @CreateDateColumn({ type: 'timestamp' })
  public createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  public updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  public deletedAt: Date;
}

export default OrderProduct;
