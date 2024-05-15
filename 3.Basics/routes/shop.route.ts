import express from 'express';
import shopController from '../controllers/shop.controller.js';

const router = express.Router();

router.get('/', shopController.getIndex);
router.get('/products', shopController.getProducts);
//order matters
// router.get('/products/delete')
router.get('/products/:productId', shopController.getProduct);
router.get('/cart', shopController.getCart);
router.post('/cart', shopController.postCart);
router.get('/orders', shopController.getOrders);
router.get('/checkout', shopController.getCheckout);
router.post('/cart-delete-item', shopController.postCartDeleteProduct);

export default router;
