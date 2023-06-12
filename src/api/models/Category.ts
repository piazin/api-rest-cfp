import { Schema, Types } from 'mongoose';

export interface ICategory {
  title: string;
  iconName: string;
  type: 'expense' | 'income';
  colorHash: string;
  owner: Types.ObjectId | string;
}

export const CategoryModel = new Schema<ICategory>({
  title: {
    type: String,
    required: true,
  },
  iconName: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  colorHash: {
    type: String,
    required: true,
  },
});
