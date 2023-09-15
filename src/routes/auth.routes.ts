import { Router } from 'express';
import { login, register } from '@controllers/auth.controller';
const router = Router();

router.route('/auth/register').post(register);
router.route('/auth/login').post(login);

export { router };
