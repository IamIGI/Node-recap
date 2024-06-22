import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';

function getPosts(req: Request, res: Response, next: NextFunction) {
  res.status(200).json({
    posts: [
      {
        _id: '1',
        title: 'First post',
        content: 'This is the first post!',
        imageUrl: 'images/duck.jpg',
        creator: {
          name: 'Igor',
        },
        date: new Date(),
      },
    ],
  });
}

function createPost(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: 'Validation failed, entered data is incorrect.',
      errors: errors.array(),
    });
  }

  const { title, content } = req.body;

  //Create post in db;

  res.status(201).json({
    message: 'Post created successfully',
    post: {
      _id: new Date().toISOString(),
      title,
      content,
      creator: { name: 'Igor' },
      createdAt: new Date(),
    },
  });
}

export default {
  getPosts,
  createPost,
};
