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
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const Category_1 = require("../models/Category");
const Category = (0, mongoose_1.model)("category", Category_1.CategorySchema);
class categoryService {
    create(categoryObj) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield Category.create({
                title: categoryObj.title,
            });
            return response;
        });
    }
}
exports.default = categoryService;
//# sourceMappingURL=category.service.js.map