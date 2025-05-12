import { Category } from './category';

export interface Product {
  _id?: string;
  name: string;
  description?: string;
  category: string | Category;
  stock: number;
  price: number;
  createdAt?: Date;
  updatedAt?: Date;
}
