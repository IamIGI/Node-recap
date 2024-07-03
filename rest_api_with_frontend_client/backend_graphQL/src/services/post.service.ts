import { PostDto, PostWithUserData } from '../models/feed.model';

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function getPosts(
  page: number
): Promise<{ countPosts: number; posts: PostWithUserData[] }> {
  const itemsPerPage = 2;

  const countPosts = await prisma.post.count();
  const posts: PostWithUserData[] = await prisma.post.findMany({
    skip: (page - 1) * itemsPerPage,
    take: itemsPerPage,
    include: { user: true },
    orderBy: { createdAt: 'desc' },
  });
  return { countPosts, posts };
}

async function createPost(
  payload: PostDto,
  userId: string
): Promise<PostWithUserData> {
  const { title, imageUrl, content } = payload;

  const post = await prisma.post.create({
    data: {
      title,
      content,
      imageUrl: `/${imageUrl.replaceAll('\\', '/')}`,
      userId,
    },
    include: { user: true },
  });

  return post;
}

async function getPost(postId: string): Promise<PostWithUserData | null> {
  const post: PostWithUserData | null = await prisma.post.findFirst({
    where: { id: postId },
    include: { user: true },
  });
  return post;
}

async function updatePost(
  postId: string,
  payload: PostDto
): Promise<PostWithUserData> {
  const updatedPost = await prisma.post.update({
    where: { id: postId },
    data: {
      ...payload,
      imageUrl: `/${payload.imageUrl.replaceAll('\\', '/')}`,
    },
    include: { user: true },
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
  createPost,
  getPost,
  updatePost,
  deletePost,
};
