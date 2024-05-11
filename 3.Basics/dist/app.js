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
app.use('/admin', admin_route_1.default);
app.use(shop_route_1.default);
app.use(error_controller_1.default.get404page);
app.listen(3000);
