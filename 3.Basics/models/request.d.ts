import { User } from '@prisma/client';

declare module 'express-serve-static-core' {
  interface Request {
    user: User;
  }
}

// session.d.ts
import 'express-session';

declare module 'express-session' {
  interface SessionData {
    isLoggedIn: boolean;
  }
}
