import { Request, Response } from 'express';
import { categoryService } from '../services';
import { responseInternalError } from '../../errors/responseInternalError';

export async function findAll(req: Request, res: Response) {
  try {
    const response = await categoryService.findAll(req.user?.id);
    return response.isRight()
      ? res.status(200).json({
          status: 200,
          data: response.value,
        })
      : res.status(response.value.statusCode).json({
          status: response.value.statusCode,
          message: response.value.message,
        });
  } catch ({ message }) {
    console.error('🚀 ~ file: category.controller.ts:13 ~ findAll ~ message:', message);
    responseInternalError(res);
  }
}

export async function create(req: Request, res: Response) {
  try {
    const response = await categoryService.create(req.body, req.user?.id);
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

export async function remove(req: Request, res: Response) {
  try {
    const response = await categoryService.delete(req.params.id, req.user?.id);
    return response.isRight()
      ? res.status(200).json({
          status: 200,
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
