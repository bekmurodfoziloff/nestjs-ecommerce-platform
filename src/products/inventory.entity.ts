import { Column, Entity, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import Product from '../products/product.entity';

@Entity()
class Inventory {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public quantity: number;

  @OneToOne(() => Product, (product) => product.inventory)
  public product?: Product;
}

export default Inventory;
