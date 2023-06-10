import { Router } from 'express';
import multer from 'multer';
import {
  find,
  update,
  uploadProfilePic,
  deleteProfilePic,
  verifyResetCode,
  changePassword,
  requestPasswordRecoveryCode,
} from '../api/controllers/user.controller';

import auth from '../api/middlewares/auth';

import multerConfig from '../config/multer.config';
const upload = multer(multerConfig);

export const router = Router();

router.route('/user').all(auth).get(find).put(update);
router.route('/user/change-password').patch(changePassword);
router.route('/user/verify-reset-code').post(verifyResetCode);
router.route('/user/password-reset-request').post(requestPasswordRecoveryCode);
router.route('/user/avatar').all(auth).post(upload.single('avatar'), uploadProfilePic).delete(deleteProfilePic);
