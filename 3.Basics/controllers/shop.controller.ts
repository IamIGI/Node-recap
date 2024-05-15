import { NextFunction } from 'express';
import { Request, Response } from 'express';
import productsService from '../services/products.service';
import cartService from '../services/cart.service';
import { CartProductItem } from '../models/cart.model';

const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  const products = await productsService.fetchAll();
  res.render('shop/product-list', {
    prods: products,
    pageTitle: 'All Products',
    path: '/products',
  });
};

const getProduct = async (req: Request, res: Response, next: NextFunction) => {
  const prodId = req.params.productId;
  const product = await productsService.findById(prodId);
  res.render('shop/product-detail', {
    product: product,
    pageTitle: `${product?.title}`,
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
  const cart = await cartService.getCart();
  const products = await productsService.fetchAll();
  const cartProducts: CartProductItem[] = [];

  if (cart && products.length > 0) {
    products.forEach((productItem) => {
      const cartProduct = cart.products.find(
        (prod) => prod.productData.id === productItem.id
      );
      if (cartProduct) {
        cartProducts.push({ productData: productItem, qty: cartProduct.qty });
      }
    });
  }

  res.render('shop/cart', {
    path: '/cart',
    pageTitle: 'Your Cart',
    products: cartProducts,
  });
};

const postCart = async (req: Request, res: Response, next: NextFunction) => {
  const prodId = req.body.productId;

  const product = await productsService.findById(prodId);

  if (product) await cartService.addProduct(product);

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
  const product = await productsService.findById(prodId);
  if (product) {
    await cartService.deleteProduct(prodId, product.price);
    res.redirect('/cart');
  }
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
