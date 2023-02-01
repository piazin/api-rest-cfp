import { Schema } from 'mongoose';

export interface ICategory {
  title: string;
  iconName: string;
  type: 'expense' | 'income';
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
  type: String,
});
