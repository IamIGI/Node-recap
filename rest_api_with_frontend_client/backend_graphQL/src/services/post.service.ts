import { PrismaClient } from '@prisma/client';
import { PostDto, PostWithUserData } from '../models/feed.model';

async function getPosts(
  prisma: PrismaClient,
  page: number
): Promise<{ countPosts: number; posts: PostWithUserData[] }> {
  const ITEMS_PER_PAGE = 2;

  const countPosts = await prisma.post.count();
  const posts: PostWithUserData[] = await prisma.post.findMany({
    skip: (page - 1) * ITEMS_PER_PAGE,
    take: ITEMS_PER_PAGE,
    include: { user: true },
    orderBy: { createdAt: 'desc' },
  });
  return { countPosts, posts };
}

async function createPost(
  prisma: PrismaClient,
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

async function getPost(
  prisma: PrismaClient,
  postId: string
): Promise<PostWithUserData | null> {
  const post: PostWithUserData | null = await prisma.post.findFirst({
    where: { id: postId },
    include: { user: true },
  });
  return post;
}

async function updatePost(
  prisma: PrismaClient,
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

async function deletePost(prisma: PrismaClient, postId: string) {
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
