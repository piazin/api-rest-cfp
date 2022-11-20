"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const multer_1 = __importDefault(require("multer"));
const crypto_1 = __importDefault(require("crypto"));
const tmpFolder = path_1.default.resolve("tmp", "uploads");
exports.default = {
    dest: tmpFolder,
    storage: multer_1.default.diskStorage({
        destination: function (req, file, cb) {
            cb(null, tmpFolder);
        },
        filename(req, file, cb) {
            const uuidFilename = crypto_1.default.randomUUID();
            const filename = `${uuidFilename}-${file.originalname}`;
            cb(null, filename);
        },
    }),
    limits: {
        fileSize: 2 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        const allowMimeTypes = ["image/jpeg", "image/gjpeg", "image/png"];
        if (allowMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            cb(new Error("Invalid file type"));
        }
    },
};
//# sourceMappingURL=multer.config.js.map