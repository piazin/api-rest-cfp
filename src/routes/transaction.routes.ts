import { Router } from 'express';
import {
  createTransaction,
  getTransactionByUserId,
  removeTransaction,
  updateTransaction,
} from '../api/controllers/transaction.controller';

import auth from '../api/middlewares/auth';

export const router = Router();

router.route('/transaction').post(auth, createTransaction);
router
  .route('/transaction/:id')
  .get(auth, getTransactionByUserId)
  .delete(auth, removeTransaction)
  .put(auth, updateTransaction);
