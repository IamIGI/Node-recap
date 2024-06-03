import { NextFunction, Request, Response } from 'express';

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
  //After max-age seconds value passed, then cookie will be remove, so on next request it won't be there
  // res.setHeader('Set-Cookie', 'loggedIn=true; Max-Age=30');

  //session object is added by session middleware from app.ts
  req.session.isLoggedIn = true;
  res.redirect('/');
};

export default {
  getLogin,
  postLogin,
};
