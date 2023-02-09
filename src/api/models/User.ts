import { Schema, Types, model } from 'mongoose';
import jwt from 'jsonwebtoken';
import config from '../../config';
import bcrypt from 'bcrypt';

const { jwt_secret } = config;

export interface IUser {
  _id?: Types.ObjectId;
  __v?: number;
  name: string;
  email: string;
  password: string;
  balance?: number;
  avatar: object;
  transactions?: string;
  created_at?: Date;
  compareHash: (password: string) => boolean;
  generateJwt: () => string;
}

const UserModel = new Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  balance: {
    type: Number,
    required: true,
    default: 0.0,
  },
  transactions: {
    type: String,
    default: null,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  avatar: {
    type: Object,
    default: {},
  },
});

UserModel.pre('save', async function (next) {
  if (!this.isNew || !this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 10);
});

UserModel.pre('findOneAndUpdate', async function (next) {
  const data: any = this.getUpdate();
  if (!data.password) return next();

  data.password = await bcrypt.hash(data.password, 10);
  next();
});

UserModel.methods = {
  compareHash(hash: string) {
    return bcrypt.compareSync(hash, this.password);
  },

  generateJwt() {
    return jwt.sign({ id: this._id }, jwt_secret, { expiresIn: '7d' });
  },
};

export { UserModel };
