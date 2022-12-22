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
exports.deleteFileGoogleDrive = exports.uploadFileGoogleDrive = void 0;
const fs_1 = __importDefault(require("fs"));
const googleapis_1 = require("googleapis");
const index_1 = __importDefault(require("../config/index"));
const { google_folder_id } = index_1.default;
const google_json_key = JSON.parse(process.env.GOOGLE_JSON_KEY);
// const google_json_key = JSON.parse(
//   fs.readFileSync(resolve('keys/google_json_key.json'), { encoding: 'utf-8' })
// );
const auth = new googleapis_1.google.auth.GoogleAuth({
    // keyFile: JSON.stringify(config.googleapikey),
    credentials: google_json_key,
    scopes: ['https://www.googleapis.com/auth/drive'],
});
const driveService = googleapis_1.google.drive({
    version: 'v3',
    auth,
});
function uploadFileGoogleDrive(fileInfo) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const fileMetaData = {
                name: fileInfo.filename,
                parents: [google_folder_id],
            };
            const media = {
                mimeType: fileInfo.mimetype,
                body: fs_1.default.createReadStream(fileInfo.url),
            };
            const response = yield driveService.files.create({
                requestBody: fileMetaData,
                media: media,
                fields: 'id',
            });
            fs_1.default.unlink(fileInfo.url, (err) => {
                if (err)
                    throw err;
            });
            return response.data;
        }
        catch (error) {
            console.error(error.message);
            return;
        }
    });
}
exports.uploadFileGoogleDrive = uploadFileGoogleDrive;
function deleteFileGoogleDrive(fileId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield driveService.files.delete({
                fileId: fileId,
            });
            return {
                status: response.status,
                data: response.data,
            };
        }
        catch (error) {
            console.error(error);
            return error.message;
        }
    });
}
exports.deleteFileGoogleDrive = deleteFileGoogleDrive;
//# sourceMappingURL=googleDriveApi.js.map