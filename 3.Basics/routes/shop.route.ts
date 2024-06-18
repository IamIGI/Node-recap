import express from 'express';
import shopController from '../controllers/shop.controller.js';
import isAuthMiddleware from '../middleware/isAuth.middleware.js';

const router = express.Router();

router.get('/', shopController.getIndex);
router.get('/products', shopController.getProducts);
router.get('/products/:productId', shopController.getProduct);

router.get('/cart', isAuthMiddleware, shopController.getCart);
router.post('/cart', isAuthMiddleware, shopController.postCart);
router.post(
  '/cart-delete-item',
  isAuthMiddleware,
  shopController.postCartDeleteProduct
);

router.get('/orders', isAuthMiddleware, shopController.getOrders);
router.get('/orders/:orderId', isAuthMiddleware, shopController.getInvoice);

router.get('/checkout', isAuthMiddleware, shopController.getCheckout);
router.get('/checkout/success', shopController.getCheckoutSuccess);
router.get('/checkout/cancel', shopController.getCheckout);
export default router;
