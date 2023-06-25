import {
  Column,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn
} from 'typeorm';
import Product from '../products/entities/product.entity';
import User from '../users/entities/user.entity';

@Entity()
class Category {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: string;

  @Column()
  public description: string;

  @ManyToOne(() => User, (user) => user.categories, {
    onDelete: 'CASCADE'
  })
  public owner: User;

  @ManyToMany(() => Product, (product: Product) => product.categories, {
    onDelete: 'CASCADE'
  })
  public products: Product[];

  @CreateDateColumn({ type: 'timestamp' })
  public createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  public updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  public deletedAt: Date;
}

export default Category;
