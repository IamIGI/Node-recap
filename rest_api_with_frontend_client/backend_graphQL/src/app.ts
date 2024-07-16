import express, { NextFunction, Request, Response } from 'express';

import bodyParser from 'body-parser';
import path from 'path';
import multer from 'multer';
import cors from 'cors';
import dotenv from 'dotenv';

import { PrismaClient } from '@prisma/client';
import multerConfig from './config/multer.config';
import corsConfig from './config/cors.config';
import http from 'http';
import { createSchema, createYoga } from 'graphql-yoga';
import { typeDefinitions } from './graphql/schema';
import { resolvers } from './graphql/resolvers';
import { contextConfig } from './graphql/context';

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
  // console.log(req);
  //You need to enable header for token Authorization to work
  res.setHeader(
    'Access-Control-Allow-Headers',
    ' Content-Type, Authorization,socket.io '
  );
  //Allow graphql client to work
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

//graphql handler with yoga lib
const yoga = createYoga({
  schema: createSchema({
    typeDefs: [typeDefinitions],
    resolvers: [resolvers],
  }),
  context: contextConfig,
  graphiql: true,
  maskedErrors: false,
});
app.all('/graphql', yoga);

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  console.log('Final error catch');
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
    const server = http.createServer(app);

    server.listen(port, () => {
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
