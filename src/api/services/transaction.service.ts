import Joi from 'joi';
import { model } from 'mongoose';
import { Request } from 'express';
import constants from '../../constants/transaction.constants';
import { TransactionSchema } from '../models/Transaction';
import { User } from '../models/User';
import { ITransaction } from '../models/Transaction';
import { isIdValid } from '../../utils/isIdValid';
import { isOwner } from '../../utils/isOwner';

const Transaction = model('transaction', TransactionSchema);
const {
  err: { invalidValue, invalidDescription, invalidFields, invalidID, isNotOwner },
} = constants;

class transactionService {
  async create(transaction: ITransaction, user_id: string) {
    const validationSchema = Joi.object({
      value: Joi.number().required().error(new Error(invalidValue)),
      description: Joi.string().min(1).max(100).required().error(new Error(invalidDescription)),
      category: Joi.string().required().error(new Error(invalidFields)),
      date: Joi.date().required().error(new Error(invalidFields)),
      owner: Joi.string().required().error(new Error(invalidFields)),
      type: Joi.string().required().error(new Error(invalidFields)),
    });
    await validationSchema.validateAsync(transaction);

    var totalBalance: number;
    var { balance } = await User.findById(user_id);

    if (transaction.type != 'expense' && transaction.type != 'income')
      throw new Error('invalid type');
    if (balance === null || balance === undefined) throw new Error('invalid balance');

    totalBalance =
      transaction.type == 'expense'
        ? (balance * 100 - transaction.value * 100) / 100
        : (balance * 100 + transaction.value * 100) / 100;

    await User.findByIdAndUpdate(user_id, { balance: totalBalance }, { new: true });

    const response = await Transaction.create(transaction);
    return response;
  }

  async update(id: string, transactionUpdate: ITransaction) {
    if (!id || !isIdValid(id)) throw new Error(invalidID);

    const transactionRes: ITransaction = await Transaction.findById(id);

    if (!transactionRes) throw new Error(invalidID);
    if (!isOwner(transactionUpdate.owner, transactionRes.owner))
      throw { status: 401, message: isNotOwner };

    var totalBalance: number;
    var { balance } = await User.findById(transactionRes.owner);
    if (balance === null || balance === undefined) throw new Error('invalid balance');

    balance =
      transactionUpdate.type == 'expense'
        ? (balance * 100 - transactionUpdate.value * 100) / 100
        : (balance * 100 + transactionUpdate.value * 100) / 100;

    totalBalance =
      transactionUpdate.type == 'expense'
        ? (balance * 100 - transactionUpdate.value * 100) / 100
        : (balance * 100 + transactionUpdate.value * 100) / 100;

    await User.findByIdAndUpdate(transactionRes.owner, { balance: totalBalance }, { new: true });
    const response = await Transaction.findByIdAndUpdate(id, transactionUpdate, { new: true });
    return response;
  }

  async delete(id: string) {
    if (!id || !isIdValid(id)) throw new Error(invalidID);

    const transactionRes: ITransaction = await Transaction.findById(id);
    if (!transactionRes) throw new Error(invalidID);

    if (!isOwner('634dee1f21a851fa2c1cb153', transactionRes.owner))
      throw { status: 401, message: isNotOwner };

    const response = await Transaction.findByIdAndDelete(id);

    if (!response) throw new Error(invalidID);

    return response;
  }

  async find(owner: string, reqQuery: Request) {
    const queryObj = { ...reqQuery.query };
    console.log(queryObj);

    const response = await Transaction.find({ owner: owner }).sort('-created_at');
    return {
      data: response,
      results: response.length,
    };
  }
}

export default transactionService;
