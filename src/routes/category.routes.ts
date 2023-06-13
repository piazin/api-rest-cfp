import { Router } from 'express';
import { create, findAll, remove } from '../api/controllers/category.controller';
import auth from '../api/middlewares/auth';

export const router = Router();

router.route('/category').all(auth).get(findAll).post(create);
router.route('/category/:id').all(auth).delete(remove);
