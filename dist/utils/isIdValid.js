"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isIdValid = void 0;
const mongoose_1 = require("mongoose");
const isIdValid = (id) => mongoose_1.Types.ObjectId.isValid(id);
exports.isIdValid = isIdValid;
//# sourceMappingURL=isIdValid.js.map