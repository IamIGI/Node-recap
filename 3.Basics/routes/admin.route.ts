import express from 'express';
import adminController from '../controllers/admin.controller';

const router = express.Router();

// do not execute, just pass reference to controller
router.get('/add-product', adminController.getAddProduct);
router.post('/add-product', adminController.postAddProduct);
router.get('/products', adminController.getProducts);

export default router;
