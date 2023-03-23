import { Types } from 'mongoose';
import { Category, ICategory } from '../models';
import { Either, left, right } from '../../errors/either';
import { InternalServerError } from '../../errors/error';

interface CategoryResponse extends ICategory {
  _id: Types.ObjectId;
}

type Response = Either<InternalServerError, CategoryResponse>;

export class CategoryService {
  async create(categoryObj: ICategory): Promise<Response> {
    if (!categoryObj.iconName) {
      return left(
        new InternalServerError({
          message: 'Titulo e nome do icone são obrigatórios',
          statusCode: 400,
        })
      );
    }

    const response = await Category.create({
      title: categoryObj.title,
      iconName: categoryObj.iconName,
      type: categoryObj.type,
    });

    return right({
      _id: response._id,
      title: response.title,
      iconName: response.iconName,
      type: response.type,
    });
  }

  async findAll(): Promise<CategoryResponse[]> {
    const response = await Category.find().select('-__v');

    return response;
  }

  async findAllWithTransactions() {
    const categories = await Category.find().populate({
      path: 'transaction',
      strictPopulate: false,
    });

    console.log(categories);

    return categories;
  }
}
