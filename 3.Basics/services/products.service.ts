import ProductModel, {
  PostAddProductRequest,
  Product,
} from '../models/product.model';
import { v4 as uuidv4 } from 'uuid';

async function getProducts(): Promise<Product[]> {
  const productsModel = await ProductModel.findAll();

  return productsModel.map((productItem) => productItem.dataValues);
}

async function getProductById(id: string): Promise<Product> {
  const productsModel = await ProductModel.findAll({ where: { id } });

  return productsModel[0].dataValues;
}

async function addProduct(product: PostAddProductRequest) {
  const { title, imageUrl, price, description } = product;
  try {
    await ProductModel.create({
      id: uuidv4(),
      title,
      imageUrl,
      price,
      description,
    });
  } catch (e) {
    console.error(e);
  }
}

async function updateProduct(product: Product) {
  try {
    (await ProductModel.findAll({ where: { id: product.id } }))[0].update(
      product
    );
  } catch (e) {
    console.error(e);
  }
}

async function destroyProductById(id: string) {
  try {
    (await ProductModel.findAll({ where: { id } }))[0].destroy();
  } catch (e) {
    console.error(e);
  }
}

export default {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  destroyProductById,
};
