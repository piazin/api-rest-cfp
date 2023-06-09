import { Router } from 'express';
import { createTransaction, getTransactionByUserId, removeTransaction, updateTransaction } from '../api/controllers/transaction.controller';

import auth from '../api/middlewares/auth';

export const router = Router();

router.route('/transaction').all(auth).get(getTransactionByUserId).post(createTransaction);
router.route('/transaction/:id').all(auth).delete(removeTransaction).put(updateTransaction);
