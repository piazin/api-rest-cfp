"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const transaction_controller_1 = require("../api/controllers/transaction.controller");
const auth_1 = __importDefault(require("../api/middlewares/auth"));
exports.router = (0, express_1.Router)();
exports.router.route('/').post(auth_1.default, transaction_controller_1.createTransaction);
exports.router.route('/:id').get(transaction_controller_1.getTransactionByUserId).delete(transaction_controller_1.removeTransaction).put(transaction_controller_1.updateTransaction);
//# sourceMappingURL=transaction.routes.js.map