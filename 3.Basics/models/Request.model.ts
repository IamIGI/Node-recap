import { User } from '@prisma/client';
import { Request } from 'express';

declare module 'express-serve-static-core' {
  interface Request {
    user: User;
  }
}

export interface IUserRequest extends Request {
  user: User;
}
