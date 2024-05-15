import fs from 'fs';
import path from 'path';
import { PostAddProductRequest, Product } from '../models/product.model';
import { v4 as uuidv4 } from 'uuid';
import cartService from './cart.service';

const p = path.join(
  path.dirname(require.main?.filename ?? ''),
  'data',
  'products.json'
);

async function save(newProduct: PostAddProductRequest) {
  const products = await fetchAll();

  if (!newProduct.id) {
    products.push({ ...newProduct, id: uuidv4() });
  } else {
    const existingProductIndex = products.findIndex(
      (prod) => prod.id === newProduct.id
    );

    if (existingProductIndex !== -1) {
      products[existingProductIndex] = newProduct as Product;
    }
  }

  fs.writeFile(p, JSON.stringify(products), (err) => console.log(err));
}

async function fetchAll(): Promise<Product[]> {
  if (!fs.existsSync(p)) {
    fs.writeFileSync(p, '[]', 'utf8');
    return [];
  }

  const fileContent = await fs.promises.readFile(p, 'utf8');

  if (fileContent) return JSON.parse(fileContent) as Product[];
  return [];
}

async function findById(id: string): Promise<Product | undefined> {
  const products = await fetchAll();

  return products.find((product) => product.id === id);
}

async function deleteById(id: string) {
  const products = await fetchAll();
  console.log(products);
  const product = products.find((prod) => prod.id === id);
  if (!product) {
    console.error('Product not found in products data: ' + id);
    return;
  }
  const updatedArrProducts = products.filter((prod) => prod.id !== id);
  fs.writeFile(p, JSON.stringify(updatedArrProducts), async (err) => {
    console.log(err);
    if (!err) {
      await cartService.deleteProduct(id, product.price);
    }
  });
}

export default {
  save,
  fetchAll,
  findById,
  deleteById,
};
