import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { PostDto } from '../models/feed.model';
import postService from '../services/post.service';
import fileUtil from '../utils/file.util';
import userService from '../services/user.service';

async function getPosts(req: Request, res: Response, next: NextFunction) {
  const page = Number(req.query.page || 1);

  try {
    let posts = await postService.getPosts(page);
    // console.log(posts);

    //TODO: when users added, change this lines of code
    const postsDto = posts.posts?.map((post) => {
      return {
        ...post,
        creator: {
          _id: post.user.id,
          name: post.user.name,
        },
      };
    });

    res.status(200).json({
      message: 'Fetched posts successfully',
      posts: postsDto,
      totalItems: posts.countPosts,
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

  const payload = req.body as PostDto;
  const userId = req.userId!;
  const imageUrl = req.file.path;

  try {
    const createdPost = await postService.createPost(
      {
        ...payload,
        imageUrl,
      },
      userId
    );

    const user = await userService.getUserById(userId);

    if (!createdPost || !user) throw new Error('Post was not created');

    //TODO: when users added, change this lines of code
    const createdPostDtm = {
      ...createdPost,
      creator: {
        id: user.id,
        name: user.name,
      },
    };

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

    if (!post) {
      throw new Error('Could not find post');
    }

    res.status(200).json({
      message: 'Post fetched.',
      post,
    });
  } catch (error) {
    next(error);
  }
}

async function updatePost(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req);
  const postId = req.params.postId;
  const { title, content } = req.body;
  let imageUrl = req.body.image;

  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: 'Validation failed, entered data is incorrect.',
      errors: errors.array(),
    });
  }

  if (req.file) {
    imageUrl = req.file.path;
  }

  if (!imageUrl) {
    const error = new Error('No image provided');
    next(error);
    return;
  }

  try {
    const editedPost = await postService.getPost(postId);

    if (editedPost && editedPost.imageUrl !== imageUrl) {
      fileUtil.deleteFile(editedPost.imageUrl);
    }

    const updatedPost = await postService.updatePost(postId, {
      title,
      content,
      imageUrl,
    });

    res.status(200).json({ message: 'Post updated!', post: updatedPost });
  } catch (error) {
    next(error);
  }
}

async function deletePost(req: Request, res: Response, next: NextFunction) {
  const postId = req.params.postId;
  try {
    const deletedPost = await postService.deletePost(postId);

    if (deletedPost) fileUtil.deleteFile(deletedPost.imageUrl);

    res.status(200).json({ message: 'Post deleted', post: deletedPost });
  } catch (error) {
    next(error);
  }
}

export default {
  getPosts,
  createPost,
  getPost,
  updatePost,
  deletePost,
};
