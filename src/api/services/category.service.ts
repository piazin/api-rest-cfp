import { model } from "mongoose";
import { CategorySchema } from "../models/Category";

// @types
import { ICategory } from "../models/Category";

const Category = model("category", CategorySchema);

class categoryService {
  async create(categoryObj: ICategory) {
    const response = await Category.create({
      title: categoryObj.title,
    });

    return response;
  }
}

export default categoryService;
