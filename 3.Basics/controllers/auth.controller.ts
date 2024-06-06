import { NextFunction, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

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
  const { email, password }: { email: string; password: string } = req.body;

  let user = await prisma.user.findUnique({
    where: { email },
  });

  //Temporary solution, until we do not make the login functionality
  if (!user) {
    console.error('User not found');
    res.redirect('/');
    return;
  }

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
    return res.redirect('/login');
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

  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (user) {
      console.log('User with given email, already exists, email: ' + email);
      return res.redirect('/login');
    }

    if (password !== confirmPassword) {
      console.log('Passwords are not the same');
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    res.redirect('/login');
  } catch (e) {
    console.error(e);
  }
};

const getSignup = async (req: Request, res: Response, next: NextFunction) => {
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    isAuthenticated: false,
  });
};

export default {
  getLogin,
  postLogin,
  postLogout,
  postSignup,
  getSignup,
};
