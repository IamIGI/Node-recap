import { Product } from '@prisma/client';
import { error } from 'console';
import { AddProduct, UpdateProduct } from '../models/product.model';

import { PrismaClient, User } from '@prisma/client';
const prisma = new PrismaClient();

async function getProducts(): Promise<Product[]> {
  const products = await prisma.product.findMany();

  return products;
}
async function getProductsByUserId(user: User): Promise<Product[]> {
  const products = await prisma.product.findMany({
    where: { userId: user.id },
  });

  return products;
}

async function getProductById(id: string): Promise<Product> {
  const products = await prisma.product.findMany({ where: { id } });

  if (products.length === 0)
    throw error('Product with given id do not exists, id: ', id);
  return products[0];
}

/**Add product by user */
async function addProduct(
  product: AddProduct,
  user: User
): Promise<Product | undefined> {
  const { title, imageUrl, price, description } = product;
  try {
    const newProduct = await prisma.product.create({
      data: {
        title,
        imageUrl,
        price,
        description,
        user: { connect: { id: user.id } },
      },
    });

    return newProduct;
  } catch (e) {
    console.error(e);
  }
}

async function updateProduct(
  product: UpdateProduct
): Promise<Product | undefined> {
  try {
    const updatedProduct = await prisma.product.update({
      where: { id: product.id },
      data: product,
    });

    return updatedProduct;
  } catch (e) {
    console.error(e);
  }
}

async function destroyProductById(id: string): Promise<Product | undefined> {
  try {
    const product = await prisma.product.delete({ where: { id } });

    return product;
  } catch (e) {
    console.error(e);
  }
}

export default {
  getProducts,
  getProductsByUserId,
  getProductById,
  addProduct,
  updateProduct,
  destroyProductById,
};
