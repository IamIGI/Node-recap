import express from 'express';
import { body } from 'express-validator';

import feedController from '../controllers/feed.controller';

const router = express.Router();

router.get('/posts', feedController.getPosts);
router.post(
  '/post',
  [
    body('title').trim().isLength({ min: 7 }),
    body('content').trim().isLength({ min: 5 }),
  ],
  feedController.createPost
);
router.get('/post/:postId', feedController.getPost);

export default router;