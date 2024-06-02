import { Product } from '@prisma/client';

export interface CartProductItemForFrontend extends Product {
  cartItem: {
    quantity: number;
  };
}
[];

export interface CartItem {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  quantity: number;
  productId: string;
  userId: string;
  product: Product;
}

// export interface Cart {
//   products: CartProductItem[];
//   totalPrice: number;
// }
