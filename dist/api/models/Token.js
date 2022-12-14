"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Token = void 0;
const mongoose_1 = require("mongoose");
const moment_1 = __importDefault(require("moment"));
const TokenSchema = new mongoose_1.Schema({
    code: {
        type: Number,
        required: true,
    },
    user_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'required user id'],
    },
    used: {
        type: Boolean,
        default: false,
    },
    checked: {
        type: Boolean,
        default: false,
    },
    created_at: {
        type: Number,
        default: (0, moment_1.default)().unix(),
    },
    expire_timestamp: {
        type: Number,
        default: (0, moment_1.default)().add(5, 'minutes').unix(),
    },
});
exports.Token = (0, mongoose_1.model)('Token', TokenSchema);
//# sourceMappingURL=Token.js.map