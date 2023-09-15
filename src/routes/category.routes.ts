import { Router } from 'express';
import auth from '@middlewares/auth';
import { create, findAll, remove } from '@controllers/category.controller';

export const router = Router();

router.route('/category').all(auth).get(findAll).post(create);
router.route('/category/:id').all(auth).delete(remove);
