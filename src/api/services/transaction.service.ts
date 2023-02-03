import Joi from 'joi';
import { User } from '../models';
import { Request } from 'express';
import { isOwner } from '../../utils/isOwner';
import { isIdValid } from '../../utils/isIdValid';
import { Transaction, ITransaction } from '../models';
import constants from '../../constants/transaction.constants';
import { Either, left, right } from '../../errors/either';
import { ValidationError } from '../../errors/error';

const {
  err: { invalidValue, invalidDescription, invalidFields, invalidID, isNotOwner },
} = constants;

type ResponseTransaction = Either<ValidationError, ITransaction>;
type ResponseTransactionVoid = Either<ValidationError, void | string>;
type ResponseTransactionArray = Either<ValidationError, Array<ITransaction>>;

class transactionService {
  async create(transaction: ITransaction, user_id: string): Promise<ResponseTransaction> {
    const validationSchema = Joi.object({
      value: Joi.number().required().error(new Error(invalidValue)),
      description: Joi.string().min(1).max(100).required().error(new Error(invalidDescription)),
      category: Joi.string().required().error(new Error(invalidFields)),
      date: Joi.date().required().error(new Error(invalidFields)),
      owner: Joi.string().required().error(new Error(invalidFields)),
      type: Joi.string().required().error(new Error(invalidFields)),
    });
    const { error, value } = await validationSchema.validate(transaction);
    if (error) return left(new ValidationError({ message: error.message, statusCode: 400 }));

    if (!user_id)
      return left(new ValidationError({ message: 'user id required', statusCode: 400 }));

    if (!isIdValid(user_id))
      return left(new ValidationError({ message: invalidID, statusCode: 400 }));

    var totalBalance: number;
    transaction.owner = user_id;
    var { balance } = await User.findById(user_id);

    if (transaction.type != 'expense' && transaction.type != 'income')
      return left(new ValidationError({ message: 'invalid type', statusCode: 400 }));

    if (balance === null || balance === undefined)
      return left(new ValidationError({ message: 'invalid type', statusCode: 400 }));

    totalBalance =
      transaction.type == 'expense'
        ? (balance * 100 - transaction.value * 100) / 100
        : (balance * 100 + transaction.value * 100) / 100;

    await User.findByIdAndUpdate(user_id, { balance: totalBalance }, { new: true });

    const response = await Transaction.create(transaction);
    return right({
      _id: response._id,
      value: response.value,
      category: response.category,
      description: response.description,
      date: response.date,
      owner: response.owner,
      type: response.type,
      created_at: response.created_at,
    });
  }

  async update(id: string, transactionUpdate: ITransaction): Promise<ResponseTransaction> {
    if (!id || !isIdValid(id))
      return left(new ValidationError({ message: invalidID, statusCode: 400 }));

    const transactionRes: ITransaction = await Transaction.findById(id);

    if (!transactionRes) return left(new ValidationError({ message: invalidID, statusCode: 400 }));
    if (!isOwner(transactionUpdate.owner, transactionRes.owner))
      return left(new ValidationError({ message: isNotOwner, statusCode: 401 }));

    var totalBalance: number;
    var { balance } = await User.findById(transactionRes.owner);
    if (balance === null || balance === undefined)
      return left(new ValidationError({ message: 'invalid balance', statusCode: 400 }));

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
    return right({
      _id: response._id,
      value: response.value,
      category: response.category,
      description: response.description,
      date: response.date,
      owner: response.owner,
      type: response.type,
      created_at: response.created_at,
    });
  }

  async delete(id: string): Promise<ResponseTransactionVoid> {
    if (!id || !isIdValid(id))
      return left(new ValidationError({ message: invalidID, statusCode: 400 }));

    const transactionRes: ITransaction = await Transaction.findById(id);
    if (!transactionRes) return left(new ValidationError({ message: invalidID, statusCode: 400 }));

    if (!isOwner('63a0fd76204d8996c1d87a5a', transactionRes.owner))
      return left(new ValidationError({ message: isNotOwner, statusCode: 401 }));

    const response = await Transaction.findByIdAndDelete(id);

    if (!response) return left(new ValidationError({ message: invalidID, statusCode: 400 }));

    return right('sucess');
  }

  async findByOwnerID(owner: string, reqQuery: Request): Promise<ResponseTransactionArray> {
    const queryObj = { ...reqQuery.query };
    var transactions: Array<ITransaction> = [];

    if (!isIdValid(owner))
      return left(new ValidationError({ message: invalidID, statusCode: 400 }));

    const response = await Transaction.find({ owner: owner }).sort('-created_at');

    response.forEach((transaction) => {
      transactions = [...transactions, transaction];
    });

    return right(transactions);
  }
}

export default transactionService;
