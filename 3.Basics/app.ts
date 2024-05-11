import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';

import shopRoutes from './routes/shop';
import admin from './routes/admin';

const app = express();

//View engine
//https://ejs.co/
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));

//see body send by application/json
app.use(express.json());

//Serve static files
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', admin.router);
app.use(shopRoutes);

app.use((req, res, next) => {
  res.status(404).render('404', { pageTitle: 'Page Not Found' });
});

app.listen(3000);
