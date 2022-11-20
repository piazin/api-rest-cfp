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
exports.create = void 0;
const category_service_1 = __importDefault(require("../services/category.service"));
const { create: createService } = new category_service_1.default();
function create(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield createService(req.body);
            return res.status(201).json({
                status: 201,
                data: response,
            });
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({
                status: 500,
                message: "",
            });
        }
    });
}
exports.create = create;
//# sourceMappingURL=category.controller.js.map