import { Schema, Types } from 'mongoose';

export interface ITransaction {
  _id?: string | Types.ObjectId;
  value: number;
  date: Date;
  description: string;
  type: string;
  created_at: Date;
  category: Types.ObjectId;
  owner: Types.ObjectId | string;
}

export const TransactionModel = new Schema<ITransaction>({
  value: {
    type: Number,
    required: [true, 'A Transaction must have a value'],
  },
  date: {
    type: Date,
    required: [true, 'A Transaction must have a date'],
  },
  description: {
    type: String,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
  },
  type: {
    type: String,
    required: [true, 'A Transaction must have a type'],
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'A Transaction must have a owner'],
  },
});
