import { NextFunction } from 'express';
import { Request, Response } from 'express';

import path from 'path';
import pdfDocument from 'pdfkit';
import fs from 'fs';

import cartService from '../services/cart.service';
import { CartProductItemForFrontend } from '../models/cart.model';
import productsService from '../services/products.service';
import orderService from '../services/order.service';
import sessionUtil from '../utils/session.util';
import multerConfig from '../config/multer.config';
import globalConfig from '../config/global.config';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripePublicKey = process.env.STRIPE_PUBLIC_KEY;
const stripe = require('stripe')(stripeSecretKey);

const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  const page = Number(req.query.page || 1);

  const products = await productsService.getProducts(page);
  if (!products) return;

  res.render('shop/product-list', {
    prods: products.products,
    pageTitle: 'All Products',
    path: '/products',
    currentPage: page,
    hasNextPage: globalConfig.itemsPerPage * page < products.totalItems,
    hasPreviousPage: page > 1,
    nextPage: page + 1,
    previousPage: page - 1,
    lastPage: Math.ceil(products.totalItems / globalConfig.itemsPerPage),
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
  const page = Number(req.query.page || 1);

  const products = await productsService.getProducts(page);
  if (!products) return;

  res.render('shop/index', {
    prods: products.products,
    pageTitle: 'Shop',
    path: '/',
    currentPage: page,
    hasNextPage: globalConfig.itemsPerPage * page < products.totalItems,
    hasPreviousPage: page > 1,
    nextPage: page + 1,
    previousPage: page - 1,
    lastPage: Math.ceil(products.totalItems / globalConfig.itemsPerPage),
  });
};

const getCart = async (req: Request, res: Response, next: NextFunction) => {
  const user = sessionUtil.getUser(req);
  const cart = await cartService.getCart(user);

  const cartProducts: CartProductItemForFrontend[] = cart.map((cartItem) => {
    return { ...cartItem.product, quantity: cartItem.quantity };
  });

  res.render('shop/cart', {
    path: '/cart',
    pageTitle: 'Your Cart',
    products: cartProducts,
  });
};

const postCart = async (req: Request, res: Response, next: NextFunction) => {
  const prodId = req.body.productId;

  const user = sessionUtil.getUser(req);

  //TODO: change hard coded quantity
  const cart = await cartService.addProduct(prodId, user, 1);

  res.redirect('/cart');
};

const getOrders = async (req: Request, res: Response, next: NextFunction) => {
  const user = sessionUtil.getUser(req);
  const orders = await orderService.getOrders(user);

  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders',
    orders: orders,
  });
};

const getCheckout = async (req: Request, res: Response, next: NextFunction) => {
  const user = sessionUtil.getUser(req);
  const cart = await cartService.getCart(user);

  const cartProducts: CartProductItemForFrontend[] = cart.map((cartItem) => {
    return { ...cartItem.product, quantity: cartItem.quantity };
  });

  console.log(cartProducts);
  let total: number = 0;
  cartProducts.forEach((p) => (total = Number(p.quantity) + Number(p.price)));

  const orderedProducts = cartProducts.map((p) => {
    return {
      quantity: p.quantity,
      price_data: {
        currency: 'usd',
        unit_amount: Number(p.price) * 100,
        product_data: {
          name: p.title,
          description: p.description,
        },
      },
    };
  });

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: orderedProducts,
      customer_email: user.email,
      success_url: req.protocol + '://' + req.get('host') + '/checkout/success', //http://localhost:3000/checkout/success
      cancel_url: req.protocol + '://' + req.get('host') + '/checkout/cancel',
    });

    res.render('shop/checkout', {
      path: '/checkout',
      pageTitle: 'Checkout',
      products: cartProducts,
      totalSum: total,
      sessionId: session.id,
      stripePublicKey,
    });
  } catch (error) {
    return next(error);
  }
};

const getCheckoutSuccess = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = sessionUtil.getUser(req);
  const cart = await cartService.getCart(user);

  await orderService.createOrder(cart);
  await cartService.clearCart(user);

  res.redirect('/orders');
};

const postCartDeleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const prodId = req.body.productId;
  const user = sessionUtil.getUser(req);

  await cartService.deleteProduct(prodId, user);
  res.redirect('/cart');
};

const postOrder = async (req: Request, res: Response, next: NextFunction) => {
  const user = sessionUtil.getUser(req);
  const cart = await cartService.getCart(user);

  await orderService.createOrder(cart);
  await cartService.clearCart(user);

  res.redirect('/orders');
};

const getInvoice = async (req: Request, res: Response, next: NextFunction) => {
  const orderId = req.params.orderId;
  const user = sessionUtil.getUser(req);

  const order = await orderService.getOrder(orderId, user);
  if (!order) {
    return next(new Error('No order found, or user unauthorized'));
  }

  const invoiceName = `invoice-${orderId}.pdf`;
  const invoicePath = path.join(
    process.cwd(),
    multerConfig.invoicesFolder,
    invoiceName
  );
  res.setHeader('Content-Type', 'application/pdf');
  //inline - open in browser, attachment - save in
  res.setHeader('Content-Disposition', `inline; filename=${invoiceName}`);

  const pdfDoc = new pdfDocument();
  pdfDoc.pipe(fs.createWriteStream(invoicePath));
  pdfDoc.pipe(res);
  pdfDoc.fontSize(26).text('Invoice', { underline: true });

  pdfDoc.text('-------------------------------');
  let totalPrice = 0;
  order.products.forEach((product) => {
    const { title, orderItem, description, price, id } = product;
    totalPrice += orderItem.quantity * price.toNumber();
    pdfDoc.fontSize(14).text(`${title} - ${orderItem.quantity} x $${price}`);
  });

  pdfDoc.text('-------------------------------');
  pdfDoc.fontSize(20).text(`Total price: ${totalPrice}`);

  pdfDoc.end();

  // res.sendFile(invoicePath);
};

export default {
  getProducts,
  getProduct,
  getIndex,
  getCart,
  postCart,
  getCheckout,
  getCheckoutSuccess,
  getOrders,
  postCartDeleteProduct,
  postOrder,
  getInvoice,
};
