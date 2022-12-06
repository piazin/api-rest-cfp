import { model } from 'mongoose';
import { CategorySchema } from '../models/Category';

// @types
import { ICategory } from '../models/Category';

const Category = model('category', CategorySchema);

class categoryService {
  async createService(categoryObj: ICategory) {
    const response = await Category.create({
      title: categoryObj.title,
      iconName: categoryObj.iconName,
    });

    return response;
  }

  async findAllService() {
    const response = await Category.find();
    return response;
  }
}

export default categoryService;
