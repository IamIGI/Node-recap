import path from 'path';
import fs from 'fs';
import { Cart, CartProductItem } from '../models/cart.model';
import { Product } from '../models/product.model';

const p = path.join(
  path.dirname(require.main?.filename ?? ''),
  'data',
  'cart.json'
);

const intiData = { products: [], totalPrice: 0 };

async function fetchAll(): Promise<Cart> {
  if (!fs.existsSync(p)) {
    fs.writeFileSync(p, '[]', 'utf8');
    return intiData;
  }

  const fileContent = await fs.promises.readFile(p, 'utf8');

  if (fileContent) return JSON.parse(fileContent) as Cart;
  return intiData;
}

async function addProduct(newProduct: Product) {
  const cart = await fetchAll();

  const existingProductIndex = cart.products.findIndex(
    (cartItem) => cartItem.productData.id === newProduct.id
  );

  const existingProduct = cart.products[existingProductIndex];

  let updatedProduct: CartProductItem;
  if (existingProduct) {
    updatedProduct = { ...existingProduct };
    updatedProduct.qty += 1;
    cart.products = [...cart.products];
    cart.products[existingProductIndex] = updatedProduct;
  } else {
    updatedProduct = { productData: newProduct, qty: 1 };
    cart.products = [...cart.products, updatedProduct];
  }

  cart.totalPrice += Number(newProduct.price);

  fs.writeFile(p, JSON.stringify(cart), (err) => console.log(err));
}

async function deleteProduct(id: string, productPrice: number) {
  const cart = await fetchAll();
  if (cart.products.length === 0) return;
  const updatedCart = { ...cart };
  const product = updatedCart.products.find(
    (prod) => prod.productData.id === id
  );

  if (!product) {
    console.error('Product not found in cart:' + id);
    return;
  }

  const productQty = product.qty;

  updatedCart.totalPrice = updatedCart.totalPrice - productPrice * productQty;
  updatedCart.products = updatedCart.products.filter(
    (prod) => prod.productData.id !== id
  );

  fs.writeFile(p, JSON.stringify(updatedCart), (err) => console.log(err));
}

async function getCart() {
  const cartProducts = await fetchAll();
  if (cartProducts.products.length === 0) return null;
  return cartProducts;
}

export default { addProduct, deleteProduct, getCart };
