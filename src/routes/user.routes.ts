import { Router } from 'express';
import multer from 'multer';
import {
  create,
  find,
  uploadProfilePic,
  deleteProfilePic,
  login,
  verifyResetCode,
  changePassword,
  requestPasswordRecoveryCode,
} from '../api/controllers/user.controller';

import auth from '../api/middlewares/auth';

import multerConfig from '../config/multer.config';
const upload = multer(multerConfig);

export const router = Router();

router.route('/:id').get(find);
router.route('/login').post(login);
router.route('/register').post(create);

router.route('/change-password').patch(changePassword);
router.route('/verify-reset-code').post(verifyResetCode);
router.route('/password-reset-request').post(requestPasswordRecoveryCode);

router
  .route('/avatar')
  .post(auth, upload.single('avatar'), uploadProfilePic)
  .delete(auth, deleteProfilePic);
