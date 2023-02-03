import { Request, Response } from 'express';
import transactionsService from '../services/transaction.service';

const transaction = new transactionsService();

interface IRequest extends Request {
  user_id: string;
}

export async function getTransactionByUserId(req: IRequest, res: Response) {
  const response = await transaction.findByOwnerID(req.params.id, req);
  return response.isRight()
    ? res.status(200).json({
        status: 200,
        results: response.value?.length | 0,
        data: { transactions: response.value },
      })
    : res.status(response.value.statusCode).json({
        status: response.value.statusCode,
        message: response.value.message,
      });
}

export async function createTransaction(req: Request, res: Response) {
  const response = await transaction.create(req.body, req.user.user_id);
  return response.isRight()
    ? res.status(201).json({ status: 201, data: response.value })
    : res.status(response.value.statusCode).json({
        status: response.value.statusCode,
        message: response.value.message,
      });
}

export async function updateTransaction(req: Request, res: Response) {
  const response = await transaction.update(req.params.id, req.body);
  return response.isRight()
    ? res.status(201).json({ status: 200, data: response.value })
    : res.status(response.value.statusCode).json({
        status: response.value.statusCode,
        message: response.value.message,
      });
}

export async function removeTransaction(req: Request, res: Response) {
  const response = await transaction.delete(req.params.id);
  return response.isRight()
    ? res.status(204).json({ status: 204, data: response.value })
    : res.status(response.value.statusCode).json({
        status: response.value.statusCode,
        message: response.value.message,
      });
}
