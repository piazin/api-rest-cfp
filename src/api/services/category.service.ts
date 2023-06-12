import { Types } from 'mongoose';
import { Category, ICategory } from '../models';
import { Either, left, right } from '../../errors/either';
import { InternalServerError } from '../../errors/error';
import Joi from 'joi';

interface CategoryResponse extends ICategory {
  _id: Types.ObjectId;
}

type Response = Either<InternalServerError, CategoryResponse>;

export class CategoryService {
  async create(categoryObj: ICategory): Promise<Response> {
    const schemaValidation = Joi.object({
      title: Joi.string().required().min(1).max(100).error(new Error('Titulo invalido!')),
      iconName: Joi.string().required().min(1).max(50).error(new Error('Nome do icone invalido!')),
      type: Joi.string().required().valid('income', 'expense'),
      colorHash: Joi.string().required().min(2).max(30),
    });

    const response = await Category.create({
      title: categoryObj.title,
      iconName: categoryObj.iconName,
      type: categoryObj.type,
    });

    return right(response);
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

    return categories;
  }
}
