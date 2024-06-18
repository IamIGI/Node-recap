import express, { NextFunction, Request, Response } from 'express';
import feedRouter from './routes/feed.router';
import bodyParser from 'body-parser';

const app = express();

app.use(bodyParser.json()); //for application/json

app.use('/', (req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Method', 'POST, PUT, GET, PATCH, DELETE');
  // res.setHeader('Access-Control-Allow-Header', 'Content-Type, Authorization'); create the cors err
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // that works;

  next();
});

app.use('/feed', feedRouter);

app.listen(3000, () => {
  console.log('App started on port: 3000');
});
