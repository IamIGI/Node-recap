import { User } from '@prisma/client';
import 'express-session';

declare module 'express-serve-static-core' {
  interface Request {
    userId: string;
    isAuth: boolean;
  }
}
