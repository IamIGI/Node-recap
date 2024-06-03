import { NextFunction } from 'express';
import { Request, Response } from 'express';

import cartService from '../services/cart.service';
import { CartProductItemForFrontend } from '../models/cart.model';
import productsService from '../services/products.service';
import orderService from '../services/order.service';

const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  const products = await productsService.getProducts();
  if (!products) return;

  res.render('shop/product-list', {
    prods: products,
    pageTitle: 'All Products',
    path: '/products',
    isAuthenticated: req.session.isLoggedIn,
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
    isAuthenticated: req.session.isLoggedIn,
  });
};

const getIndex = async (req: Request, res: Response, next: NextFunction) => {
  const products = await productsService.getProducts();
  if (!products) return;

  res.render('shop/index', {
    prods: products,
    pageTitle: 'Shop',
    path: '/',
    isAuthenticated: req.session.isLoggedIn,
  });
};

const getCart = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;
  const cart = await cartService.getCart(user);

  const cartProducts: CartProductItemForFrontend[] = cart.map((cartItem) => {
    return { ...cartItem.product, cartItem: { quantity: cartItem.quantity } };
  });

  res.render('shop/cart', {
    path: '/cart',
    pageTitle: 'Your Cart',
    products: cartProducts,
    isAuthenticated: req.session.isLoggedIn,
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
  const orders = await orderService.getOrders(req.user);

  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders',
    orders: orders,
    isAuthenticated: req.session.isLoggedIn,
  });
};

const getCheckout = async (req: Request, res: Response, next: NextFunction) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout',
    isAuthenticated: req.session.isLoggedIn,
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

const postOrder = async (req: Request, res: Response, next: NextFunction) => {
  const cart = await cartService.getCart(req.user);
  console.log(cart);

  await orderService.createOrder(cart);
  await cartService.clearCart(req.user);

  res.redirect('/orders');
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
  postOrder,
};
