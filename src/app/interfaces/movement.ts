import { Product } from './product';

export interface Movement {
  _id?: string;
  product: string;  // Cambiar 'product' a 'productId'
  type: 'entrada' | 'salida';
  quantity: number;
  date?: Date;
  note?: string;
  createdAt?: Date;
  updatedAt?: Date;
}


