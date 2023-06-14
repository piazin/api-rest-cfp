import { Types } from 'mongoose';
import Joi from 'joi';
import { CreateCategoryDto } from './dto/CreateCategoryDto';
import { Category, ICategory, Transaction } from '../models';
import { Either, left, right } from '../../errors/either';
import { InternalServerError, ValidationError } from '../../errors/error';
import { isIdValid } from '../../utils/isIdValid';
import { isOwner } from '../../utils/isOwner';
import { UpdateCategoryDto } from './dto/UpdateCategoryDto';

interface CategoryResponse extends ICategory {
  _id: Types.ObjectId;
}

type Response = Either<InternalServerError, CategoryResponse | CategoryResponse[] | number>;

export class CategoryService {
  async findAll(ownerId: string): Promise<Response> {
    if (!isIdValid(ownerId)) return left(new ValidationError({ message: 'Id de usuário invalido!', statusCode: 400 }));

    const categories = await Category.find({ owner: ownerId }).select('-__v');

    return right(categories);
  }

  async create(createCategoryDto: CreateCategoryDto, id: string): Promise<Response> {
    const schemaValidation = Joi.object({
      title: Joi.string().required().min(1).max(100).error(new Error('Titulo invalido!')),
      iconName: Joi.string().required().min(1).max(50).error(new Error('Nome do icone invalido!')),
      type: Joi.string().required().valid('income', 'expense').error(new Error('O tipo da categoria deve ser income ou expense')),
      colorHash: Joi.string().required().min(2).max(30).error(new Error('Cor invalida')),
    });

    const { error, value } = schemaValidation.validate(createCategoryDto);
    if (error) return left(new ValidationError({ message: error.message, statusCode: 400 }));
    if (!isIdValid(id)) return left(new ValidationError({ message: 'Id de usuário invalido!', statusCode: 400 }));

    const category = await Category.create({ ...createCategoryDto, owner: id });

    return right(category);
  }

  async update(updateCategoryDto: UpdateCategoryDto, ownerId: string): Promise<Response> {
    const schemaValidation = Joi.object({
      _id: Joi.string().hex().length(24).required(),
      title: Joi.string().min(1).max(100).error(new Error('Titulo invalido!')),
      iconName: Joi.string().min(1).max(50).error(new Error('Nome do icone invalido!')),
      type: Joi.string().valid('income', 'expense').error(new Error('O tipo da categoria deve ser income ou expense')),
      colorHash: Joi.string().min(2).max(30).error(new Error('Cor invalida')),
    });

    const { error, value } = schemaValidation.validate(updateCategoryDto);
    if (error) return left(new ValidationError({ message: error.message, statusCode: 400 }));
    if (!isIdValid(ownerId)) return left(new ValidationError({ message: 'Id de usuário invalido!', statusCode: 400 }));
  }

  async delete(categoryId: string, ownerId: string): Promise<Response> {
    if (!isIdValid(ownerId)) return left(new ValidationError({ message: 'Id de usuário invalido!', statusCode: 400 }));
    if (!isIdValid(categoryId)) return left(new ValidationError({ message: 'Id da categoria invalido', statusCode: 400 }));

    const transactionsWithThisCategory = await Transaction.find({ category: categoryId });
    if (transactionsWithThisCategory?.length > 0)
      return left(new ValidationError({ message: 'Existem transações com está categoria', statusCode: 405 }));

    const category = await Category.findById(categoryId);
    if (!category) return left(new ValidationError({ message: 'Categoria não encontrada', statusCode: 404 }));
    if (!isOwner(category.owner, ownerId)) return left(new ValidationError({ message: 'Não autorizado!', statusCode: 401 }));

    const deletedCategory = await Category.deleteOne({ _id: categoryId, owner: ownerId });

    return right(deletedCategory.deletedCount);
  }

  async addDefaultCategoriesToUser(ownerId: Types.ObjectId) {
    const defaultCategories = [
      {
        title: 'Alimentação',
        iconName: 'food-fork-drink',
        type: 'expense',
        colorHash: '#418CFA',
      },
      {
        title: 'Entretenimento',
        iconName: 'gamepad-variant-outline',
        type: 'expense',
        colorHash: '#5D7F8B',
      },
      {
        title: 'Lazer',
        iconName: 'heart',
        type: 'expense',
        colorHash: '#7D4CFF',
      },
      {
        title: 'Streams',
        iconName: 'netflix',
        type: 'expense',
        colorHash: '#F74434',
      },
      {
        title: 'Cartão',
        iconName: 'credit-card',
        type: 'expense',
        colorHash: '#8E24AA',
      },
      {
        title: 'Faculdade',
        iconName: 'school-outline',
        type: 'expense',
        colorHash: '#fbc207',
      },
      {
        title: 'Salário',
        iconName: 'bank',
        type: 'income',
        colorHash: '#29C06D',
      },
      {
        title: 'Economias',
        iconName: 'piggy-bank',
        type: 'income',
        colorHash: '#229788',
      },
    ];

    for (const defaultCategory of defaultCategories) {
      await Category.create({
        ...defaultCategory,
        owner: ownerId,
      });
    }
  }
}
