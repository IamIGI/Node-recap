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
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const error_controller_1 = __importDefault(require("./controllers/error.controller"));
const express_session_1 = __importDefault(require("express-session"));
const dotenv_1 = __importDefault(require("dotenv"));
const csurf_1 = __importDefault(require("csurf"));
const connect_flash_1 = __importDefault(require("connect-flash"));
const multer_1 = __importDefault(require("multer"));
const client_1 = require("@prisma/client");
const prisma_session_store_1 = require("@quixo3/prisma-session-store");
const isAuth_middleware_1 = __importDefault(require("./middleware/isAuth.middleware"));
const multer_config_1 = __importDefault(require("./config/multer.config"));
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
dotenv_1.default.config();
const csrfProtection = (0, csurf_1.default)();
//----------Controllers----------
//View engine
//https://ejs.co/
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use((0, multer_1.default)(multer_config_1.default.settings).single('image')); //'image' - name of input file
//see body send by application/json
app.use(express_1.default.json());
//Serve static files
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
//Express session, session object
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new prisma_session_store_1.PrismaSessionStore(prisma, {
        checkPeriod: 15 * 60 * 1000, //ms - 15min
        dbRecordIdIsSessionId: true,
        dbRecordIdFunction: undefined,
    }),
}));
app.use(csrfProtection);
app.use((0, connect_flash_1.default)());
app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
});
//---------Routes----
app.use('/admin', isAuth_middleware_1.default, admin_route_1.default);
app.use(shop_route_1.default);
app.use(auth_route_1.default);
app.use(error_controller_1.default.get404page);
app.use((error, req, res, next) => {
    console.error(error);
    error_controller_1.default.get500page(req, res, next);
});
//---------Start server--------
async function startServer() {
    try {
        await prisma.$connect();
        console.log('Connected to the database');
        app.listen(3000, () => {
            console.log('Server is running on port 3000');
        });
    }
    catch (error) {
        console.error('Error connecting to the database:', error);
        await prisma.$disconnect();
        // Ensure to handle the error appropriately
        // For example, exit the application or retry connecting
    }
}
startServer();
//# sourceMappingURL=app.js.map