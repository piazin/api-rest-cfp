import { Router } from 'express';
import {
  createTransaction,
  getTransactionByUserId,
  removeTransaction,
  updateTransaction,
} from '../api/controllers/transaction.controller';

export const router = Router();

router.route('/').post(createTransaction);
router.route('/:id').get(getTransactionByUserId).delete(removeTransaction).put(updateTransaction);
