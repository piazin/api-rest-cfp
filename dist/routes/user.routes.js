"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const user_controller_1 = require("../api/controllers/user.controller");
const multer_config_1 = __importDefault(require("../config/multer.config"));
const upload = (0, multer_1.default)(multer_config_1.default);
exports.router = (0, express_1.Router)();
exports.router.route('/:id').get(user_controller_1.find);
exports.router.route('/').post(user_controller_1.create);
exports.router.route('/authenticate').post(user_controller_1.signIn);
exports.router.route('/change-password').patch(user_controller_1.changePassword);
exports.router.route('/verify-reset-code').post(user_controller_1.validateCode);
exports.router.route('/password-reset-request').post(user_controller_1.requestPasswordRecoveryCode);
exports.router.route('/avatar').post(upload.single('avatar'), user_controller_1.uploadProfilePic).delete(user_controller_1.deleteProfilePic);
//# sourceMappingURL=user.routes.js.map