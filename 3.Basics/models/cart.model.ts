import { Product } from '@prisma/client';

export interface CartProductItem {
  productData: Product;
  qty: number;
}

// export interface Cart {
//   products: CartProductItem[];
//   totalPrice: number;
// }
