import { User } from '@prisma/client';

export interface AddUser extends Omit<User, 'id' | 'createdAt' | 'updatedAt'> {}

export interface UpdateUser extends Omit<User, 'createdAt' | 'updatedAt'> {}
