import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { AddPost } from '../models/feed.model';
import postService from '../services/post.service';

async function getPosts(req: Request, res: Response, next: NextFunction) {
  try {
    let posts = await postService.getPosts();

    //TODO: when users added, change this lines of code
    posts = posts?.map((post) => {
      return {
        ...post,
        creator: {
          name: 'Igor',
        },
      };
    });

    res.status(200).json({
      message: 'Fetched posts successfully',
      posts,
    });
  } catch (e) {
    next(e);
  }
}

async function createPost(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: 'Validation failed, entered data is incorrect.',
      errors: errors.array(),
    });
  }

  if (!req.file) {
    const error = new Error('No image provided');
    next(error);
    return;
  }

  const payload = req.body as AddPost;
  const imageUrl = req.file.path.replaceAll('\\', '/');

  try {
    const createdPost = await postService.addPost({
      ...payload,
      imageUrl,
    });

    //TODO: when users added, change this lines of code
    const createdPostDtm = {
      ...createdPost,
      creator: {
        name: 'Igor',
      },
    };

    if (!createdPost) throw new Error('Post was not created');

    res.status(201).json({
      message: 'Post created successfully',
      post: createdPostDtm,
    });
  } catch (e) {
    next(e);
  }

  //Create post in db;
}

async function getPost(req: Request, res: Response, next: NextFunction) {
  const postId = req.params.postId;

  try {
    const post = await postService.getPost(postId);

    //TODO: when users added, change this lines of code
    const postDtm = {
      ...post,
      creator: {
        name: 'Igor',
      },
    };

    if (!post) {
      throw new Error('Could not find post');
    }

    res.status(200).json({
      message: 'Post fetched.',
      post: postDtm,
    });
  } catch (error) {
    next(error);
  }
}

export default {
  getPosts,
  createPost,
  getPost,
};
