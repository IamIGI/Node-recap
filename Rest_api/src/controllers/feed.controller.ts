import { NextFunction, Request, Response } from 'express';

function getPosts(req: Request, res: Response, next: NextFunction) {
  res.status(200).json({ posts: [{ title: 'First post', content: 'Elo' }] });
}

function createPost(req: Request, res: Response, next: NextFunction) {
  const { title, content } = req.body;

  //Create post in db;

  res.status(201).json({
    message: 'Post created successfully',
    post: { id: new Date().toISOString(), title, content },
  });
}

export default {
  getPosts,
  createPost,
};
