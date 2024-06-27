import { NextFunction, Request, Response } from 'express';

import { validationResult } from 'express-validator';
import passwordUtil from '../utils/password.util';
import userService from '../services/user.service';

async function register(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: 'Validation failed, entered data is incorrect.',
      errors: errors.array(),
    });
  }
  const { email, password, name } = req.body;

  try {
    const hashedPassword = passwordUtil.hashPassword(password);

    const user = await userService.createUser(email, hashedPassword, name);

    res.status(201).json({ message: 'User created!', userId: user.id });
  } catch (error) {
    next(error);
  }
}

export default { register };
