import express from 'express';
import shopController from '../controllers/shop.controller.js';
import isAuthMiddleware from '../middleware/isAuth.middleware.js';

const router = express.Router();

router.get('/', shopController.getIndex);
router.get('/products', shopController.getProducts);
router.get('/products/:productId', shopController.getProduct);

router.get('/cart', isAuthMiddleware, shopController.getCart);
router.post('/cart', isAuthMiddleware, shopController.postCart);
router.get('/orders', isAuthMiddleware, shopController.getOrders);
// router.get('/checkout', shopController.getCheckout);
router.post(
  '/cart-delete-item',
  isAuthMiddleware,
  shopController.postCartDeleteProduct
);
router.post('/create-order', isAuthMiddleware, shopController.postOrder);

export default router;
