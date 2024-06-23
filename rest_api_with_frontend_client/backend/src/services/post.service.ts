import { PostDto } from '../models/feed.model';

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function getPosts(page: number) {
  const itemsPerPage = 2;

  const countPosts = await prisma.post.count();
  const posts = await prisma.post.findMany({
    skip: (page - 1) * itemsPerPage,
    take: itemsPerPage,
  });
  return { countPosts, posts };
}

async function PostDto(payload: PostDto) {
  const { title, imageUrl, content } = payload;

  const post = await prisma.post.create({
    data: {
      title,
      content,
      imageUrl: `/${imageUrl.replaceAll('\\', '/')}`,
    },
  });

  return post;
}

async function getPost(postId: string) {
  const post = await prisma.post.findFirst({ where: { id: postId } });
  return post;
}

async function updatePost(postId: string, payload: PostDto) {
  const updatedPost = await prisma.post.update({
    where: { id: postId },
    data: {
      ...payload,
      imageUrl: `/${payload.imageUrl.replaceAll('\\', '/')}`,
    },
  });
  if (!updatedPost) {
    throw new Error(`Could not find post with given id: ${postId}`);
  }

  return updatedPost;
}

async function deletePost(postId: string) {
  const deletedPost = await prisma.post.delete({ where: { id: postId } });
  return deletedPost;
}

export default {
  getPosts,
  PostDto,
  getPost,
  updatePost,
  deletePost,
};
