import { model } from 'mongoose';
import { CategorySchema } from '../models/Category';

// @types
import { ICategory } from '../models/Category';

const Category = model('Category', CategorySchema);

class categoryService {
  async create(categoryObj: ICategory) {
    const response = await Category.create({
      title: categoryObj.title,
      iconName: categoryObj.iconName,
    });

    return response;
  }

  async findAll() {
    const response = await Category.find();
    return response;
  }
}

export default categoryService;
