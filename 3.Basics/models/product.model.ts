export interface Product {
  id: string;
  title: string;
  imageUrl: string;
  description: string;
  price: number;
}

export interface PostAddProductRequest {
  id: string | null;
  title: string;
  imageUrl: string;
  description: string;
  price: number;
}
