import { NextFunction, Request, Response } from 'express';

import { validationResult } from 'express-validator';
import passwordUtil from '../utils/password.util';
import userService from '../services/user.service';
import authService from '../services/auth.service';

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

async function login(req: Request, res: Response, next: NextFunction) {
  console.log('login');
  const { email, password } = req.body;

  try {
    const user = await userService.getUserByEmail(email);

    if (!user) {
      return res.status(401).json({
        message: 'User where not found.',
      });
    }

    const isMatch = await passwordUtil.comparePassword(password, user);
    if (!isMatch) {
      return res.status(401).json({ message: 'Wrong password' });
    }

    const token = authService.getJWT_token(user);

    res.status(200).json({ token, userId: user.id });
  } catch (error) {
    next(error);
  }
}

async function getUserStatus(req: Request, res: Response, next: NextFunction) {
  const userId = req.userId!;
  try {
    const user = await userService.getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ status: user.status });
  } catch (error) {
    next(error);
  }
}

async function updateUserStatus(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const userId = req.userId!;
  const newStatus = req.body.status;

  try {
    const user = await userService.getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const updatedUser = await userService.updateUser(userId, {
      status: newStatus,
    });

    return res.status(200).json({ message: 'User updated!' });
  } catch (error) {
    next(error);
  }
}

export default { register, login, getUserStatus, updateUserStatus };
