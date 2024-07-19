import express, { NextFunction, Request, Response } from 'express';

import bodyParser from 'body-parser';
import path from 'path';
import multer from 'multer';
import cors from 'cors';
import dotenv from 'dotenv';

import multerConfig from './config/multer.config';
import corsConfig from './config/cors.config';
import http from 'http';
import { createSchema, createYoga } from 'graphql-yoga';
import { typeDefinitions } from './graphql/schema';
import { resolvers } from './graphql/resolvers';
import authMiddleware from './middleware/auth.middleware';
import { PrismaClient } from '@prisma/client';
import { GraphQLContext } from './graphql/context';
import fileUtils from './utils/file.utils';

const prisma = new PrismaClient();

const app = express();
dotenv.config();

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

app.use(authMiddleware);

app.put('/post-image', (req: Request, res: Response, next: NextFunction) => {
  if (!req.isAuth) {
    throw new Error('Not authenticated');
  }
  if (!req.file) return res.status(200).json({ message: 'No file provided!' });

  if (req.body.oldPath) {
    fileUtils.deleteFile(req.body.oldPath as string);
  }

  return res
    .status(201)
    .json({ message: 'File stored.', filePath: req.file.path });
});

//graphql handler with yoga lib
app.all('/graphql', (req: Request, res: Response) => {
  console.log('Graphql handler');
  return createYoga({
    schema: createSchema({
      typeDefs: [typeDefinitions],
      resolvers: [resolvers],
    }),
    context: (): GraphQLContext => ({ prisma, req, res }),
    graphiql: true,
    maskedErrors: false,
  })(req, res);
});

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
