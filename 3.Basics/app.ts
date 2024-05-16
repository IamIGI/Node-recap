import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';

import shopRoutes from './routes/shop.route';
import adminRoutes from './routes/admin.route';
import errorController from './controllers/error.controller';
import { sequelize } from './util/db.util';
import ProductModel from './models/product.model';

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

//---------Routes
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(errorController.get404page);

//TODO:  I need to create file 'DbSync'
ProductModel.sync()
  .then((result) => {
    // console.log(result);
    app.listen(3000);
  })
  .catch((err) => console.log(err));
