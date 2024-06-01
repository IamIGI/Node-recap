import { NextFunction } from 'express';
import { Request, Response } from 'express';

import cartService from '../services/cart.service';
import { CartProductItem } from '../models/cart.model';
import productsService from '../services/products.service';

const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  const products = await productsService.getProducts();
  if (!products) return;

  res.render('shop/product-list', {
    prods: products,
    pageTitle: 'All Products',
    path: '/products',
  });
};

const getProduct = async (req: Request, res: Response, next: NextFunction) => {
  const prodId = req.params.productId;
  const product = await productsService.getProductById(prodId);

  if (!product) {
    console.error('Product could not be found: ' + prodId);
    res.redirect('/');
    return;
  }

  res.render('shop/product-detail', {
    product: product,
    pageTitle: `${product.title}`,
    path: '/products',
  });
};

const getIndex = async (req: Request, res: Response, next: NextFunction) => {
  const products = await productsService.getProducts();
  if (!products) return;

  res.render('shop/index', {
    prods: products,
    pageTitle: 'Shop',
    path: '/',
  });
};

const getCart = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;
  const cart = await cartService.getCart(user);

  const cartProducts: CartProductItem[] = cart.map((cartItem) => {
    return { productData: cartItem.product, qty: cartItem.quantity };
  });

  res.render('shop/cart', {
    path: '/cart',
    pageTitle: 'Your Cart',
    products: cartProducts,
  });
};

const postCart = async (req: Request, res: Response, next: NextFunction) => {
  const prodId = req.body.productId;
  const user = req.user;
  //TODO: change hard coded quantity
  const cart = await cartService.addProduct(prodId, user, 1);
  console.log(cart);

  res.redirect('/cart');
};

const getOrders = async (req: Request, res: Response, next: NextFunction) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders',
  });
};

const getCheckout = async (req: Request, res: Response, next: NextFunction) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout',
  });
};

const postCartDeleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const prodId = req.body.productId;
  const user = req.user;

  await cartService.deleteProduct(prodId, user);
  res.redirect('/cart');
};

export default {
  getProducts,
  getProduct,
  getIndex,
  getCart,
  postCart,
  getCheckout,
  getOrders,
  postCartDeleteProduct,
};
