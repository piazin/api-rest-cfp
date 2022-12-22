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
const index_1 = __importDefault(require("../../../config/index"));
const user_service_1 = require("../user.service");
const user = new user_service_1.userService();
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, mongoose_1.connect)(index_1.default.db.url);
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.connection.close();
}));
describe('user service', () => {
    it('find one user by id', () => __awaiter(void 0, void 0, void 0, function* () {
        var user_id = '63a305816e3e7773800901c2';
        const data = yield user.findOneUserByID(user_id);
        expect(data.email).toBe(data.email);
    }));
    it('sign user', () => __awaiter(void 0, void 0, void 0, function* () {
        var data = yield user.signInUser('suporte2@slpart.com.br', 'Piazin25$');
        expect(data).toBeTruthy();
    }));
});
//# sourceMappingURL=user.service.test.js.map