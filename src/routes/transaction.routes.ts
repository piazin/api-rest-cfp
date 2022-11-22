import { Router } from 'express';
import {
  createTransaction,
  getTransactionByUserId,
  removeTransaction,
  updateTransaction,
} from '../api/controllers/transaction.controller';

import auth from '../api/middlewares/auth';

export const router = Router();

router.route('/').post(auth, createTransaction);
router.route('/:id').get(getTransactionByUserId).delete(removeTransaction).put(updateTransaction);
