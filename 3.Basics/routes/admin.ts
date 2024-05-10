import express from 'express';
import path from 'path';
import rootDir from '../util/path';

const router = express.Router();

router.get('/add-product', (req, res, next) => {
  res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
});

router.post('/add-product', (req, res, next) => {
  console.log(req.body);

  res.send('<h1>Add product</h1>');
});

export default router;
