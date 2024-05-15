import { PostAddProductRequest, Product } from '../models/product.model';
import { v4 as uuidv4 } from 'uuid';
import dbUtil from '../util/db.util';
import { FieldPacket } from 'mysql2';

async function save(newProduct: PostAddProductRequest) {
  const { title, price, imageUrl, description } = newProduct;
  const id = uuidv4();
  return dbUtil.connect.execute(
    `Insert into products (id, title, imageUrl, description, price) values (?, ?, ?, ?, ?)`,
    [id, title, imageUrl, description, price]
  );

  // const products = await fetchAll();

  // if (!newProduct.id) {
  //   products.push({ ...newProduct, id: uuidv4() });
  // } else {
  //   const existingProductIndex = products.findIndex(
  //     (prod) => prod.id === newProduct.id
  //   );

  //   if (existingProductIndex !== -1) {
  //     products[existingProductIndex] = newProduct as Product;
  //   }
  // }
}

async function fetchAll() {
  const [products, fieldData] = (await dbUtil.connect.execute(
    'select * from products'
  )) as [Product[], FieldPacket[]];

  return products;
}

async function findById(id: string): Promise<Product | undefined> {
  const [product, fieldData] = (await dbUtil.connect.execute(
    'select * from products where id = ?',
    [id]
  )) as unknown as [Product[], FieldPacket[]];

  return product[0];
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
}

export default {
  save,
  fetchAll,
  findById,
  deleteById,
};
