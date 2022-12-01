import { Schema } from 'mongoose';

export interface ICategory {
  title: string;
  iconName: string;
}

export const CategorySchema = new Schema<ICategory>({
  title: {
    type: String,
    required: true,
  },
  iconName: {
    type: String,
    required: true,
  },
});
