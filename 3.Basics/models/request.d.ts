import { User } from '@prisma/client';

declare module 'express-serve-static-core' {
  interface Request {}
}

// session.d.ts
import 'express-session';

declare module 'express-session' {
  interface SessionData {
    isLoggedIn: boolean;
    user: User;
  }
}
