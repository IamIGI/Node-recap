import { NextFunction } from 'express';
import { Request, Response } from 'express';
import productsService from '../services/products.service';

const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  const products = await productsService.fetchAll();
  res.render('shop/product-list', {
    prods: products,
    pageTitle: 'All Products',
    path: '/products',
  });
};

const getIndex = async (req: Request, res: Response, next: NextFunction) => {
  const products = await productsService.fetchAll();
  res.render('shop/index', {
    prods: products,
    pageTitle: 'Shop',
    path: '/',
  });
};

const getCart = async (req: Request, res: Response, next: NextFunction) => {
  const products = await productsService.fetchAll();
  res.render('shop/cart', {
    path: '/cart',
    pageTitle: 'Your Cart',
  });
};

const getOrders = async (req: Request, res: Response, next: NextFunction) => {
  const products = await productsService.fetchAll();
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
export default {
  getProducts,
  getIndex,
  getCart,
  getCheckout,
  getOrders,
};
