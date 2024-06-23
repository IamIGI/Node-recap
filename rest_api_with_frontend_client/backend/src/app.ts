import express, { NextFunction, Request, Response } from 'express';
import feedRouter from './routes/feed.router';
import bodyParser from 'body-parser';

import { PrismaClient } from '@prisma/client';
import path from 'path';

const app = express();
const prisma = new PrismaClient();

app.use(bodyParser.json()); //for application/json
app.use('/image', express.static(path.join(process.cwd(), 'images')));

app.use('/', (req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Method', 'POST, PUT, GET, PATCH, DELETE');
  // res.setHeader('Access-Control-Allow-Header', 'Content-Type, Authorization'); create the cors err
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // that works;

  next();
});

app.use('/feed', feedRouter);

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
