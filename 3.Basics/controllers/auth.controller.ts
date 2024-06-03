import { NextFunction, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const getLogin = async (req: Request, res: Response, next: NextFunction) => {
  const isLoggedIn =
    req.get('Cookie')?.split(';')[1].split('=')[1].trim() === 'true';

  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: isLoggedIn,
  });
};

const postLogin = async (req: Request, res: Response, next: NextFunction) => {
  let user = await prisma.user.findFirst({
    where: { id: '4b46fcca-a09e-455f-b23b-08e1c0e1cf12' },
  });

  //Temporary solution, until we do not make the login functionality
  if (!user) {
    console.error('User not found');
    res.redirect('/');
    return;
  }

  //session object is added by session middleware from app.ts
  req.session.user = user;
  req.session.isLoggedIn = true;
  req.session.save((e) => {
    console.log(e);
    res.redirect('/');
  });
};

const postLogout = async (req: Request, res: Response, next: NextFunction) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect('/');
  });
};

export default {
  getLogin,
  postLogin,
  postLogout,
};
