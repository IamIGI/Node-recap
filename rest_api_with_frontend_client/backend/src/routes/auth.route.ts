import express from 'express';
import { body } from 'express-validator';
import userService from '../services/user.service';
import authController from '../controllers/auth.controller';

const router = express.Router();

router.put(
  '/register',
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .custom(async (value: string, { req }) => {
        const user = await userService.getUser(value);
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

export default router;
