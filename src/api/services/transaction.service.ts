import { User } from '../models';
import { Request } from 'express';
import { isOwner } from '../../utils/isOwner';
import { isIdValid } from '../../utils/isIdValid';
import { left, right } from '../../errors/either';
import { ValidationError } from '../../errors/error';
import { Transaction, ITransaction } from '../models';
import constants from '../../constants/transaction.constants';
import { validateTransactionData } from '../../helpers/validateTransactionData';
import { MonthTransactions, MonthWithTransactions } from './interfaces/transactions';
import { ResponseTransaction, ResponseTransactionVoid, ResponseTransactionArray } from './types/transactions';

const { err } = constants;

class transactionService {
  async create(transaction: ITransaction, user_id: string): Promise<ResponseTransaction> {
    const { isValid, error } = validateTransactionData(transaction);
    if (!isValid) return left(new ValidationError({ message: error.message, statusCode: 400 }));

    if (transaction.type != 'expense' && transaction.type != 'income')
      return left(new ValidationError({ message: 'Tipo de transação inválida', statusCode: 400 }));

    if (!isIdValid(user_id)) return left(new ValidationError({ message: err.invalidID, statusCode: 400 }));

    transaction.owner = user_id;
    const user = await User.findById(user_id);

    if (user.balance === null || user.balance === undefined)
      return left(new ValidationError({ message: 'Saldo inválida', statusCode: 400 }));

    user.balance =
      transaction.type == 'expense'
        ? (user.balance * 100 - transaction.value * 100) / 100
        : (user.balance * 100 + transaction.value * 100) / 100;

    await user.save();

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

  async update(id: string, user_id: string, newTransactionData: ITransaction): Promise<ResponseTransaction> {
    const { isValid, error } = validateTransactionData(newTransactionData);
    if (!isValid) return left(new ValidationError({ message: error.message, statusCode: 400 }));

    if (!isIdValid(user_id) || !isIdValid(id)) return left(new ValidationError({ message: err.invalidID, statusCode: 400 }));

    if (newTransactionData.type !== 'expense' && newTransactionData.type !== 'income')
      return left(new ValidationError({ message: 'Tipo de transação inválida', statusCode: 400 }));

    const transactionExisting = await Transaction.findById(id);

    if (!transactionExisting) return left(new ValidationError({ message: err.invalidID, statusCode: 400 }));
    if (!isOwner(user_id, transactionExisting.owner)) return left(new ValidationError({ message: err.isNotOwner, statusCode: 401 }));

    const user = await User.findById(transactionExisting.owner);
    if (user.balance === null || user.balance === undefined)
      return left(new ValidationError({ message: 'invalid balance', statusCode: 400 }));

    user.balance =
      transactionExisting.type == 'expense'
        ? (user.balance * 100 + transactionExisting.value * 100) / 100
        : (user.balance * 100 - transactionExisting.value * 100) / 100;

    user.balance =
      newTransactionData.type == 'expense'
        ? (user.balance * 100 - newTransactionData.value * 100) / 100
        : (user.balance * 100 + newTransactionData.value * 100) / 100;

    await user.save();
    const response = await Transaction.findByIdAndUpdate(id, newTransactionData, { new: true });
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

  async delete(id: string, user_id: string): Promise<ResponseTransactionVoid> {
    if (!isIdValid(id) || !isIdValid(user_id)) return left(new ValidationError({ message: err.invalidID, statusCode: 400 }));

    const transaction = await Transaction.findById(id);
    if (!transaction) return left(new ValidationError({ message: err.invalidID, statusCode: 400 }));

    if (!isOwner(user_id, transaction.owner)) return left(new ValidationError({ message: err.isNotOwner, statusCode: 403 }));

    const deletedTransaction = await Transaction.findByIdAndDelete(id);
    if (!deletedTransaction) return left(new ValidationError({ message: 'Não foi possível excluir a transação', statusCode: 400 }));

    const user = await User.findById(user_id);
    console.info('before some -> ' + user.balance);

    user.balance =
      transaction.type == 'expense'
        ? (user.balance * 100 + transaction.value * 100) / 100
        : (user.balance * 100 - transaction.value * 100) / 100;

    console.info('after some -> ' + user.balance);

    await user.save();

    return right(undefined);
  }

  async findByOwnerId(userId: string, reqQuery: Request): Promise<ResponseTransactionArray> {
    const queryObj = { ...reqQuery.query };

    if (!isIdValid(userId)) return left(new ValidationError({ message: err.invalidID, statusCode: 400 }));

    const currentYear = Number(queryObj.year) || new Date().getFullYear();
    const startDate = new Date(currentYear, 0, 1).toISOString();
    const endDate = new Date(currentYear, 11, 30).toISOString();

    if (queryObj.include === 'summary') {
      var data = await this.getTransactionDataForCharts(userId, startDate, endDate);
      return right({ transactions: data });
    }

    const transactions = await Transaction.find({
      owner: userId,
      date: {
        $gte: startDate,
        $lt: endDate,
      },
    })
      .sort({ date: 1 })
      .populate({ path: 'category', strictPopulate: false });

    if (queryObj.include === 'month') {
      return right({ transactions: this.filterTransactionsByMonth(transactions) });
    }

    return right({ transactions: transactions });
  }

  private async getTransactionDataForCharts(userId: string, startDate: string, endDate: string): Promise<MonthTransactions> {
    const transactions = await Transaction.find({
      owner: userId,
      date: {
        $gte: startDate,
        $lt: endDate,
      },
    }).sort({ date: 1 });

    var months = transactions.reduce((acc: MonthTransactions, element) => {
      const month = element.date.toLocaleString('pt-BR', { month: 'long' });

      if (!acc[month]) {
        acc[month] = [
          { type: 'Receitas', value: 0 },
          { type: 'Despesas', value: 0 },
          { type: 'Saldo', value: 0 },
        ];
      }

      if (Object.keys(acc).includes(month)) {
        if (element.type === 'income') acc[month][0].value += element.value;

        if (element.type === 'expense') acc[month][1].value += element.value;
      }

      acc[month][2].value = acc[month][0].value - acc[month][1].value;

      return acc;
    }, {});

    return months;
  }

  private filterTransactionsByMonth(transactions: ITransaction[]): MonthTransactions {
    var months = transactions.reduce((acc: MonthWithTransactions, element) => {
      const month = element.date.toLocaleString('pt-BR', { month: 'long' });

      if (!acc[month]) {
        acc[month] = [];
      }

      if (Object.keys(acc).includes(month)) {
        acc[month].push(element);
      }

      return acc;
    }, {});

    return months;
  }
}

export default transactionService;
