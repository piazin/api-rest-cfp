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
const crypto_1 = __importDefault(require("crypto"));
const moment_1 = __importDefault(require("moment"));
const seedrandom_1 = __importDefault(require("seedrandom"));
const Token_1 = require("../models/Token");
const User_1 = require("../models/User");
const user_constants_1 = __importDefault(require("../../constants/user.constants"));
const sendEmail_1 = __importDefault(require("../../utils/sendEmail"));
const { err: { userNotFound, failSendEmail }, } = user_constants_1.default;
class TokenService {
    generatePassRecoveryCode(email, ip) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!email)
                throw new Error('Email invalido');
            const user = yield User_1.User.findOne({ email: email });
            if (!user)
                throw new Error(userNotFound);
            var code;
            var randomBytes = crypto_1.default.randomBytes(64).toString('base64');
            var generateCode = (0, seedrandom_1.default)(randomBytes, { entropy: true });
            code = parseInt(generateCode().toString().substring(3, 9));
            yield Token_1.Token.create({ code, user_id: user._id });
            var emailSendingStatus = yield (0, sendEmail_1.default)(user.email, user.name, code);
            if (!emailSendingStatus)
                throw new Error(failSendEmail);
            return `Enviamos um email para ${user.email}`;
        });
    }
    validateTokenCode(code) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!code)
                throw new Error('Codigo invalido');
            var resCode = yield Token_1.Token.findOne({ code });
            if (!resCode)
                throw new Error('Codigo invalido');
            if (resCode.used)
                throw new Error('Codigo já ultilizado');
            var currentTime = (0, moment_1.default)().unix();
            if (resCode.expire_timestamp < currentTime)
                throw new Error('Codigo expirado');
            yield resCode.updateOne({ checked: true });
            return true;
        });
    }
    isCodeChecked(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            var resCode = yield Token_1.Token.findOne({ user_id: user_id, used: false });
            if (!resCode)
                throw new Error('Codigo não encontrado ou invalido');
            if (!resCode.checked)
                throw new Error('Codigo não foi verificado');
            if (resCode.used)
                throw new Error('Codigo já foi ultilizado');
            return true;
        });
    }
    setCodeUsed(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Token_1.Token.findOneAndUpdate({ user_id: user_id }, { $set: { used: true } });
        });
    }
}
exports.default = TokenService;
//# sourceMappingURL=token.service.js.map