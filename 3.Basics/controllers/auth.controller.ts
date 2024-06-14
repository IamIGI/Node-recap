import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import nodemailerConfig from '../config/nodemailer.config';
import flashMessageUtil, { FlashTypeMessage } from '../utils/flashMessage.util';
import crypto from 'crypto'; //Build in express lib
import { validationResult } from 'express-validator';

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const getLogin = async (req: Request, res: Response, next: NextFunction) => {
  const isLoggedIn =
    req.get('Cookie')?.split(';')[1].split('=')[1].trim() === 'true';

  const flashMessage = flashMessageUtil.getMessage(req, FlashTypeMessage.Error);

  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: isLoggedIn,
    errorMessage: flashMessage,
  });
};

//Login user
const postLogin = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password }: { email: string; password: string } = req.body;
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      console.log(errors.array());
      return res.status(422).render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: false,
        errorMessage: errors.array()[0].msg,
      });
    }

    const user = (await prisma.user.findUnique({
      where: { email },
    }))!;

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      console.log('Logging the user');
      // session object is added by session middleware from app.ts, line 29
      // Create user session
      req.session.isLoggedIn = true;
      req.session.user = user;
      req.session.save((e) => {
        if (e) {
          console.error('Error saving session:', e);
          return res.status(500).send('Internal Server Error');
        }
        console.log('Session saved successfully');
        return res.redirect('/');
      });
    } else {
      console.log('Bad password');
      req.flash(FlashTypeMessage.Error, 'Invalid Email or password.');
      return res.redirect('/login');
    }
  } catch (error) {
    next(error);
  }
};

const postLogout = async (req: Request, res: Response, next: NextFunction) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect('/');
  });
};

/** Create / register new user */
const postSignup = async (req: Request, res: Response, next: NextFunction) => {
  const {
    email,
    password,
    confirmPassword,
  }: { email: string; password: string; confirmPassword: string } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      isAuthenticated: false,
      errorMessage: errors.array()[0].msg,
      oldInput: { email, password, confirmPassword },
      validationErrors: errors.array(),
    });
  }

  try {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    res.redirect('/login');

    console.log('Send Email begin');
    const result = await nodemailerConfig.sendEmail(
      email,
      'Signup Succeeded!',
      '<h1> You successfully signed up! </h1>'
    );

    console.log(result);
    console.log('Send email done');
  } catch (error) {
    next(error);
  }
};

const getSignup = async (req: Request, res: Response, next: NextFunction) => {
  const flashMessage = flashMessageUtil.getMessage(req, FlashTypeMessage.Error);

  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    isAuthenticated: false,
    errorMessage: flashMessage,
    oldInput: { email: '', password: '', confirmPassword: '' },
    validationErrors: [],
  });
};

const getReset = async (req: Request, res: Response, next: NextFunction) => {
  const flashMessage = flashMessageUtil.getMessage(req, FlashTypeMessage.Error);

  res.render('auth/reset', {
    path: '/reset',
    pageTitle: 'Reset password',
    errorMessage: flashMessage,
  });
};

const postReset = async (req: Request, res: Response, next: NextFunction) => {
  crypto.randomBytes(32, async (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect('/reset');
    }

    const token = buffer.toString('hex');

    try {
      const user = await prisma.user.findUnique({
        where: { email: req.body.email },
      });
      if (!user) {
        req.flash(FlashTypeMessage.Error, 'User not found with that Email.');
        return res.redirect('/reset');
      }

      prisma.user
        .update({
          where: { email: req.body.email },
          data: {
            resetToken: token,
            resetTokenExpiration: new Date(Date.now() + 3600000), // 1 hour from now
          },
        })
        .then(async (result) => {
          res.redirect('/');

          await nodemailerConfig.sendEmail(
            user.email,
            'Password reset',
            `
      <p>You requested a password reset. </p>
      <p>Click this link to set a new password. </p>
      <p>Link: <a href="http://localhost:3000/reset/${token}">reset password </a> </p>
      `
          );
        })
        .catch((e) => {
          console.log(e);
        });
    } catch (error) {
      next(error);
    }
  });
};

const getNewPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.params.token;

  const user = await prisma.user.findFirst({
    where: { resetToken: token, resetTokenExpiration: { gt: new Date() } },
  });

  if (!user) {
    req.flash(
      FlashTypeMessage.Error,
      'Token already expired. Send request again'
    );
    return res.redirect('/login');
  }

  const flashMessage = flashMessageUtil.getMessage(req, FlashTypeMessage.Error);
  res.render('auth/new-password', {
    path: '/new-password',
    pageTitle: 'New password',
    errorMessage: flashMessage,
    userId: user.id,
    passwordToken: token,
  });
};

const postNewPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { password, userId, passwordToken } = req.body;

  try {
    const user = await prisma.user.findFirst({
      where: {
        resetToken: passwordToken,
        resetTokenExpiration: { gt: new Date() },
        id: userId,
      },
    });

    if (!user) {
      req.flash(
        FlashTypeMessage.Error,
        'Token already expired or user could not be found. Send request again'
      );
      return res.redirect('/login');
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const result = await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiration: null,
      },
    });
    console.log(result);
    res.redirect('/login');
  } catch (error) {
    next(error);
  }
};

export default {
  getLogin,
  postLogin,
  postLogout,
  postSignup,
  getSignup,
  getReset,
  postReset,
  getNewPassword,
  postNewPassword,
};
