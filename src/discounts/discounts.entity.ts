import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany
} from 'typeorm';
import User from '../users/entities/user.entity';
import Product from '../products/entities/product.entity';

@Entity()
class Discount {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: string;

  @Column()
  public description: string;

  @Column()
  public discountPercent: number;

  @Column()
  public active: boolean;

  @ManyToOne(() => User, (user) => user.discounts, {
    onDelete: 'CASCADE'
  })
  public owner: User;

  @OneToMany(() => Product, (product) => product.discount)
  public products: Product[];

  @CreateDateColumn({ type: 'timestamp' })
  public createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  public updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  public deletedAt: Date;
}

export default Discount;
