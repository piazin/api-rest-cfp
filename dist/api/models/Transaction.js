"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionSchema = void 0;
const mongoose_1 = require("mongoose");
exports.TransactionSchema = new mongoose_1.Schema({
    value: {
        type: Number,
        required: [true, "A Transaction must have a value"],
    },
    date: {
        type: String,
        required: [true, "A Transaction must have a date"],
    },
    description: {
        type: String,
    },
    category: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Category",
    },
    type: {
        type: String,
        required: [true, "A Transaction must have a type"],
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    owner: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "A Transaction must have a owner"],
    },
});
//# sourceMappingURL=Transaction.js.map