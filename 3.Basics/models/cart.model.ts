import { Product } from './product.model';

export interface CartProductItem {
  productData: Product;
  qty: number;
}

export interface Cart {
  products: CartProductItem[];
  totalPrice: number;
}
