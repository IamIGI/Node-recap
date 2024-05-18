import express, { NextFunction, Request, Response } from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import shopRoutes from './routes/shop.route';
import adminRoutes from './routes/admin.route';
import errorController from './controllers/error.controller';
import { sequelize } from './util/db.util';
import ProductModel from './models/product.model';
import UserModel from './models/user.model';
import userService from './services/user.service';
import { IUserRequest } from './models/Request.model';

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

app.use((req: IUserRequest, res: Response, next: NextFunction) => {
  UserModel.findAll({ where: { id: '62cfd4b9-9592-4c0b-9f20-20f65d65e720' } })
    .then((user) => {
      console.log(user);
      req.user = user[0] as UserModel;
      next();
    })
    .catch((e) => console.log(e));
});

//---------Routes----
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(errorController.get404page);

//TODO: move to separated file
//----------SQL config--------
UserModel.hasMany(ProductModel, {
  sourceKey: 'id',
  foreignKey: 'userId',
  as: 'products',
});

sequelize
  .sync({ alter: true })
  .then((result) => {
    return UserModel.findAll();
  })
  .then((user) => {
    if (user.length === 0) {
      console.log('Creating new user');
      return userService.addUser({
        name: 'Igor',
        email: 'igorigi1998@gmail.om',
      });
    }
  })
  .then((user) => {
    // console.log(user);
    app.listen(3000);
  })
  .catch((err) => console.log(err));
