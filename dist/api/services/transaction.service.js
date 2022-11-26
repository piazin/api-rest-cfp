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
const Transaction = (0, mongoose_1.model)('transaction', Transaction_1.TransactionSchema);
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
            console.log(balance);
            if (transaction.type != 'expense' && transaction.type != 'income')
                throw new Error('invalid type');
            if (balance === null || balance === undefined)
                throw new Error('invalid balance');
            totalBalance =
                transaction.type == 'expense'
                    ? (balance -= transaction.value)
                    : (balance += transaction.value);
            yield User_1.User.findByIdAndUpdate(user_id, { balance: totalBalance });
            const response = yield Transaction.create(transaction);
            return response;
        });
    }
    update(id, transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!id || !(0, isIdValid_1.isIdValid)(id))
                throw new Error(invalidID);
            const transactionRes = yield Transaction.findById(id);
            if (!transactionRes)
                throw new Error(invalidID);
            if (!(0, isOwner_1.isOwner)(transaction.owner, transactionRes.owner))
                throw { status: 401, message: isNotOwner };
            const response = yield Transaction.findByIdAndUpdate(id, transaction, { new: true });
            if (!response)
                throw new Error(invalidID);
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
    find(owner) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield Transaction.find({ owner: owner });
            return {
                data: response,
                results: response.length,
            };
        });
    }
}
exports.default = transactionService;
//# sourceMappingURL=transaction.service.js.map