"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const transaction_controller_1 = require("../api/controllers/transaction.controller");
exports.router = (0, express_1.Router)();
exports.router.route('/').post(transaction_controller_1.createTransaction);
exports.router.route('/:id').get(transaction_controller_1.getTransactionByUserId).delete(transaction_controller_1.removeTransaction).put(transaction_controller_1.updateTransaction);
//# sourceMappingURL=transaction.routes.js.map