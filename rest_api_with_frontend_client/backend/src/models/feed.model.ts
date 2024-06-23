import { Post } from '@prisma/client';

export interface PostDto extends Omit<Post, 'id' | 'createdAt' | 'updatedAt'> {}
