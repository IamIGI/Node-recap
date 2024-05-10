"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const path_2 = __importDefault(require("../util/path"));
const router = express_1.default.Router();
router.get('/add-product', (req, res, next) => {
    res.sendFile(path_1.default.join(path_2.default, 'views', 'add-product.html'));
});
router.post('/add-product', (req, res, next) => {
    console.log(req.body);
    res.send('<h1>Add product</h1>');
});
exports.default = router;
