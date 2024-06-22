import express from 'express';
import feedController from '../controllers/feed.controller';

const router = express.Router();

router.get('/posts', feedController.getPosts);
router.post('/post', feedController.createPost);

export default router;
