import { NextFunction, Request, Response } from 'express';
import productsService from '../services/products.service';
import { PostAddProductRequest, Product } from '../models/product.model';

const getAddProduct = (req: Request, res: Response, next: NextFunction) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
  });
};

const postAddProduct = (req: Request, res: Response, next: NextFunction) => {
  const { id, title, imageUrl, price, description } =
    req.body as PostAddProductRequest;
  productsService.save({ id, title, imageUrl, price, description });
  res.redirect('/');
};

const getEditProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const editMode = (req.query.edit as string) === 'true';
  if (!editMode) return res.redirect('/');

  const prodId = req.params.productId as string;
  const product = await productsService.findById(prodId);

  if (!product) {
    console.error(`Product could not be found, prodId ${prodId}`);
    return res.redirect('/');
  }

  res.render('admin/edit-product', {
    pageTitle: 'Edit Product',
    path: '/admin/edit-product',
    editing: editMode,
    product: product,
  });
};

const postEditProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log('postEditProduct');
  const { productId, title, price, imageUrl, description } = req.body;
  const updatedProduct: Product = {
    id: productId,
    title,
    price,
    imageUrl,
    description,
  };
  console.log(updatedProduct);
  await productsService.save(updatedProduct);
  res.redirect('/admin/products');
};

const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  const products = await productsService.fetchAll();
  res.render('admin/products', {
    prods: products,
    pageTitle: 'Admin Products',
    path: '/admin/products',
  });
};

const postDeleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(req.body);
  const prodId = req.body.productId;
  console.log(prodId);
  await productsService.deleteById(prodId);
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
