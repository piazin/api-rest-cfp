"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeTransaction = exports.updateTransaction = exports.createTransaction = exports.getTransactionByUserId = void 0;
const transaction_service_1 = __importDefault(require("../services/transaction.service"));
const transaction = new transaction_service_1.default();
function getTransactionByUserId(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield transaction.findByOwnerID(req.params.id, req);
            return res.status(200).json({
                status: 200,
                results: response.results,
                data: {
                    transactions: response.data,
                },
            });
        }
        catch ({ message }) {
            console.error(message);
            return res.status(400).json({
                status: 400,
                message: message,
            });
        }
    });
}
exports.getTransactionByUserId = getTransactionByUserId;
function createTransaction(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield transaction.create(req.body, req.user.user_id);
            return res.status(201).json({
                status: 201,
                data: response,
            });
        }
        catch ({ message }) {
            console.error(message);
            return res.status(400).json({
                status: 400,
                message,
            });
        }
    });
}
exports.createTransaction = createTransaction;
function updateTransaction(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield transaction.update(req.params.id, req.body);
            res.status(200).json({
                status: 200,
                data: response,
            });
        }
        catch ({ message }) {
            console.error(message);
            res.status(400).json({
                status: 400,
                message: message,
            });
        }
    });
}
exports.updateTransaction = updateTransaction;
function removeTransaction(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield transaction.delete(req.params.id);
            res.status(204).json({
                status: 204,
                message: response,
            });
        }
        catch ({ status, message }) {
            console.error(message);
            res.status(status).json({
                status: status,
                message,
            });
        }
    });
}
exports.removeTransaction = removeTransaction;
//# sourceMappingURL=transaction.controller.js.map