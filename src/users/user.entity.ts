import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  OneToOne,
  JoinColumn
} from 'typeorm';
import { Exclude } from 'class-transformer';
import Product from '../products/product.entity';
import Category from '../categories/category.entity';
import { Role } from '../utils/enums/role.enum';
import Permission from '../utils/permission.type';
import Address from './address.entity';
import Discount from '../discounts/discounts.entity';

@Entity()
class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ unique: true })
  public email: string;

  @Column({ nullable: true })
  public userName: string;

  @Column()
  public firstName: string;

  @Column()
  public lastName: string;

  @Column()
  @Exclude()
  public password: string;

  @Column({ nullable: true })
  public telephone: string;

  @Column({ nullable: true })
  public avatar: string;

  @OneToOne(() => Address, (address) => address.user, {
    eager: true,
    cascade: true
  })
  @JoinColumn()
  public address: Address;

  @Column({ nullable: true })
  @Exclude()
  public currentHashedRefreshToken?: string;

  @Column({ type: 'enum', array: true, enum: Role, default: [Role.User] })
  public roles: Role[];

  @Column({ type: 'enum', array: true, enum: Permission, default: [] })
  public permissions: Permission[];

  @OneToMany(() => Product, (product) => product.owner)
  public products: Product[];

  @OneToMany(() => Category, (category) => category.owner)
  public categories: Category[];

  @OneToMany(() => Discount, (discount) => discount.owner)
  public discounts: Discount[];

  @CreateDateColumn({ type: 'timestamp' })
  public createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  public updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  public deletedAt: Date;
}

export default User;
