import { Product } from '@prisma/client';

export interface AddProduct
  extends Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'userId'> {}

export interface UpdateProduct
  extends Omit<Product, 'createdAt' | 'updatedAt' | 'userId'> {}
