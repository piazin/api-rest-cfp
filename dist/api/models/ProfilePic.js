"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfilePicSchema = void 0;
const mongoose_1 = require("mongoose");
exports.ProfilePicSchema = new mongoose_1.Schema({
    filename: {
        type: String,
        required: [true, 'A Image must have a filename'],
        unique: true,
    },
    mimetype: String,
    url: String,
    size: Number,
    googleFileId: String,
    owner: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'user',
    },
});
//# sourceMappingURL=ProfilePic.js.map