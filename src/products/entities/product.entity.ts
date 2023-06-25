import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  OneToOne,
  OneToMany
} from 'typeorm';
import User from '../../users/entities/user.entity';
import Category from '../../categories/category.entity';
import Inventory from './inventory.entity';
import Discount from '../../discounts/discounts.entity';
import OrderProduct from '../../order/entities/orderProduct.entity';

@Entity()
class Product {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ unique: true })
  public name: string;

  @Column()
  public description: string;

  @Column()
  public SKU: string;

  @Column()
  public imageURL: string;

  @Column()
  public price: number;

  @ManyToOne(() => User, (user) => user.products, {
    onDelete: 'CASCADE'
  })
  public owner: User;

  @ManyToMany(() => Category, (category: Category) => category.products)
  @JoinTable()
  public categories: Category[];

  @OneToOne(() => Inventory, (inventory: Inventory) => inventory.product, {
    eager: true,
    cascade: true
  })
  public inventory: Inventory;

  @ManyToOne(() => Discount, (discount) => discount.products)
  public discount: Discount;

  @OneToMany(() => OrderProduct, (orderProduct) => orderProduct.product)
  public orderProducts: OrderProduct[];

  @CreateDateColumn({ type: 'timestamp' })
  public createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  public updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  public deletedAt: Date;
}

export default Product;
