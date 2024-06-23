import { Post } from '@prisma/client';

export interface AddPost extends Omit<Post, 'id' | 'createdAt' | 'updatedAt'> {}
