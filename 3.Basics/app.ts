import express, { NextFunction, Request, Response } from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import shopRoutes from './routes/shop.route';
import adminRoutes from './routes/admin.route';
import errorController from './controllers/error.controller';

import { IUserRequest } from './models/Request.model';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const app = express();

//----------Controllers----------
//View engine
//https://ejs.co/
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(bodyParser.urlencoded({ extended: false }));
//see body send by application/json
app.use(express.json());
//Serve static files
app.use(express.static(path.join(__dirname, 'public')));

app.use(async (req: IUserRequest, res: Response, next: NextFunction) => {
  try {
    console.log('Check for user init test data');

    let users = await prisma.user.findMany({
      where: { id: '4b46fcca-a09e-455f-b23b-08e1c0e1cf12' },
    });

    //Create user if not exists
    if (users.length === 0 || !users) {
      users[0] = await prisma.user.create({
        data: {
          name: 'Igor',
          email: 'igorEmail@gmail.com', //remember that email has to be unique
        },
      });
    }
    const user = users[0];

    req.user = user;
    console.log('-------User object created successfully------');
    next();
  } catch (error) {
    console.log(error);
  }
});

//---------Routes----
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(errorController.get404page);

async function startServer() {
  try {
    // Connect to the database
    await prisma.$connect();
    console.log('Connected to the database');

    // Start the server
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
