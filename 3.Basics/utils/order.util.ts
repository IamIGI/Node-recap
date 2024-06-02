import {
  OrderProductForFrontend,
  OrderWithProducts,
} from '../models/order.model';

function getOrderProductItems(
  orderId: string,
  ordersItems: OrderWithProducts[]
): OrderProductForFrontend[] {
  const productItems = ordersItems
    .filter((orderItem) => orderItem.orderId === orderId) // Filter items that match the orderId
    .map((orderItem) => ({
      ...orderItem.product,
      orderItem: { quantity: orderItem.quantity },
    }));

  return productItems;
}

export default {
  getOrderProductItems,
};
