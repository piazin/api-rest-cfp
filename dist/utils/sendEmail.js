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
const nodemailer_1 = __importDefault(require("nodemailer"));
const index_1 = __importDefault(require("../config/index"));
function sendEmail(user_email, user_name, code) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let trasporter = nodemailer_1.default.createTransport({
                service: 'gmail',
                auth: {
                    user: index_1.default.email.user,
                    pass: index_1.default.email.pass,
                },
            });
            let mailConfig = {
                from: {
                    name: 'Equipe CFP',
                    address: 'financeinnovcfp@gmail.com',
                },
                to: user_email,
                subject: 'Seu codigo de uso unico',
                html: `
      <p>Olá <strong>${user_name}</strong></p>
      <p>Nós recebemos uma solicitação para um código de uso único para a sua conta.</p>
      <p>Seu código de uso único é: <strong>${code}</strong></p>
      <p>Obrigado,</p>
      <p>Equipe de contas CFP</p>
      `,
            };
            yield trasporter.sendMail(mailConfig);
            return true;
        }
        catch (error) {
            console.error(error.message);
            return false;
        }
    });
}
exports.default = sendEmail;
//# sourceMappingURL=sendEmail.js.map