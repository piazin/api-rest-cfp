import { Request, Response } from 'express';
import { responseInternalError } from '../../errors/responseInternalError';
import { categoryService } from '../services';

export async function findAll(req: Request, res: Response) {
  try {
    const response = await categoryService.findAllWithTransactions();
    return res.status(200).json({
      status: 200,
      data: response,
    });
  } catch ({ message }) {
    console.error('🚀 ~ file: category.controller.ts:13 ~ findAll ~ message:', message);
    responseInternalError(res);
  }
}

export async function create(req: Request, res: Response) {
  try {
    const response = await categoryService.create(req.body);
    return response.isRight()
      ? res.status(201).json({
          status: 201,
          data: response.value,
        })
      : res.status(response.value.statusCode).json({
          status: response.value.statusCode,
          message: response.value.message,
        });
  } catch (error) {
    responseInternalError(res);
  }
}
