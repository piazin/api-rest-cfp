import { Request, Response } from 'express';
import transactionsService from '../services/transaction.service';

const transaction = new transactionsService();

interface IRequest extends Request {
  user_id: string;
}

export async function getTransactionByUserId(req: IRequest, res: Response) {
  const response = await transaction.findByOwnerId(req.user!.id, req);
  return response.isRight()
    ? res.status(200).json({
        status: 200,
        results: response.value?.length,
        data: { transactions: response.value },
      })
    : res.status(response.value.statusCode).json({
        status: response.value.statusCode,
        message: response.value.message,
      });
}

export async function createTransaction(req: Request, res: Response) {
  const response = await transaction.create(req.body, req.user!.id);
  return response.isRight()
    ? res.status(201).json({ status: 201, data: response.value })
    : res.status(response.value.statusCode).json({
        status: response.value.statusCode,
        message: response.value.message,
      });
}

export async function updateTransaction(req: Request, res: Response) {
  const response = await transaction.update(req.params.id, req.user!.id, req.body);
  return response.isRight()
    ? res.status(201).json({ status: 200, data: response.value })
    : res.status(response.value.statusCode).json({
        status: response.value.statusCode,
        message: response.value.message,
      });
}

export async function removeTransaction(req: Request, res: Response) {
  const response = await transaction.delete(req.params.id, req.user!.id);
  return response.isRight()
    ? res.status(204).json({ status: 204, data: response.value })
    : res.status(response.value.statusCode).json({
        status: response.value.statusCode,
        message: response.value.message,
      });
}
