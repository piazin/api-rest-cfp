"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategorySchema = void 0;
const mongoose_1 = require("mongoose");
exports.CategorySchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
    },
    iconName: {
        type: String,
        required: true,
    },
    type: String,
});
//# sourceMappingURL=Category.js.map