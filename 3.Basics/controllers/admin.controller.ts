import { NextFunction, Request, Response } from 'express';
import productsService from '../services/products.service';

import { AddProduct } from '../models/product.model';

const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;
  const products = await productsService.getProductsByUserId(user);

  res.render('admin/products', {
    prods: products,
    pageTitle: 'Admin Products',
    path: '/admin/products',
    isAuthenticated: req.session.isLoggedIn,
  });
};

const getAddProduct = (req: Request, res: Response, next: NextFunction) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    isAuthenticated: req.session.isLoggedIn,
  });
};

const postAddProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { title, imageUrl, price, description } = req.body as AddProduct;
  const user = req.user;

  await productsService.addProduct(
    {
      title,
      imageUrl,
      price,
      description,
    },
    user
  );
  res.redirect('/admin/products');
};

const getEditProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const editMode = (req.query.edit as string) === 'true';
  if (!editMode) return res.redirect('/');

  const prodId = req.params.productId as string;
  const product = await productsService.getProductById(prodId);

  if (!product) {
    console.error(`Product could not be found, prodId ${prodId}`);
    return res.redirect('/admin/products');
  }

  res.render('admin/edit-product', {
    pageTitle: 'Edit Product',
    path: '/admin/edit-product',
    editing: editMode,
    product: product,
    isAuthenticated: req.session.isLoggedIn,
  });
};

const postEditProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log('postEditProduct');
  const { productId, title, price, imageUrl, description } = req.body;

  await productsService.updateProduct({
    id: productId,
    title,
    price,
    imageUrl,
    description,
  });

  res.redirect('/admin/products');
};

const postDeleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(req.body);
  const prodId = req.body.productId;
  console.log(prodId);

  await productsService.destroyProductById(prodId);

  res.redirect('/admin/products');
};

export default {
  getAddProduct,
  postAddProduct,
  getProducts,
  getEditProduct,
  postEditProduct,
  postDeleteProduct,
};
