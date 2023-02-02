import { model } from 'mongoose';
import { TokenModel, IToken } from './Token';
import { UserModel, IUser } from './User';
import { CategoryModel, ICategory } from './Category';
import { TransactionModel, ITransaction } from './Transaction';
import { ProfilePicModel, IProfilePic } from './ProfilePic';

const User = model('User', UserModel);
const Token = model('Token', TokenModel);
const Category = model('Category', CategoryModel);
const ProfilePic = model('Profilepic', ProfilePicModel);
const Transaction = model('Transaction', TransactionModel);

export {
  User,
  IUser,
  ProfilePic,
  IProfilePic,
  Transaction,
  ITransaction,
  Token,
  IToken,
  Category,
  ICategory,
};
