import express from 'express';

import productsController from '../controllers/products.controller';

const router = express.Router();

// do not execute, just pass reference to controller
router.get('/add-product', productsController.getAddProduct);
router.post('/add-product', productsController.postAddProduct);

export default router;
