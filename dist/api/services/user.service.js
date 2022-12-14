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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const mongoose_1 = require("mongoose");
const joi_1 = __importDefault(require("joi"));
const User_1 = require("../models/User");
const token_service_1 = __importDefault(require("./token.service"));
const ProfilePic_1 = require("../models/ProfilePic");
const user_constants_1 = __importDefault(require("../../constants/user.constants"));
const googleDriveApi_1 = require("../../utils/googleDriveApi");
const isIdValid_1 = require("../../utils/isIdValid");
const ProfilePic = (0, mongoose_1.model)('Profilepic', ProfilePic_1.ProfilePicSchema);
const { isCodeChecked, setCodeUsed } = new token_service_1.default();
const { err: { invalidUser, invalidGoogleFileId, userNotFound }, } = user_constants_1.default;
class userService {
    findOneUserByID(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            var response = yield User_1.User.findOne({ _id: user_id }).select('-password -__v');
            if (!response)
                return {};
            var avatar = yield ProfilePic.findOne({ owner: user_id });
            response.avatar = avatar;
            response.transactions = `http://localhost:8080/api/v1/transaction/${response._id}`;
            return response;
        });
    }
    createUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const schemaValidation = joi_1.default.object({
                email: joi_1.default.string().required(),
                name: joi_1.default.string().min(1).required(),
                password: joi_1.default.string().min(6).required(),
            }).error(new Error('all fields required'));
            yield schemaValidation.validateAsync(user);
            const findUser = yield User_1.User.findOne({ email: user.email });
            if (findUser)
                throw new Error('Usuário já cadastrado');
            var userCreated = yield User_1.User.create(user);
            var token = userCreated.generateJwt();
            const { _id, name, email, balance, transactions, avatar, created_at } = userCreated;
            return {
                _id,
                name,
                email,
                balance,
                transactions,
                avatar,
                created_at,
                token,
            };
        });
    }
    changePassword(user_id, password) {
        return __awaiter(this, void 0, void 0, function* () {
            var codeChecked = yield isCodeChecked(user_id);
            if (!codeChecked.status)
                throw new Error('Seu codigo já foi ultilizado');
            var user = yield User_1.User.findOneAndUpdate({ _id: user_id }, { password: password }, { new: true });
            if (!user)
                throw new Error(userNotFound);
            yield setCodeUsed(codeChecked.resCode._id);
            return `Senha alterada`;
        });
    }
    signInUser(emailUser, password) {
        return __awaiter(this, void 0, void 0, function* () {
            var user = yield User_1.User.findOne({ email: emailUser }).select('-__v');
            if (!user)
                throw { message: 'Usuário não encotrado', statusCode: 401 };
            if (!user.compareHash(password))
                throw { message: 'E-mail ou senha incorreta', statusCode: 403 };
            var profilePic = yield ProfilePic.findOne({ owner: user._id });
            user.avatar = profilePic;
            const token = user.generateJwt();
            const { _id, name, email, balance, transactions, avatar, created_at } = user;
            return {
                _id,
                name,
                email,
                balance,
                avatar,
                transactions,
                created_at,
                token,
            };
        });
    }
    uploadProfilePic(owner, avatar) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, isIdValid_1.isIdValid)(owner))
                throw new Error(invalidUser);
            const profilePicExists = yield ProfilePic.findOne({ owner: owner });
            if (profilePicExists) {
                yield (0, googleDriveApi_1.deleteFileGoogleDrive)(profilePicExists.googleFileId);
                yield profilePicExists.delete();
            }
            avatar.owner = owner;
            const { fieldname, destination, encoding, path } = avatar, rest = __rest(avatar, ["fieldname", "destination", "encoding", "path"]);
            const avatarFilter = Object.assign(Object.assign({}, rest), { url: path });
            var response = yield (0, googleDriveApi_1.uploadFileGoogleDrive)(avatarFilter);
            if (!response)
                throw new Error('Não foi possivel fazer o upload');
            avatarFilter.url = `https://drive.google.com/uc?export=view&id=${response.id}`;
            avatarFilter.googleFileId = response.id;
            return yield ProfilePic.create(avatarFilter);
        });
    }
    deleteProfilePic(fileId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!fileId)
                throw new Error(invalidGoogleFileId);
            const response = yield (0, googleDriveApi_1.deleteFileGoogleDrive)(fileId);
            return response;
        });
    }
}
exports.userService = userService;
//# sourceMappingURL=user.service.js.map