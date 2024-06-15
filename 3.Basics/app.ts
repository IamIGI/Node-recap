import express, { NextFunction, Request, Response } from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import shopRoutes from './routes/shop.route';
import adminRoutes from './routes/admin.route';
import authRoutes from './routes/auth.route';
import errorController from './controllers/error.controller';
import session from 'express-session';
import dotenv from 'dotenv';
import csrf from 'csurf';
import flash from 'connect-flash';
import multer from 'multer';

import { PrismaClient } from '@prisma/client';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';

import isAuthMiddleware from './middleware/isAuth.middleware';
import multerConfig from './config/multer.config';

const prisma = new PrismaClient();

const app = express();
dotenv.config();
const csrfProtection = csrf();

//----------Controllers----------
//View engine
//https://ejs.co/
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer(multerConfig.settings).single('image')); //'image' - name of input file
//see body send by application/json
app.use(express.json());

//Serve static files
app.use(express.static(path.join(process.cwd(), 'public')));
app.use(
  `/${multerConfig.folderForImages}`,
  express.static(path.join(process.cwd(), `${multerConfig.folderForImages}`))
);

//Express session, session object
app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 15 * 60 * 1000, //ms - 15min
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  })
);
app.use(csrfProtection);
app.use(flash());

app.use((req: Request, res: Response, next: NextFunction) => {
  res.locals.isAuthenticated = req.session?.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

//---------Routes----
app.use('/admin', isAuthMiddleware, adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404page);
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(error);
  errorController.get500page(req, res, next);
});

//---------Start server--------
async function startServer() {
  try {
    await prisma.$connect();
    console.log('Connected to the database');

    app.listen(3000, () => {
      console.log('Server is running on port 3000');
    });
  } catch (error) {
    console.error('Error connecting to the database:', error);
    await prisma.$disconnect();
    // Ensure to handle the error appropriately
    // For example, exit the application or retry connecting
  }
}

startServer();
