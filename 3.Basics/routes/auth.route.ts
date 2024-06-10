import express from 'express';
import { check, body } from 'express-validator';

import authController from '../controllers/auth.controller';

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const router = express.Router();

router.get('/login', authController.getLogin);
router.post(
  '/login',
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email')
      .custom(async (value, { req }) => {
        await prisma.user
          .findUnique({
            where: { email: value },
          })
          .then((user) => {
            console.log(user);
            if (!user) return Promise.reject('No user with given email');
          });
      })
      .normalizeEmail(), //remove capitalize letter e.g
    body('password', 'Password has to be valid.')
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
  ],
  authController.postLogin
);
router.post('/logout', authController.postLogout);

router.get('/signup', authController.getSignup);
router.post(
  '/signup',
  [
    check('email')
      .isEmail()
      .withMessage('Please enter a valid email')
      .custom(async (value, { req }) => {
        //additional validation in chain
        // if (value === 'test@text.com') {
        //   throw new Error('This email address is forbidden.');
        // }
        // return true;
        return await prisma.user
          .findUnique({
            where: {
              email: value,
            },
          })
          .then((user) => {
            console.log(user);
            if (user) return Promise.reject('E-mail exists already');
          });
      })
      .normalizeEmail(),
    body('password', 'Password is invalid')
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
    body('confirmPassword')
      .custom((value, { req }) => {
        if (value === req.body.password) {
          throw new Error('Passwords have to match!');
        }
      })
      .trim(),
  ],
  authController.postSignup
);

router.get('/reset/:token', authController.getNewPassword);
router.get('/reset', authController.getReset);
router.post('/reset', authController.postReset);

router.post('/new-password', authController.postNewPassword);

export default router;
