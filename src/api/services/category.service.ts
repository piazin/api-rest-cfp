import { Category, ICategory } from '../models';

export class CategoryService {
  async create(categoryObj: ICategory) {
    const response = await Category.create({
      title: categoryObj.title,
      iconName: categoryObj.iconName,
      type: categoryObj.type,
    });

    return response;
  }

  async findAll() {
    const response = await Category.find();
    return response;
  }
}
