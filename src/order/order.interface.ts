import { Role } from '../utils/enums/role.enum';
import Permission from '../utils/permission.type';

export interface Customer {
  id?: number;
  email: string;
  userName: string;
  firstName: string;
  lastName: string;
  password: string;
  telephone: string;
  avatar: string;
  currentHashedRefreshToken?: string;
  roles: Role[];
  permissions: Permission[];
  products: Product[];
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface Product {
  id?: number;
  name: string;
  description: string;
  SKU: string;
  imageURL: string;
  price: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface OrderProducts {
  id?: number;
  product: Product;
  quantity: number;
  subTotalPrice: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface Cart {
  id?: number;
  customer: Customer;
  orderProducts: OrderProducts[];
  totalPrice: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
