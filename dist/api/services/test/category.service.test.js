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
const mongoose_1 = require("mongoose");
const config_1 = __importDefault(require("../../../config"));
const category_service_1 = __importDefault(require("../category.service"));
const category = new category_service_1.default();
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, mongoose_1.connect)(config_1.default.db.url);
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.connection.close();
}));
describe('Category Service', () => {
    test('create new category', () => __awaiter(void 0, void 0, void 0, function* () {
        const data = yield category.create({
            title: 'Investimentos',
            iconName: 'finance',
            type: 'income',
        });
        expect(data).toBeTruthy();
    }));
});
//# sourceMappingURL=category.service.test.js.map