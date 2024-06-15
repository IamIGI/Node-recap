import { User } from '@prisma/client';
import 'express-session';

declare module 'express-serve-static-core' {
  interface Request {}
  interface SessionData {
    isLoggedIn: boolean;
    user: User;
  }
}

declare module 'express-session' {
  interface SessionData {
    isLoggedIn: boolean;
    user: User;
  }
}
