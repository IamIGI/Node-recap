import { PrismaClient, User } from '@prisma/client';
import { CartItem } from '../models/cart.model';

const prisma = new PrismaClient();

async function getCart(user: User): Promise<CartItem[]> {
  const cartItems = await prisma.cartItem.findMany({
    where: { userId: user.id },
    include: { product: true },
  });

  console.log('Returning items for given Cart');
  return cartItems;
}

async function addProduct(prodId: string, user: User, quantity: number) {
  try {
    console.log(prodId);
    console.log(user);

    const product = await prisma.product.findFirst({ where: { id: prodId } });
    if (!product) throw new Error('Given product do not exists');

    const productExists = await prisma.cartItem.findFirst({
      where: { AND: [{ userId: user.id }, { productId: prodId }] },
    });

    if (productExists) {
      const newQuantity = productExists.quantity + quantity;

      await prisma.cartItem.update({
        where: { id: productExists.id },
        data: { quantity: newQuantity },
      });
    } else {
      //add new product to cart
      await prisma.cartItem.create({
        data: {
          quantity,
          product: {
            connect: { id: product.id },
          },
          user: {
            connect: { id: user.id },
          },
        },
      });
    }
    console.log('Product added to cart sucessfully');
    return await getCart(user);
  } catch (e) {
    console.log(e);
  }
}

async function deleteProduct(id: string, user: User) {
  //TODO: we do not update price yet
  const product = await prisma.product.findFirst({ where: { id } });
  let cart = await getCart(user);

  if (cart.length === 0)
    throw new Error('Could not delete product, cart is empty already: ' + id);
  if (!product)
    throw new Error(
      'Could not find given product while deleting from cart: ' + id
    );

  try {
    await prisma.cartItem.findFirst({
      where: { AND: [{ userId: user.id }, { productId: id }] },
    });

    await prisma.cartItem.delete({
      where: { productId: id, userId: user.id },
    });

    cart = cart.filter((cartItem) => cartItem.productId !== id);
  } catch (e) {
    console.log(e);
  }

  return cart;
}

async function clearCart(user: User) {
  try {
    await prisma.cartItem.deleteMany({
      where: { userId: user.id },
    });
  } catch (e) {
    console.warn('Could not clear the user cart: ' + user.id);
    console.error(e);
  }
}

export default {
  addProduct,
  deleteProduct,
  getCart,
  clearCart,
};
