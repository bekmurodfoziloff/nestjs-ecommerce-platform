import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn
} from 'typeorm';
import Product from './product.entity';

@Entity()
class Inventory {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public quantity: number;

  @OneToOne(() => Product, (product) => product.inventory, {
    onDelete: 'CASCADE'
  })
  @JoinColumn()
  public product?: Product;

  @CreateDateColumn({ type: 'timestamp' })
  public createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  public updatedAt?: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  public deletedAt?: Date;
}

export default Inventory;
