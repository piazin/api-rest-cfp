import { Either } from '../../../errors/either';
import { ITransaction } from '../../models';
import { ValidationError } from '../../../errors/error';
import { MonthTransactions, MonthWithTransactions } from '../interfaces/transactions';

export type ResponseTransaction = Either<ValidationError, ITransaction>;
export type ResponseTransactionVoid = Either<ValidationError, void | string>;
export type ResponseTransactionArray = Either<
  ValidationError,
  { transactions: MonthWithTransactions | MonthTransactions | ITransaction[] }
>;
