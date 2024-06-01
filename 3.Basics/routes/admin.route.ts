import express from 'express';
import adminController from '../controllers/admin.controller';

const router = express.Router();

// do not execute, just pass reference to controller
router.get('/add-product', adminController.getAddProduct);
router.post('/add-product', adminController.postAddProduct);
router.get('/products', adminController.getProducts); //TODO: change so admin could only fetch his products
router.get('/edit-product/:productId', adminController.getEditProduct);
router.post('/edit-product', adminController.postEditProduct);
router.post('/delete-product', adminController.postDeleteProduct);

export default router;
