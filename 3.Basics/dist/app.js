"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const admin_1 = __importDefault(require("./routes/admin"));
const shop_1 = __importDefault(require("./routes/shop"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
app.use(body_parser_1.default.urlencoded({ extended: false }));
//see body send by application/json
app.use(express_1.default.json());
//Serve static files
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
app.use('/admin', admin_1.default);
app.use(shop_1.default);
app.use((req, res, next) => {
    res.status(404).sendFile(path_1.default.join(__dirname, '../', 'views', '404.html'));
});
app.listen(3000);
