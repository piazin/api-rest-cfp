"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const morgan_1 = __importDefault(require("morgan"));
const express_1 = __importDefault(require("express"));
const dbconnection_1 = __importDefault(require("./api/database/dbconnection"));
dbconnection_1.default.connections[0];
const category_routes_1 = require("./routes/category.routes");
const user_routes_1 = require("./routes/user.routes");
const transaction_routes_1 = require("./routes/transaction.routes");
const app = (0, express_1.default)();
// routes import
if (!(process.env.NODE_ENV === 'production'))
    app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use('/api/v1/user', user_routes_1.router);
app.use('/api/v1/category', category_routes_1.router);
app.use('/api/v1/transaction', transaction_routes_1.router);
app.use((err, req, res, next) => {
    if (err) {
        console.log(err);
        return res.status(400).json({
            status: 400,
            message: 'Ops! Bad Request',
        });
    }
    next();
});
app.use((req, res, next) => {
    res.status(404).json({
        status: 404,
        message: 'Ops Bad Request! Nothing around here',
    });
});
exports.default = app;
//# sourceMappingURL=app.js.map