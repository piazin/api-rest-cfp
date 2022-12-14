import { Schema, Types, model } from 'mongoose';
import moment from 'moment';

export interface IToken {
  code: number;
  user_id: Types.ObjectId;
  used: boolean;
  checked: boolean;
  created_at: number;
  expire_timestamp: number;
}

const TokenSchema = new Schema<IToken>({
  code: {
    type: Number,
    required: true,
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'required user id'],
  },
  used: {
    type: Boolean,
    default: false,
  },
  checked: {
    type: Boolean,
    default: false,
  },
  created_at: {
    type: Number,
    default: moment().unix(),
  },
  expire_timestamp: {
    type: Number,
    required: true,
  },
});

export const Token = model('Token', TokenSchema);
