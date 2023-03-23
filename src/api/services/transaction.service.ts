import { Category, User } from '../models';
import { Request } from 'express';
import { isOwner } from '../../utils/isOwner';
import { isIdValid } from '../../utils/isIdValid';
import { ValidationError } from '../../errors/error';
import { Transaction, ITransaction } from '../models';
import { Either, left, right } from '../../errors/either';
import constants from '../../constants/transaction.constants';
import { validateTransactionData } from '../../helpers/validateTransactionData';

const {
  err: { invalidID, isNotOwner },
} = constants;

type ResponseTransaction = Either<ValidationError, ITransaction>;
type ResponseTransactionVoid = Either<ValidationError, void | string>;
type ResponseTransactionArray = Either<ValidationError, ITransaction[] | IChartData[]>;

interface IChartData {
  type: string;
  value: number;
}

class transactionService {
  async create(transaction: ITransaction, user_id: string): Promise<ResponseTransaction> {
    const { isValid, err_message } = validateTransactionData(transaction);
    if (!isValid) return left(new ValidationError({ message: err_message, statusCode: 400 }));

    if (transaction.type != 'expense' && transaction.type != 'income')
      return left(new ValidationError({ message: 'Tipo de transação inválida', statusCode: 400 }));

    if (!isIdValid(user_id))
      return left(new ValidationError({ message: invalidID, statusCode: 400 }));

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

  async update(
    id: string,
    user_id: string,
    newTransactionData: ITransaction
  ): Promise<ResponseTransaction> {
    const { isValid, err_message } = validateTransactionData(newTransactionData);
    if (!isValid) return left(new ValidationError({ message: err_message, statusCode: 400 }));

    if (!isIdValid(user_id) || !isIdValid(id))
      return left(new ValidationError({ message: invalidID, statusCode: 400 }));

    if (newTransactionData.type !== 'expense' && newTransactionData.type !== 'income')
      return left(new ValidationError({ message: 'Tipo de transação inválida', statusCode: 400 }));

    const transactionExisting = await Transaction.findById(id);

    if (!transactionExisting)
      return left(new ValidationError({ message: invalidID, statusCode: 400 }));
    if (!isOwner(user_id, transactionExisting.owner))
      return left(new ValidationError({ message: isNotOwner, statusCode: 401 }));

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
    if (!isIdValid(id) || !isIdValid(user_id))
      return left(new ValidationError({ message: invalidID, statusCode: 400 }));

    const transaction = await Transaction.findById(id);
    if (!transaction) return left(new ValidationError({ message: invalidID, statusCode: 400 }));

    if (!isOwner(user_id, transaction.owner))
      return left(new ValidationError({ message: isNotOwner, statusCode: 403 }));

    const deletedTransaction = await Transaction.findByIdAndDelete(id);
    if (!deletedTransaction)
      return left(
        new ValidationError({ message: 'Não foi possível excluir a transação', statusCode: 400 })
      );

    const user = await User.findById(user_id);
    user.balance =
      transaction.type == 'expense'
        ? (user.balance * 100 + transaction.value * 100) / 100
        : (user.balance * 100 - transaction.value * 100) / 100;

    await user.save();

    return right(undefined);
  }

  async findByOwnerId(userId: string, reqQuery: Request): Promise<ResponseTransactionArray> {
    const queryObj = { ...reqQuery.query };

    if (!isIdValid(userId))
      return left(new ValidationError({ message: invalidID, statusCode: 400 }));

    if (queryObj.chart === 'pie') {
      var data = await this.getTransactionDataForCharts('pie', userId);
      return right(data);
    }

    const transactions = await Transaction.find({ owner: userId })
      .sort('-created_at')
      .populate({ path: 'category', strictPopulate: false });

    return right(transactions);
  }

  private async getTransactionDataForCharts(
    chartType: 'pie' | 'bar',
    userId: string
  ): Promise<IChartData[]> {
    if (chartType == 'pie') {
      const expenseTypeTransactions = await Transaction.find({
        owner: userId,
        type: 'expense',
      });

      const incomeTypeTransactions = await Transaction.find({
        owner: userId,
        type: 'income',
      });

      var date = incomeTypeTransactions.map((element) =>
        element.created_at.toLocaleString('pt-BR', { month: 'long' })
      );
      console.log('🚀 ~ file: transaction.service.ts:171 ~ transactionService ~ date:', date);

      var expenseBalance = 0;
      var incomeBalance = 0;
      for (let expense of expenseTypeTransactions) {
        expenseBalance += expense.value;
      }

      for (let income of incomeTypeTransactions) {
        incomeBalance += income.value;
      }

      return [
        { type: 'Despesas', value: expenseBalance },
        { type: 'Receitas', value: incomeBalance },
      ];
    }
  }
}

export default transactionService;
