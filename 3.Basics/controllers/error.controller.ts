import { NextFunction, Request, Response } from 'express';

const get404page = (req: Request, res: Response, next: NextFunction) => {
  res.status(404).render('404', { pageTitle: 'Page Not Found' });
};

export default {
  get404page,
};
