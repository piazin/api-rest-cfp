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
exports.deleteProfilePic = exports.uploadProfilePic = exports.signIn = exports.create = exports.find = void 0;
const user_service_1 = require("../services/user.service");
const { createUser, findOneUserByID, uploadProfilePic: upProPic, deleteProfilePic: delProPic, signInUser, } = new user_service_1.userService();
function find(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            var response = yield findOneUserByID(req.params.id);
            return res.status(200).json({
                status: 200,
                data: response,
            });
        }
        catch ({ message }) {
            console.error(message);
            return res.status(400).json({
                status: 400,
                message: message,
            });
        }
    });
}
exports.find = find;
function create(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield createUser(req.body);
            return res.status(201).json({
                status: 201,
                data: response,
            });
        }
        catch (error) {
            console.error(error);
            return res.status(400).json({
                status: 400,
                message: error.message,
            });
        }
    });
}
exports.create = create;
function signIn(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield signInUser(req.body.email, req.body.password);
            return res.status(200).json({
                status: 200,
                message: 'authentication success',
                data: response,
            });
        }
        catch (error) {
            console.error(error);
            return res.status(400).json({
                status: 400,
                message: error.message,
            });
        }
    });
}
exports.signIn = signIn;
function uploadProfilePic(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield upProPic(req.body.owner, req.file);
            return res.status(200).json({
                status: 200,
                data: {
                    avatar: response,
                },
            });
        }
        catch ({ message }) {
            console.error(message);
            return res.status(400).json({
                status: 400,
                message: message,
            });
        }
    });
}
exports.uploadProfilePic = uploadProfilePic;
function deleteProfilePic(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield delProPic(req.body.fileId);
            return res.status(204).json({
                status: 204,
                data: response,
            });
        }
        catch ({ message }) {
            console.error(message);
            return res.status(400).json({
                status: 400,
                message: message,
            });
        }
    });
}
exports.deleteProfilePic = deleteProfilePic;
//# sourceMappingURL=user.controller.js.map