import express from 'express';
import path from 'path';
import rootDir from '../util/path';

const router = express.Router();

router.get('/', (req, res, next) => {
  res.sendFile(path.join(rootDir, 'views', 'shop.html'));
});

export default router;
