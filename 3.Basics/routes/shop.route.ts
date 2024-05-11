import express from 'express';
import productsController from '../controllers/products.controller';

const router = express.Router();

router.get('/', productsController.getProducts);

export default router;
