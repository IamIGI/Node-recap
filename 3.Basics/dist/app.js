"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const path_1 = __importDefault(require("path"));
const shop_1 = __importDefault(require("./routes/shop"));
const admin_1 = __importDefault(require("./routes/admin"));
const app = (0, express_1.default)();
//View engine
//https://ejs.co/
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(body_parser_1.default.urlencoded({ extended: false }));
//see body send by application/json
app.use(express_1.default.json());
//Serve static files
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
app.use('/admin', admin_1.default.router);
app.use(shop_1.default);
app.use((req, res, next) => {
    res.status(404).render('404', { pageTitle: 'Page Not Found' });
});
app.listen(3000);
