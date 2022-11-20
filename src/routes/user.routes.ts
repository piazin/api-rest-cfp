import { Router } from 'express';
import multer from 'multer';
import {
  create,
  find,
  uploadProfilePic,
  deleteProfilePic,
  signIn,
} from '../api/controllers/user.controller';

import auth from '../api/middlewares/auth';

import multerConfig from '../config/multer.config';
const upload = multer(multerConfig);

export const router = Router();

router.route('/:id').get(find);
router.route('/').post(create);
router.route('/authenticate').post(signIn);
router.route('/avatar').post(upload.single('avatar'), uploadProfilePic).delete(deleteProfilePic);
