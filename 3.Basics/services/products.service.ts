import { Product } from '@prisma/client';
import { error } from 'console';
import { AddProduct, UpdateProduct } from '../models/product.model';

import { PrismaClient, User } from '@prisma/client';
import fileUtil from '../utils/file.util';
import globalConfig from '../config/global.config';
const prisma = new PrismaClient();

async function deleteImage(productId: string, userId: string) {
  const oldProduct = await prisma.product.findFirst({
    where: { id: productId, userId },
  });
  if (!oldProduct) throw Error('Could not find product while updating it');
  fileUtil.deleteFile(oldProduct.imageUrl);
}

async function getProducts(
  page?: number
): Promise<{ products: Product[]; totalItems: number }> {
  let products: Product[] = [];
  let totalItems: number = 0;
  try {
    totalItems = await prisma.product.count();
    if (page) {
      products = await prisma.product.findMany({
        skip: (page - 1) * globalConfig.itemsPerPage,
        take: globalConfig.itemsPerPage,
      });
    } else {
      products = await prisma.product.findMany();
    }
  } catch (error) {
    console.log(error);
  }
  return { products, totalItems };
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
        imageUrl: `/${imageUrl}`,
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
  product: UpdateProduct,
  user: User
): Promise<Product | undefined> {
  try {
    if (!product.imageUrl) {
      delete product.imageUrl;
    } else {
      product.imageUrl = `/${`/${product.imageUrl}`}`;

      await deleteImage(product.id, user.id);
    }

    const updatedProduct = await prisma.product.update({
      where: { id: product.id, userId: user.id },
      data: product,
    });
    return updatedProduct;
  } catch (e) {
    console.error('Error occurred during update product table');
    console.error(e);
  }
}

async function deleteProductById(
  id: string,
  user: User
): Promise<Product | undefined> {
  try {
    await deleteImage(id, user.id);

    const product = await prisma.product.delete({
      where: { id, userId: user.id },
    });

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
  deleteProductById,
};
