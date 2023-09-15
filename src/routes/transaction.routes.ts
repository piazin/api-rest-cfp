import { Router } from 'express';
import auth from '@middlewares/auth';
import { createTransaction, getTransactionByUserId, removeTransaction, updateTransaction } from '@controllers/transaction.controller';

export const router = Router();

router.route('/transaction').all(auth).get(getTransactionByUserId).post(createTransaction);
router.route('/transaction/:id').all(auth).delete(removeTransaction).put(updateTransaction);
