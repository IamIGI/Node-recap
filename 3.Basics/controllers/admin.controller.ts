import { NextFunction, Request, Response } from 'express';
import productsService from '../services/products.service';
import { Product } from '../models/product.model';

const getAddProduct = (req: Request, res: Response, next: NextFunction) => {
  res.render('admin/add-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true,
  });
};

const postAddProduct = (req: Request, res: Response, next: NextFunction) => {
  const { title, imageUrl, price, description } = req.body as Product;
  productsService.save({ title, imageUrl, price, description });
  res.redirect('/');
};

const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  const products = await productsService.fetchAll();
  res.render('admin/products', {
    prods: products,
    pageTitle: 'Admin Products',
    path: '/admin/products',
  });
};

export default {
  getAddProduct,
  postAddProduct,
  getProducts,
};
