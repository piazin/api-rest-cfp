import { Schema } from "mongoose";

export interface ICategory {
  title: string;
}

export const CategorySchema = new Schema<ICategory>({
  title: {
    type: String,
    required: true,
    unique: true,
  },
});
