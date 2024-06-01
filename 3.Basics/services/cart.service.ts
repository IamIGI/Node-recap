// import path from 'path';
// import fs from 'fs';
import { connect } from 'http2';
import { CartProductItem } from '../models/cart.model';

import { PrismaClient, Product, User } from '@prisma/client';
const prisma = new PrismaClient();

// const p = path.join(
//   path.dirname(require.main?.filename ?? ''),
//   'data',
//   'cart.json'
// );

// const intiData = { products: [], totalPrice: 0 };

// async function fetchAll(): Promise<Cart> {
//   if (!fs.existsSync(p)) {
//     fs.writeFileSync(p, '[]', 'utf8');
//     return intiData;
//   }

//   const fileContent = await fs.promises.readFile(p, 'utf8');

//   if (fileContent) return JSON.parse(fileContent) as Cart;
//   return intiData;
// }

async function getCart(user: User) {
  const cartItems = await prisma.cartItem.findMany({
    where: { userId: user.id },
    include: { product: true },
  });
  console.log('Returning items for given Cart');
  return cartItems;
}

async function addProduct(prodId: string, user: User, quantity: number) {
  try {
    const product = await prisma.product.findFirst({ where: { id: prodId } });
    if (!product) throw new Error('Given product do not exists');

    //TODO: check for cartItem in cart, if exists, increase quantity

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

export default {
  addProduct,
  deleteProduct,
  getCart,
};
