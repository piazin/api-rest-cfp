"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isOwner = void 0;
const isOwner = (owner, transactionId) => {
    return JSON.stringify(owner) === JSON.stringify(transactionId);
};
exports.isOwner = isOwner;
//# sourceMappingURL=isOwner.js.map