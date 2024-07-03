import { Post } from '@prisma/client';
import { Prisma } from '@prisma/client';

export type PostWithUserData = Prisma.PostGetPayload<{
  include: { user: true };
}>;

export interface PostDto
  extends Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'userId'> {}

//   export type OrderWithProducts = Prisma.OrderItemGetPayload<{
//     include: { product: true };
//   }>;
