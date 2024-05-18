import { Request } from 'express';
import UserModel, { User } from './user.model';

declare module 'express-serve-static-core' {
  interface Request {
    user: UserModel;
  }
}

export interface IUserRequest extends Request {
  user: UserModel;
}
