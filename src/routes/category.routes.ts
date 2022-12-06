import { Router } from 'express';
import { create, findAll } from '../api/controllers/category.controller';

export const router = Router();

router.route('/').get(findAll).post(create);
