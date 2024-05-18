"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const path_1 = __importDefault(require("path"));
const shop_route_1 = __importDefault(require("./routes/shop.route"));
const admin_route_1 = __importDefault(require("./routes/admin.route"));
const error_controller_1 = __importDefault(require("./controllers/error.controller"));
const db_util_1 = require("./util/db.util");
const product_model_1 = __importDefault(require("./models/product.model"));
const user_model_1 = __importDefault(require("./models/user.model"));
const user_service_1 = __importDefault(require("./services/user.service"));
const app = (0, express_1.default)();
//----------Controllers----------
//View engine
//https://ejs.co/
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(body_parser_1.default.urlencoded({ extended: false }));
//see body send by application/json
app.use(express_1.default.json());
//Serve static files
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
app.use((req, res, next) => {
    user_model_1.default.findAll({ where: { id: '62cfd4b9-9592-4c0b-9f20-20f65d65e720' } })
        .then((user) => {
        console.log(user);
        req.user = user[0];
        next();
    })
        .catch((e) => console.log(e));
});
//---------Routes----
app.use('/admin', admin_route_1.default);
app.use(shop_route_1.default);
app.use(error_controller_1.default.get404page);
//TODO: move to separated file
//----------SQL config--------
user_model_1.default.hasMany(product_model_1.default, {
    sourceKey: 'id',
    foreignKey: 'userId',
    as: 'products',
});
db_util_1.sequelize
    .sync({ alter: true })
    .then((result) => {
    return user_model_1.default.findAll();
})
    .then((user) => {
    if (user.length === 0) {
        console.log('Creating new user');
        return user_service_1.default.addUser({
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
