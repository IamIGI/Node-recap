import { AddPost } from '../models/feed.model';

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function getPosts() {
  const posts = await prisma.post.findMany();
  return posts;
}

async function addPost(payload: AddPost) {
  const { title, imageUrl, content } = payload;

  const post = await prisma.post.create({
    data: {
      title,
      content,
      imageUrl,
    },
  });

  return post;
}

async function getPost(postId: string) {
  const post = await prisma.post.findFirst({ where: { id: postId } });
  return post;
}

export default {
  getPosts,
  addPost,
  getPost,
};
