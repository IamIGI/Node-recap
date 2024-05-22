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
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
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
app.use(async (req, res, next) => {
    let users = await prisma.user.findMany({
        where: { id: '4b46fcca-a09e-455f-b23b-08e1c0e1cf12' },
    });
    if (users.length === 0 || !users) {
        users[0] = await prisma.user.create({
            data: {
                name: 'Igor',
                email: 'igorEmail@gmail.com', //remember that email has to be unique
            },
        });
        console.log('User created: ', users[0].id);
    }
    req.user = users[0];
    next();
});
//---------Routes----
app.use('/admin', admin_route_1.default);
app.use(shop_route_1.default);
app.use(error_controller_1.default.get404page);
async function startServer() {
    try {
        // Connect to the database
        await prisma.$connect();
        console.log('Connected to the database');
        // Start the server
        app.listen(3000, () => {
            console.log('Server is running on port 3000');
        });
    }
    catch (error) {
        console.error('Error connecting to the database:', error);
        // Ensure to handle the error appropriately
        // For example, exit the application or retry connecting
    }
}
startServer();
//# sourceMappingURL=app.js.map