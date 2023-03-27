import { Types } from 'mongoose';

export interface ResponseUserProps {
  _id: Types.ObjectId;
  name: string;
  email: string;
  balance: number;
  transactions: string;
  avatar: object;
  created_at: Date;
  token?: string;
}
