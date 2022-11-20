import Joi from 'joi';
import { model, Types } from 'mongoose';
import constants from '../../constants/transaction.constants';
import { TransactionSchema } from '../models/Transaction';
import { ITransaction } from '../models/Transaction';
import { isIdValid } from '../../utils/isIdValid';
import { isOwner } from '../../utils/isOwner';

const Transaction = model('transaction', TransactionSchema);
const {
  err: { invalidValue, invalidDescription, invalidFields, invalidID, isNotOwner },
} = constants;

class transactionService {
  async create(transaction: ITransaction) {
    const validationSchema = Joi.object({
      value: Joi.number().required().error(new Error(invalidValue)),
      description: Joi.string().min(1).max(100).required().error(new Error(invalidDescription)),
      category: Joi.string().required().error(new Error(invalidFields)),
      date: Joi.date().required().error(new Error(invalidFields)),
      owner: Joi.string().required().error(new Error(invalidFields)),
      type: Joi.string().required().error(new Error(invalidFields)),
    });

    await validationSchema.validateAsync(transaction);

    const response = await Transaction.create(transaction);

    return response;
  }

  async update(id: string, transaction: ITransaction) {
    if (!id || !isIdValid(id)) throw new Error(invalidID);

    const transactionRes: ITransaction = await Transaction.findById(id);

    if (!transactionRes) throw new Error(invalidID);
    if (!isOwner(transaction.owner, transactionRes.owner))
      throw { status: 401, message: isNotOwner };

    const response = await Transaction.findByIdAndUpdate(id, transaction, { new: true });

    if (!response) throw new Error(invalidID);

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

  async find(owner: string) {
    const response = await Transaction.find({ owner: owner });
    return {
      data: response,
      results: response.length,
    };
  }
}

export default transactionService;
