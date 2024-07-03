import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

export default function (req: Request, res: Response, next: NextFunction) {
  const authHeader = req.get('Authorization');

  if (!authHeader) {
    return res.status(401).json({ message: 'missing authorization token' });
  }

  const token = authHeader?.split(' ')[1];
  const jwt_token = process.env.JWT_SECRET_TOKEN!;

  if (!token) {
    return res.status(401).json({ message: 'missing authorization token' });
  }

  jwt.verify(token, jwt_token, (err, decodedToken) => {
    if (err) {
      return res
        .status(500)
        .json({ message: 'Invalid token (forbidden)', error: `${err}` });
    }

    if (!decodedToken) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    req.userId = (decodedToken! as JwtPayload).userId;
    next();
  });
}
