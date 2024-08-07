import express from 'express';
import { body } from 'express-validator';

import feedController from '../controllers/feed.controller';
import isAuth from '../middleware/is-auth';

const router = express.Router();

router.get('/posts', isAuth, feedController.getPosts);
router.post(
  '/post',
  isAuth,
  [
    body('title').trim().isLength({ min: 5 }),
    body('content').trim().isLength({ min: 5 }),
  ],
  feedController.createPost
);
router.get('/post/:postId', feedController.getPost);

router.put(
  '/post/:postId',
  isAuth,
  [
    body('title').trim().isLength({ min: 5 }),
    body('content').trim().isLength({ min: 5 }),
  ],
  feedController.updatePost
);

router.delete('/post/:postId', isAuth, feedController.deletePost);

export default router;
