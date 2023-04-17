import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import User from './user.entity';

@Entity()
class Address {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public street: string;

  @Column()
  public city: string;

  @Column()
  public country: string;

  @Column()
  public postalCode: string;

  @Column()
  public telephone: string;

  @Column()
  public mobile: string;

  @OneToOne(() => User, (user) => user.address)
  public user?: User;
}

export default Address;
