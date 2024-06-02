import { PrismaClient, User } from '@prisma/client';
import { CartItem } from '../models/cart.model';
import { Order, OrderWithProducts } from '../models/order.model';
import orderUtil from '../utils/order.util';

const prisma = new PrismaClient();

async function createOrder(cart: CartItem[]) {
  const userId = cart[0].userId;
  try {
    const newOrder = await prisma.order.create({
      data: {
        user: {
          connect: { id: userId },
        },
      },
    });

    const orderItems = cart.map((cartItem) => {
      return {
        orderId: newOrder.id,
        productId: cartItem.productId,
        quantity: cartItem.quantity,
      };
    });

    await prisma.orderItem.createMany({
      data: orderItems,
    });
  } catch (e) {
    console.error('Creating order failed');
    console.error(e);
  }
}

async function getOrders(user: User): Promise<Order[]> {
  const orders = await prisma.order.findMany({ where: { userId: user.id } });
  const ordersIds = orders.map((orderItem) => orderItem.id);

  const ordersItems: OrderWithProducts[] = await prisma.orderItem.findMany({
    where: { orderId: { in: ordersIds } },
    include: { product: true },
  });

  const ordersDto = orders.map((order) => {
    return {
      id: order.id,
      products: orderUtil.getOrderProductItems(order.id, ordersItems),
    };
  });

  return ordersDto;
}

export default {
  createOrder,
  getOrders,
};
