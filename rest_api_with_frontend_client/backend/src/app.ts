import express, { NextFunction, Request, Response } from 'express';
import feedRouter from './routes/feed.router';
import authRouter from './routes/auth.route';
import bodyParser from 'body-parser';
import path from 'path';
import multer from 'multer';
import cors from 'cors';
import dotenv from 'dotenv';

import { PrismaClient } from '@prisma/client';
import multerConfig from './config/multer.config';
import corsConfig from './config/cors.config';

const app = express();
dotenv.config();
const prisma = new PrismaClient();

app.use(cors(corsConfig));
app.use(bodyParser.json()); //for application/json

//Images config
app.use(multer(multerConfig.settings).single('image')); //'image' - name of input file
app.use(
  `/${multerConfig.imagesFolder}`,
  express.static(path.join(process.cwd(), `${multerConfig.imagesFolder}`))
);

app.use((req: Request, res: Response, next: NextFunction) => {
  //You need to enable header for token Authorization to work
  res.setHeader('Access-Control-Allow-Headers', ' Content-Type, Authorization');
  next();
});

app.use('/feed', feedRouter);
app.use('/auth', authRouter);

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(error);

  res.json({ message: error.message });
  // errorController.get500page(req, res, next);
});

//---------Start server--------
async function startServer() {
  try {
    await prisma.$connect();
    console.log('Connected to the database');

    const port = 8080;
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Error connecting to the database:', error);
    await prisma.$disconnect();
    // Ensure to handle the error appropriately
    // For example, exit the application or retry connecting
  }
}

startServer();
