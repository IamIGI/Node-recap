import { User } from '@prisma/client';
import jwt from 'jsonwebtoken';

function getJWT_token(user: User) {
  const jwt_token = process.env.JWT_SECRET_TOKEN;
  const jwt_expires_time = process.env.JWT_TOKEN_EXPIRES;
  const token = jwt.sign({ email: user.email, userId: user.id }, jwt_token!, {
    expiresIn: jwt_expires_time!,
  });

  return token;
}

export default {
  getJWT_token,
};
