import express from 'express';
import { body } from 'express-validator';
import userService from '../services/user.service';
import authController from '../controllers/auth.controller';
import isAuth from '../middleware/is-auth';

const router = express.Router();

router.put(
  '/register',
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .custom(async (value: string, { req }) => {
        const user = await userService.getUserByEmail(value);
        if (user) {
          return Promise.reject('E-mail address already exists');
        }
      })
      .normalizeEmail(),
    body('password').trim().isLength({ min: 5 }),
    body('name').trim().not().isEmpty(),
  ],
  authController.register
);

router.post('/login', authController.login);

router.get('/status', isAuth, authController.getUserStatus);

router.patch(
  '/status',
  isAuth,
  [body('status').trim().not().isEmpty()],
  authController.updateUserStatus
);

export default router;
