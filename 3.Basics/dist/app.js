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
const client_1 = require("@prisma/client");
const prisma_session_store_1 = require("@quixo3/prisma-session-store");
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
dotenv_1.default.config();
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
//Express session
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
//Fake request for dev only purpose
app.use(async (req, res, next) => {
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
        console.log('-------User object created successfully------');
        next();
    }
    catch (error) {
        console.log(error);
    }
});
//---------Routes----
app.use('/admin', admin_route_1.default);
app.use(shop_route_1.default);
app.use(auth_route_1.default);
app.use(error_controller_1.default.get404page);
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