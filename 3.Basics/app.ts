import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';

import shopRoutes from './routes/shop.route';
import adminRoutes from './routes/admin.route';
import errorController from './controllers/error.controller';
import database from './util/db.util';

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

app.listen(3000);
