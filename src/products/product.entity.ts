import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable
} from 'typeorm';
import User from '../users/user.entity';
import Category from '../categories/category.entity';

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

  @CreateDateColumn({ type: 'timestamp' })
  public createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  public updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  public deletedAt: Date;
}

export default Product;
