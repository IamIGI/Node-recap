import { NextFunction, Request, Response } from 'express';

const get404page = (req: Request, res: Response, next: NextFunction) => {
  res.status(404).render('404', {
    pageTitle: 'Page Not Found',
    path: '/404',
    isAuthenticated: req.session.isLoggedIn,
  });
};

const get500page = (req: Request, res: Response, next: NextFunction) => {
  res.status(500).render('500', {
    pageTitle: 'Error!',
    path: '/500',
    isAuthenticated: req.session.isLoggedIn,
  });
};

export default {
  get404page,
  get500page,
};
