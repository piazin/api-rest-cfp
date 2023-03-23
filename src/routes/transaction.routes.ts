import { Router } from 'express';
import {
  createTransaction,
  getTransactionByUserId,
  removeTransaction,
  updateTransaction,
} from '../api/controllers/transaction.controller';

import auth from '../api/middlewares/auth';

export const router = Router();

router.route('/transaction').get(auth, getTransactionByUserId).post(auth, createTransaction);
router.route('/transaction/:id').delete(auth, removeTransaction).put(auth, updateTransaction);
