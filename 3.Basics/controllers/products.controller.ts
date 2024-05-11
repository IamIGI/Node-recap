import { NextFunction } from 'express';
import { Request, Response } from 'express';
import productsService from '../services/products.service';

const getAddProduct = (req: Request, res: Response, next: NextFunction) => {
  res.render('add-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true,
  });
};

const postAddProduct = (req: Request, res: Response, next: NextFunction) => {
  productsService.save({ title: req.body.title });

  res.redirect('/');
};

const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  const products = await productsService.fetchAll();
  res.render('shop', {
    prods: products,
    pageTitle: 'Shop',
    path: '/',
    hasProducts: products.length > 0,
    activeShop: true,
    productCSS: true,
  });
};

export default {
  getAddProduct,
  postAddProduct,
  getProducts,
};
