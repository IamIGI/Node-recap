import { User } from '@prisma/client';

export interface UpdateUser
  extends Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>> {}
