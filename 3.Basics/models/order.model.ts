import { Prisma } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export type OrderWithProducts = Prisma.OrderItemGetPayload<{
  include: { product: true };
}>;

export interface OrderProductForFrontend {
  orderItem: {
    quantity: number;
  };
  id: string;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  price: Decimal;
  imageUrl: string;
  description: string;
  userId: string;
}

export interface Order {
  id: string;
  products: OrderProductForFrontend[];
}
