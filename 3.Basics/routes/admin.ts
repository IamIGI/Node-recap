import express from 'express';

import { Product } from '../models/admin.model';

const router = express.Router();

const products: Product[] = [];

router.get('/add-product', (req, res, next) => {
  res.render('add-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true,
  });
});

router.post('/add-product', (req, res, next) => {
  console.log(req.body);
  products.push({ title: req.body.title });

  res.redirect('/');
});

export default { router, products };
