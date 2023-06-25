import {
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn
} from 'typeorm';
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

  @OneToOne(() => User, (user) => user.address, {
    onDelete: 'CASCADE'
  })
  @JoinColumn()
  public user?: User;

  @CreateDateColumn({ type: 'timestamp' })
  public createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  public updatedAt?: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  public deletedAt?: Date;
}

export default Address;
