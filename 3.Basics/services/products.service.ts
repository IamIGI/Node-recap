import fs from 'fs';
import path from 'path';
import { Product } from '../models/product.model';

const p = path.join(
  path.dirname(require.main?.filename ?? ''),
  'data',
  'products.json'
);

async function save(newProduct: Product) {
  const products = await fetchAll();
  products.push(newProduct);
  fs.writeFile(p, JSON.stringify(products), (err) => console.log(err));
}

async function fetchAll() {
  if (!fs.existsSync(p)) {
    fs.writeFileSync(p, '[]', 'utf8');
    return [];
  }

  const fileContent = await fs.promises.readFile(p, 'utf8');

  if (fileContent) return JSON.parse(fileContent);
}

export default {
  save,
  fetchAll,
};
