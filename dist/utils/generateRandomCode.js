"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRandomCode = void 0;
const crypto_1 = require("crypto");
const seedrandom_1 = __importDefault(require("seedrandom"));
const generateRandomCode = () => {
    var code;
    var randomBytesGenerated = (0, crypto_1.randomBytes)(64).toString('base64');
    var generatedCode = (0, seedrandom_1.default)(randomBytesGenerated, { entropy: true })();
    code = parseInt(generatedCode.toString().replace(/[0.]/g, '').substring(3, 9));
    return code;
};
exports.generateRandomCode = generateRandomCode;
//# sourceMappingURL=generateRandomCode.js.map