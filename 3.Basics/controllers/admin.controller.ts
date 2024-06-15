import { NextFunction, Request, Response } from 'express';
import productsService from '../services/products.service';

import { AddProduct, UpdateProduct } from '../models/product.model';
import sessionUtil from '../utils/session.util';

const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  const user = sessionUtil.getUser(req);
  const products = await productsService.getProductsByUserId(user);

  res.render('admin/products', {
    prods: products,
    pageTitle: 'Admin Products',
    path: '/admin/products',
  });
};

const getAddProduct = (req: Request, res: Response, next: NextFunction) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/edit-product',
    editing: false,
  });
};

const postAddProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, price, description } = req.body as AddProduct;
    const image = req.file;
    const user = sessionUtil.getUser(req);
    console.log(image);

    if (!image) {
      console.log('No image provided');
      return;
    }

    const imageUrl = image.path;

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
  } catch (e) {
    next(e);
  }
};

const getEditProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
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
    });
  } catch (error) {
    next(error);
  }
};

const postEditProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = sessionUtil.getUser(req);

    const { productId, title, price, description } = req.body;
    const image = req.file;

    const updatedProduct = await productsService.updateProduct(
      {
        id: productId,
        title,
        price,
        imageUrl: image?.path,
        description,
      },
      user
    );

    if (!updatedProduct) {
      console.log('Could not edit product');
      return res.redirect('/');
    }

    res.redirect('/admin/products');
  } catch (error) {
    next(error);
  }
};

const postDeleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const prodId = req.body.productId;
    const user = sessionUtil.getUser(req);

    const deletedProduct = await productsService.destroyProductById(
      prodId,
      user
    );

    if (!deletedProduct) {
      console.log('Could not delete product');
      return res.redirect('/');
    }
    res.redirect('/admin/products');
  } catch (error) {
    next(error);
  }
};

export default {
  getAddProduct,
  postAddProduct,
  getProducts,
  getEditProduct,
  postEditProduct,
  postDeleteProduct,
};
