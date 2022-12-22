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
const joi_1 = __importDefault(require("joi"));
const mongoose_1 = require("mongoose");
const transaction_constants_1 = __importDefault(require("../../constants/transaction.constants"));
const Transaction_1 = require("../models/Transaction");
const User_1 = require("../models/User");
const isIdValid_1 = require("../../utils/isIdValid");
const isOwner_1 = require("../../utils/isOwner");
const Transaction = (0, mongoose_1.model)('Transaction', Transaction_1.TransactionSchema);
const { err: { invalidValue, invalidDescription, invalidFields, invalidID, isNotOwner }, } = transaction_constants_1.default;
class transactionService {
    create(transaction, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const validationSchema = joi_1.default.object({
                value: joi_1.default.number().required().error(new Error(invalidValue)),
                description: joi_1.default.string().min(1).max(100).required().error(new Error(invalidDescription)),
                category: joi_1.default.string().required().error(new Error(invalidFields)),
                date: joi_1.default.date().required().error(new Error(invalidFields)),
                owner: joi_1.default.string().required().error(new Error(invalidFields)),
                type: joi_1.default.string().required().error(new Error(invalidFields)),
            });
            yield validationSchema.validateAsync(transaction);
            var totalBalance;
            var { balance } = yield User_1.User.findById(user_id);
            if (transaction.type != 'expense' && transaction.type != 'income')
                throw new Error('invalid type');
            if (balance === null || balance === undefined)
                throw new Error('invalid balance');
            totalBalance =
                transaction.type == 'expense'
                    ? (balance * 100 - transaction.value * 100) / 100
                    : (balance * 100 + transaction.value * 100) / 100;
            yield User_1.User.findByIdAndUpdate(user_id, { balance: totalBalance }, { new: true });
            const response = yield Transaction.create(transaction);
            return response;
        });
    }
    update(id, transactionUpdate) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!id || !(0, isIdValid_1.isIdValid)(id))
                throw new Error(invalidID);
            const transactionRes = yield Transaction.findById(id);
            if (!transactionRes)
                throw new Error(invalidID);
            if (!(0, isOwner_1.isOwner)(transactionUpdate.owner, transactionRes.owner))
                throw { status: 401, message: isNotOwner };
            var totalBalance;
            var { balance } = yield User_1.User.findById(transactionRes.owner);
            if (balance === null || balance === undefined)
                throw new Error('invalid balance');
            balance =
                transactionUpdate.type == 'expense'
                    ? (balance * 100 - transactionUpdate.value * 100) / 100
                    : (balance * 100 + transactionUpdate.value * 100) / 100;
            totalBalance =
                transactionUpdate.type == 'expense'
                    ? (balance * 100 - transactionUpdate.value * 100) / 100
                    : (balance * 100 + transactionUpdate.value * 100) / 100;
            yield User_1.User.findByIdAndUpdate(transactionRes.owner, { balance: totalBalance }, { new: true });
            const response = yield Transaction.findByIdAndUpdate(id, transactionUpdate, { new: true });
            return response;
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!id || !(0, isIdValid_1.isIdValid)(id))
                throw new Error(invalidID);
            const transactionRes = yield Transaction.findById(id);
            if (!transactionRes)
                throw new Error(invalidID);
            if (!(0, isOwner_1.isOwner)('634dee1f21a851fa2c1cb153', transactionRes.owner))
                throw { status: 401, message: isNotOwner };
            const response = yield Transaction.findByIdAndDelete(id);
            if (!response)
                throw new Error(invalidID);
            return response;
        });
    }
    findByOwnerID(owner, reqQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryObj = Object.assign({}, reqQuery.query);
            const response = yield Transaction.find({ owner: owner }).sort('-created_at');
            return {
                data: response,
                results: response.length,
            };
        });
    }
}
exports.default = transactionService;
//# sourceMappingURL=transaction.service.js.map