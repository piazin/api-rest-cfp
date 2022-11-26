"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../config"));
const { jwt_secret } = config_1.default;
function default_1(req, res, next) {
    if (!req.headers.authorization)
        return res.status(404).json({
            status: 404,
            message: 'Invalid Token',
        });
    var token = req.headers.authorization.split(' ')[1];
    if (!token)
        return res.status(401).json({
            status: 401,
            message: 'unauthorized user',
        });
    jsonwebtoken_1.default.verify(token, jwt_secret, (err, decode) => {
        if (err)
            return res.status(401).json({ status: 401, message: err.message });
        req.user = decode;
        next();
    });
}
exports.default = default_1;
//# sourceMappingURL=auth.js.map