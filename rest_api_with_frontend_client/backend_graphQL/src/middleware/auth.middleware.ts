import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

export default function (req: Request, res: Response, next: NextFunction) {
  console.log('Validate authentication');
  const authHeader = req.get('Authorization');
  console.log(authHeader);

  if (!authHeader) {
    req.isAuth = false;
    return next();
  }

  const token = authHeader?.split(' ')[1];
  const jwt_token = process.env.JWT_SECRET_TOKEN!;

  if (!token) {
    req.isAuth = false;
    return next();
  }

  jwt.verify(token, jwt_token, (err, decodedToken) => {
    if (err) {
      req.isAuth = false;
      return next();
    }

    if (!decodedToken) {
      req.isAuth = false;
      return next();
    }

    req.userId = (decodedToken! as JwtPayload).userId;
    req.isAuth = true;
    console.log(req);
    console.log('Returning');
    next();
  });
}
