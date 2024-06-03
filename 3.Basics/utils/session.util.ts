import { User } from '@prisma/client';
import { Request } from 'express';

function getUser(req: Request): User {
  const user = req.session.user;
  if (!user) throw new Error('SessionError: User not logged in');
  return user;
}

export default {
  getUser,
};
