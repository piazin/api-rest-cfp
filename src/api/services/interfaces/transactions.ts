import { ITransaction } from '../../../api/models';

export interface MonthTransactions {
  [key: string]: {
    type: string;
    value: number;
  }[];
}

export interface MonthWithTransactions {
  [key: string]: ITransaction[];
}
